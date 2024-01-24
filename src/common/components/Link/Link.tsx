import { useHref, useLinkClickHandler } from 'react-router-dom';
import { Link as HDSLink, LinkProps } from 'hds-react/components/Link';

/*
 * Wrapper for HDS Link component that works with React Router
 */
function Link({ onClick, href: to, external, children, ...rest }: Readonly<LinkProps>) {
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
    >
      {children}
    </HDSLink>
  );
}

export default Link;
