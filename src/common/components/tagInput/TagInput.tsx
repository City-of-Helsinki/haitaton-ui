import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Flex } from '@chakra-ui/react';
import { Button, Notification, Tag, TextInput } from 'hds-react';
import { uniq } from 'lodash';

type Props = {
  id: string;
  label: string;
  tags: string[];
  placeholder?: string;
  helperText?: string;
  className?: string;
  inputClassName?: string;
  pattern?: string;
  errorText?: string;
  tagDeleteButtonAriaLabel?: (tag: string) => string;
  onChange?: (tags: string[]) => void;
};

export default function TagInput({
  id,
  label,
  tags,
  placeholder,
  helperText,
  className,
  inputClassName,
  pattern,
  errorText,
  tagDeleteButtonAriaLabel,
  onChange,
}: Readonly<Props>) {
  const { t } = useTranslation();

  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const inputValid = inputRef.current?.validity.valid;
  const [inputSubmitted, setInputSubmitted] = useState(false);
  const showError = inputSubmitted && !inputValid && errorText;

  function addTag() {
    setInputSubmitted(true);
    if (inputValue !== '' && inputValid) {
      onChange && onChange(tags.concat(inputValue));
      setInputValue('');
      setInputSubmitted(false);
    }
  }

  function deleteTag(deletedTag: string) {
    onChange && onChange(tags.filter((tag) => tag !== deletedTag));
  }

  return (
    <div className={className}>
      <Box maxWidth="max-content">
        <Flex
          alignItems={helperText ? 'center' : 'flex-end'}
          gap="var(--spacing-xs)"
          marginBottom="var(--spacing-2-xs)"
          wrap="wrap"
        >
          <TextInput
            id={id}
            className={inputClassName}
            label={label}
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                addTag();
              }
            }}
            ref={inputRef}
            pattern={pattern}
            placeholder={placeholder}
            helperText={helperText}
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
            crossOrigin=""
          />
          <Button variant="secondary" onClick={addTag} data-testid={`${id}-addButton`}>
            {t('common:increment')}
          </Button>
        </Flex>
        {showError && (
          <Box marginBottom="var(--spacing-s)">
            <Notification label={errorText} type="error" size="small">
              {errorText}
            </Notification>
          </Box>
        )}
      </Box>
      <Flex gap="var(--spacing-2-xs)" wrap="wrap">
        {uniq(tags).map((tag) => (
          <Tag
            deleteButtonAriaLabel={
              tagDeleteButtonAriaLabel ? tagDeleteButtonAriaLabel(tag) : undefined
            }
            onDelete={() => {
              deleteTag(tag);
            }}
            key={tag}
          >
            {tag}
          </Tag>
        ))}
      </Flex>
    </div>
  );
}
