import DOMPurify from 'dompurify';

// Own instance so that the hook below doesn't affect other DOMPurify users
const purify = DOMPurify(window);

// Open links in a new tab without giving the opened page access to this one
purify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A' && node.hasAttribute('href')) {
    node.setAttribute('target', '_blank');
    node.setAttribute('rel', 'noopener noreferrer');
  }
});

/**
 * Render an HTML string after removing scripts, event handlers
 * and other unsafe markup from it. Links open in a new tab.
 */
export default function SanitizedHtml({ html }: Readonly<{ html: string }>) {
  // eslint-disable-next-line react/no-danger -- html is sanitized with DOMPurify
  return <div dangerouslySetInnerHTML={{ __html: purify.sanitize(html) }} />;
}
