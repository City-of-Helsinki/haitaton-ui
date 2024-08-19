import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Flex } from '@chakra-ui/react';
import SearchInput from '../../../common/components/searchInput/SearchInput';
import { HankeUser } from './hankeUser';
import { CustomerType } from '../../application/types/application';

type Props = {
  fieldName: string;
  customerType: CustomerType;
  onUserSelect: (user: HankeUser) => void;
  hankeUsers?: HankeUser[];
  required?: boolean;
};

export default function UserSearchInput({
  fieldName,
  customerType,
  onUserSelect,
  hankeUsers,
  required,
}: Readonly<Props>) {
  const { t } = useTranslation();
  const suggestions = useRef([] as (HankeUser & { label: string })[]);

  async function getSuggestions(searchString: string) {
    const suggestionsItems =
      hankeUsers
        ?.map((user) => ({
          ...user,
          label: `${user.etunimi} ${user.sukunimi}`,
        }))
        .filter((user) => user.label.toLowerCase().includes(searchString.toLowerCase())) ?? [];
    suggestions.current = suggestionsItems;
    return suggestionsItems;
  }

  function handleSubmit(value: string) {
    const user = suggestions.current.find((suggestion) => suggestion.label === value);
    if (user) {
      onUserSelect(user);
    }
  }

  return (
    <SearchInput
      name={fieldName}
      id={customerType}
      label={
        <Flex alignItems="flex-end">
          {t('form:yhteystiedot:labels:nimi')}
          {required ? (
            <Box ml="var(--spacing-2-xs)" fontSize="var(--fontsize-body-xl)" lineHeight={1}>
              *
            </Box>
          ) : null}
        </Flex>
      }
      suggestionKeyField="id"
      suggestionLabelField="label"
      hideSearchButton
      getSuggestions={getSuggestions}
      onSubmit={handleSubmit}
    />
  );
}
