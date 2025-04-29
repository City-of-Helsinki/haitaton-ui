import { get } from 'lodash';
import { FieldErrors, FieldPath, FieldValues, UseFormTrigger } from 'react-hook-form';
import { ObjectSchema } from 'yup';

/**
 * Change form step if validation is successful
 * @param handleStepChange function that is called if form is valid
 * @param fieldsToValidate array of form fields that are validated
 * @param trigger react-hook-form trigger function
 * @param errors form validation errors
 * @param errorsToIgnore error keys to ignore
 */
export function changeFormStep<T extends FieldValues>(
  handleStepChange: () => void,
  fieldsToValidate: FieldPath<T>[],
  trigger: UseFormTrigger<T>,
  errors?: FieldErrors<T>,
  errorsToIgnore?: string[],
) {
  // If there are form validation errors and error keys to ignore are given,
  // don't trigger validation if all errors are those to ignore.
  const ignoreErrors =
    !errors || !errorsToIgnore
      ? false
      : fieldsToValidate.every((field) => {
          const message = get(errors, field)?.message as unknown as { key: string } | undefined;
          const errorKey = message?.key;
          if (!message) {
            return true;
          }
          if (!errorKey) {
            return false;
          }
          return errorsToIgnore.includes(errorKey);
        });

  if (ignoreErrors) {
    handleStepChange();
  } else {
    trigger(fieldsToValidate, { shouldFocus: true }).then((isValid) => {
      if (isValid) {
        handleStepChange();
      }
    });
  }
}

export function isPageValid<T extends FieldValues, T2 = T>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: ObjectSchema<any>,
  pageFieldPaths: FieldPath<T>[],
  formValues: T2,
): boolean {
  let isValid = true;
  for (let i = 0; i < pageFieldPaths.length; i += 1) {
    const path = pageFieldPaths[i];
    try {
      schema.validateSyncAt(path, formValues);
    } catch (error) {
      isValid = false;
      break;
    }
  }
  return isValid;
}

export function getFieldPaths<T extends FieldValues>(
  node: object | Array<object> | null,
  pathToNode: FieldPath<T>,
): FieldPath<T>[] {
  if (node === null) {
    return [];
  }

  let fieldPaths: string[] = [];
  if (Array.isArray(node)) {
    node.forEach((obj, index) => {
      fieldPaths = fieldPaths.concat(
        Object.keys(obj).map((key) => `${pathToNode}.${index}.${key}`),
      );
    });
  } else {
    fieldPaths = Object.keys(node).map((key) => `${pathToNode}.${key}`);
  }

  return fieldPaths as FieldPath<T>[];
}
