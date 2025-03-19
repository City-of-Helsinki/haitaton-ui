import { render } from '../../../testUtils/render';
import ConfirmationDialog from './ConfirmationDialog';

describe('confirmationDialog', () => {
  it('renders and functions correctly', () => {
    const titleText = 'title text';
    const descriptionText = 'description text';
    const buttonText = 'button text';
    const open = true;
    const handleClose = jest.fn();
    const handleMainAction = jest.fn();
    const variant = 'primary';

    const renderedDialog = render(
      <ConfirmationDialog
        title={titleText}
        description={descriptionText}
        isOpen={open}
        close={handleClose}
        mainAction={handleMainAction}
        mainBtnLabel={buttonText}
        variant={variant}
      />,
    );

    expect(renderedDialog.getByTestId('dialog-description-test')).toHaveTextContent(
      descriptionText,
    );
    expect(renderedDialog.getByTestId('dialog-button-test')).toHaveTextContent(buttonText);
    renderedDialog.getByTestId('dialog-button-test').click();
    expect(handleMainAction).toHaveBeenCalledTimes(1);
    renderedDialog.getByTestId('dialog-cancel-test').click();
    expect(handleMainAction).toHaveBeenCalledTimes(1);
  });

  it('renders error message', () => {
    const titleText = 'title text';
    const descriptionText = 'description text';
    const buttonText = 'button text';
    const open = true;
    const variant = 'primary';
    const errorMessage = 'error occurred';

    const renderedDialog = render(
      <ConfirmationDialog
        title={titleText}
        description={descriptionText}
        isOpen={open}
        close={() => {}}
        mainAction={() => {}}
        mainBtnLabel={buttonText}
        variant={variant}
        errorMsg={errorMessage}
      />,
    );

    expect(renderedDialog.getAllByText(errorMessage)).toHaveLength(2);
  });
});
