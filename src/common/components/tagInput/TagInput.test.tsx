import { render, screen } from '../../../testUtils/render';
import TagInput from './TagInput';

test('Should show existing tags', async () => {
  render(
    <TagInput id="test-input" label="Tag Input" tags={['Tag1', 'Tag2']} onChange={() => {}} />,
  );

  expect(screen.getByText('Tag1')).toBeInTheDocument();
  expect(screen.getByText('Tag2')).toBeInTheDocument();
});

test('Should be able to add new tags with add button', async () => {
  const newTag = 'Tag1';
  const handleTagsChange = jest.fn();
  const { user } = render(
    <TagInput id="test-input" label="Tag Input" tags={[]} onChange={handleTagsChange} />,
  );
  await user.type(screen.getByRole('textbox'), newTag);
  await user.click(screen.getByRole('button'));

  expect(handleTagsChange).toHaveBeenCalledWith([newTag]);
});

test('Should be able to add new tags by pressing Enter', async () => {
  const newTag = 'Tag2';
  const handleTagsChange = jest.fn();
  const { user } = render(
    <TagInput id="test-input" label="Tag Input" tags={[]} onChange={handleTagsChange} />,
  );
  await user.type(screen.getByRole('textbox'), newTag);
  await user.keyboard('{Enter}');

  expect(handleTagsChange).toHaveBeenCalledWith([newTag]);
});

test('Should be able to remove tags', async () => {
  const handleTagsChange = jest.fn();
  const { user } = render(
    <TagInput
      id="test-input"
      label="Tag Input"
      tags={['Tag1', 'Tag2']}
      onChange={handleTagsChange}
      tagDeleteButtonAriaLabel={(tag) => `Delete ${tag}`}
    />,
  );

  await user.click(screen.getByRole('button', { name: 'Delete Tag1' }));

  expect(handleTagsChange).toHaveBeenCalledWith(['Tag2']);
});

test('Should show validation error if new tag does not match the provided pattern', async () => {
  const newTag = 'tag3';
  const errorText = 'Invalid tag';
  const handleTagsChange = jest.fn();
  const { user } = render(
    <TagInput
      id="test-input"
      label="Tag Input"
      tags={[]}
      onChange={handleTagsChange}
      pattern="^Tag"
      errorText={errorText}
    />,
  );
  await user.type(screen.getByRole('textbox'), newTag);
  await user.keyboard('{Enter}');

  expect(screen.getAllByText(errorText)[0]).toBeInTheDocument();
});
