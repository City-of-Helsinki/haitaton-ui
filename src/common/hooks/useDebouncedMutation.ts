import { debounce } from 'lodash';
import { useMemo } from 'react';
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

  const debouncedMutation = useMemo(
    () =>
      debounce(mutationResults.mutate, debounceTime, {
        leading: true,
        trailing: false,
      }),
    [debounceTime, mutationResults.mutate],
  );

  return {
    ...mutationResults,
    mutate: debouncedMutation,
  };
}
