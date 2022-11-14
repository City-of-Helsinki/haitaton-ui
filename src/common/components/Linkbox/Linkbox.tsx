import React from 'react';
import { useHref, useLinkClickHandler } from 'react-router-dom';
import { Linkbox as HDSLinkbox, LinkboxProps } from 'hds-react';

/*
 * Wrapper for HDS Linkbox component that works with React Router
 */
const Linkbox: React.FC<React.PropsWithChildren<LinkboxProps>> = ({ onClick, href: to, external, ...rest }) => {
  const href = useHref(to || '');
  const handleClick = useLinkClickHandler(to || '');

  return (
    <HDSLinkbox
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
};

export default Linkbox;
