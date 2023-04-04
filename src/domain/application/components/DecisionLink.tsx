import React from 'react';
import { IconDocument, Link } from 'hds-react';

type Props = {
  linkText: string;
  url: string | undefined;
  filename: string | undefined | null;
};

function DecisionLink({ linkText, url, filename }: Props) {
  if (!url) {
    return null;
  }

  return (
    <Link href={url} download={filename}>
      <IconDocument aria-hidden size="xs" style={{ marginRight: 'var(--spacing-3-xs)' }} />
      {linkText}
    </Link>
  );
}

export default DecisionLink;
