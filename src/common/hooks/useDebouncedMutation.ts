import { debounce } from 'lodash';
import { useEffect, useRef } from 'react';
import { MutationFunction, UseMutationOptions, UseMutationResult, useMutation } from 'react-query';

/**
 * Wrapper for the react-query useMutation hook that debounces the mutate function.
 */
export default function useDebouncedMutation<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown,
>(
  mutationFn: MutationFunction<TData, TVariables>,
  options?: Omit<UseMutationOptions<TData, TError, TVariables, TContext>, 'mutationKey'>,
  debounceTime: number = 1000,
): UseMutationResult<TData, TError, TVariables, TContext> {
  const mutationResults = useMutation(mutationFn, options);

  // Keep a ref to the latest react-query mutate function so the debounced wrapper
  // always calls the current mutate even if react-query returns a new function
  // identity on re-renders. Use a ref for the debounced wrapper so it isn't
  // recreated on every render which would defeat the debounce.
  const mutateRef = useRef(mutationResults.mutate);
  mutateRef.current = mutationResults.mutate;

  const debouncedRef = useRef<ReturnType<typeof debounce>>();

  useEffect(() => {
    // create debounced wrapper that calls the latest mutateRef.current
    // Capture the exact mutate function type so we can forward arguments
    type MutateFn = typeof mutationResults.mutate;
    debouncedRef.current = debounce(
      (...args: Parameters<MutateFn>) => {
        // forward args to the current mutate function (use unknown[] for safe casting)
        const currentMutate = mutateRef.current as MutateFn;
        return currentMutate(...(args as unknown as Parameters<MutateFn>));
      },
      debounceTime,
      { leading: true, trailing: false },
    );

    return () => {
      // cancel outstanding debounced calls when debounceTime changes / unmount
      debouncedRef.current?.cancel();
    };
    // recreate only when debounceTime changes
    // mutationResults is intentionally not included in deps because we forward
    // to the latest mutate via mutateRef; adding it would recreate debounced
    // wrapper too often and break stability.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounceTime]);

  // Expose the debounced mutate function while preserving other mutation results
  // Build a wrapper that matches react-query's mutate signature
  type MutateFn = typeof mutationResults.mutate;
  const mutateWrapper = ((...args: Parameters<MutateFn>) => {
    const deb = debouncedRef.current as ((...a: unknown[]) => unknown) | undefined;
    return deb ? deb(...(args as unknown[])) : undefined;
  }) as unknown as MutateFn;

  return {
    ...mutationResults,
    mutate: mutateWrapper,
  };
}
