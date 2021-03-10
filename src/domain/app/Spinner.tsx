import React from 'react';
import { useSelector } from 'react-redux';
import { getIsLoading } from './selectors';
import OverlaySpinner from '../../common/components/spinner/OverlaySpinner';

const Spinner = () => {
  const isLoading = useSelector(getIsLoading());
  return isLoading ? <OverlaySpinner /> : null;
};

export default Spinner;
