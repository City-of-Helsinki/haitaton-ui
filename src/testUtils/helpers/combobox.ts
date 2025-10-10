import { screen } from '../../testUtils/render';
import { UserEvent } from '@testing-library/user-event/dist/types/setup/setup';

/**
 * Select an option from an HDS Combobox by matching the field label (accessible name) and option text.
 * If multiple comboboxes match the label, an optional index can disambiguate.
 *
 * @param user user-event instance
 * @param params.labelRegex Regex matching the accessible name (label) of the combobox
 * @param params.optionRegex Regex matching the text content of the desired option
 * @param params.index Optional zero-based index selecting among multiple matching comboboxes
 */
export async function selectComboboxOption(
  user: UserEvent,
  params: { labelRegex: RegExp; optionRegex: RegExp; index?: number },
): Promise<void> {
  const { labelRegex, optionRegex, index } = params;
  const boxes = screen.getAllByRole('combobox', { name: labelRegex });
  const target = index !== undefined ? boxes[index] : boxes[0];
  await user.click(target);
  const option = await screen.findByText(optionRegex);
  await user.click(option);
}
