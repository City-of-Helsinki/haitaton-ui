import { FieldValues, Path, UseFormTrigger } from 'react-hook-form';

/**
 * Change form step if validation is successful
 * @param handleStepChange function that is called if form is valid
 * @param fieldsToValidate array of form fields that are validated
 * @param trigger react-hook-form trigger function
 */
export async function changeFormStep<T extends FieldValues>(
  handleStepChange: () => void,
  fieldsToValidate: Path<T>[],
  trigger: UseFormTrigger<T>
) {
  const isValid = await trigger(fieldsToValidate);

  if (isValid) {
    handleStepChange();
  }
}
