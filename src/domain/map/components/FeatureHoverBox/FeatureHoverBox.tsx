import React from 'react';
import { Pixel } from 'ol/pixel';
import useFeaturesAtPixel, { FeatureWithPixel } from '../../hooks/useFeaturesAtPixel';
import styles from './FeatureHoverBox.module.scss';

function HoverElement({ coordinate, children }: { coordinate: Pixel; children: React.ReactNode }) {
  return (
    <div
      className={styles.hoverElement}
      style={{
        top: coordinate[1] - 10,
        left: coordinate[0] + 15,
      }}
    >
      {children}
    </div>
  );
}

function FeatureHoverBox({
  render,
}: {
  render: (featureWithPixel: FeatureWithPixel) => React.ReactNode;
}) {
  const featuresAtPixel = useFeaturesAtPixel();

  const firstFeature = featuresAtPixel[0];

  if (!firstFeature) {
    return null;
  }

  const children = render(firstFeature);

  if (!children) {
    return null;
  }

  return <HoverElement coordinate={firstFeature.featurePixel}>{children}</HoverElement>;
}

export default FeatureHoverBox;
