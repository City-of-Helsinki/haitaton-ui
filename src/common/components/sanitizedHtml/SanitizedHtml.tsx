import DOMPurify from 'dompurify';

/**
 * Render an HTML string after removing scripts, event handlers
 * and other unsafe markup from it
 */
export default function SanitizedHtml({ html }: Readonly<{ html: string }>) {
  // eslint-disable-next-line react/no-danger -- html is sanitized with DOMPurify
  return <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} />;
}
