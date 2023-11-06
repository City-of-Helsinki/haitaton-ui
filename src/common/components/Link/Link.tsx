import React from 'react';
import { useHref, useLinkClickHandler } from 'react-router-dom';
import { Link as HDSLink, LinkProps } from 'hds-react';

/*
 * Wrapper for HDS Link component that works with React Router
 */
function Link({ onClick, href: to, external, ...rest }: LinkProps) {
  const href = useHref(to || '');
  const handleClick = useLinkClickHandler(to || '');

  return (
    <HDSLink
      {...rest}
      href={!external ? href : to}
      onClick={(event) => {
        if (external) {
          return;
        }
        onClick?.(event);
        event.stopPropagation();
        if (!event.defaultPrevented) {
          handleClick(event);
        }
      }}
    />
  );
}

export default Link;
