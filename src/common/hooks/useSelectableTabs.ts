import React, { useEffect, useMemo, useState } from 'react';

type Options = {
  selectLastTabOnChange: boolean;
};

/**
 * Workaround for programmatically selecting tab in HDS tab component.
 * Create refs based on the amount of tabs
 * and return the array of ref along with SetStateAction
 * to set active index to select a tab.
 */
export default function useSelectableTabs(
  collection: unknown[],
  options: Options = { selectLastTabOnChange: false },
) {
  const numberOfTabs = collection.length;
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [stateUpdate, setStateUpdate] = useState(0);

  const tabRefs = useMemo(() => {
    return new Array(numberOfTabs).fill(0).map(() => React.createRef<HTMLDivElement>());
  }, [numberOfTabs]);

  useEffect(() => {
    if (tabRefs.length > 0) {
      tabRefs[selectedTabIndex]?.current?.click();
    }
  }, [tabRefs, selectedTabIndex, stateUpdate]);

  useEffect(() => {
    if (options.selectLastTabOnChange) {
      setStateUpdate((current) => current + 1);
    }
  }, [collection, options.selectLastTabOnChange]);

  // When number of tabs changes,
  // select the last one
  useEffect(() => {
    if (options.selectLastTabOnChange) {
      setSelectedTabIndex(numberOfTabs - 1);
    }
  }, [numberOfTabs, setSelectedTabIndex, options.selectLastTabOnChange]);

  return { tabRefs, setSelectedTabIndex };
}
