import React, { useRef } from 'react';
import { SearchInput } from 'hds-react';
import { uniqBy } from 'lodash';
import { useTranslation } from 'react-i18next';
import { Coordinate } from 'ol/coordinate';
import { doAddressSearch } from '../../utils';

type Props = {
  onAddressSelect: (coordinate: Coordinate | undefined) => void;
};

type Address = {
  label: string;
  coordinate: Coordinate;
};

const AddressSearch: React.FC<Props> = ({ onAddressSelect }) => {
  const { t } = useTranslation();
  const suggestions = useRef([] as Address[]);
  const abortController = useRef(null as AbortController | null);

  async function searchAddresses(searchValue: string) {
    try {
      const controller = new AbortController();
      abortController.current = controller;

      const { data } = await doAddressSearch(searchValue, controller);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const suggestionItems: Address[] = data.features.map((feature: any) => {
        // Use Finnish street name as a label if it seems that user was searching for that,
        // otherwise use Swedish street name
        let label = feature.properties.katunimi.toLowerCase().includes(searchValue.toLowerCase())
          ? feature.properties.katunimi
          : feature.properties.gatan;

        // Append street number to label if it exists in the result
        if (feature.properties.osoitenumero_teksti) {
          label += ` ${feature.properties.osoitenumero_teksti}`;
        }
        return {
          label,
          coordinate: feature.geometry.coordinates,
        };
      });

      const uniqueItems = uniqBy(suggestionItems, 'label');
      suggestions.current = uniqueItems;
      return uniqueItems;
    } catch (error) {
      return [];
    }
  }

  function getSuggestions(searchValue: string) {
    return searchAddresses(searchValue);
  }

  function handleChange() {
    if (abortController.current) {
      // Cancel current search request
      abortController.current.abort();
    }
  }

  function handleSubmit(searchValue: string) {
    const address = suggestions.current.find((value) => value.label === searchValue);
    onAddressSelect(address?.coordinate);
  }

  return (
    <SearchInput<Address>
      label=""
      placeholder={t('common:components:searchInput:placeholder')}
      clearButtonAriaLabel={t('common:components:multiselect:clear')}
      searchButtonAriaLabel={t('common:components:searchInput:searchButtonAriaLabel')}
      suggestionLabelField="label"
      getSuggestions={getSuggestions}
      onChange={handleChange}
      onSubmit={handleSubmit}
    />
  );
};

export default AddressSearch;
