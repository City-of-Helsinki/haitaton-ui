import React, { useEffect, useMemo, useState } from 'react';

/**
 * Workaround for programmatically selecting tab in HDS tab component.
 * Create refs based on the amount of tabs
 * and return the array of ref along with SetStateAction
 * to set active index to select a tab.
 */
export default function useSelectableTabs(numberOfTabs: number) {
  const [selectendTabIndex, setSelectendTabIndex] = useState(0);

  const tabRefs = useMemo(() => {
    return new Array(numberOfTabs).fill(0).map(() => React.createRef<HTMLDivElement>());
  }, [numberOfTabs]);

  useEffect(() => {
    if (tabRefs.length > 0) {
      tabRefs[selectendTabIndex]?.current?.click();
    }
  }, [tabRefs, selectendTabIndex]);

  return { tabRefs, setSelectendTabIndex };
}
