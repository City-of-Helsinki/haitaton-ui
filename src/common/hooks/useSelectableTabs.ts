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
  numberOfTabs: number,
  options: Options = { selectLastTabOnChange: false },
) {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const tabRefs = useMemo(() => {
    return new Array(numberOfTabs).fill(0).map(() => React.createRef<HTMLDivElement>());
  }, [numberOfTabs]);

  useEffect(() => {
    if (tabRefs.length > 0) {
      tabRefs[selectedTabIndex]?.current?.click();
    }
  }, [tabRefs, selectedTabIndex]);

  // When number of tabs changes,
  // select the last one
  useEffect(() => {
    if (options.selectLastTabOnChange) {
      setSelectedTabIndex(numberOfTabs - 1);
    }
  }, [numberOfTabs, setSelectedTabIndex, options.selectLastTabOnChange]);

  return { tabRefs, setSelectedTabIndex };
}
