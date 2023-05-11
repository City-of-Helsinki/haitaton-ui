import { Link, Notification } from 'hds-react';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { QueryFunction, QueryKey, useQueryClient } from 'react-query';

type Props = {
  linkText: string;
  fileName: string | null | undefined;
  queryKey: QueryKey;
  queryFunction: QueryFunction<string>;
  // eslint-disable-next-line react/require-default-props
  linkIcon?: React.ReactNode;
};

function FileDownloadLink({ linkText, fileName, queryKey, queryFunction, linkIcon }: Props) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [fileUrl, setFileUrl] = useState('');
  const linkRef = useRef<HTMLAnchorElement>(null);
  const [errorText, setErrorText] = useState<string | null>(null);

  async function fetchFile(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    setErrorText(null);
    const cachedUrl = queryClient.getQueryData<string>(queryKey);
    if (cachedUrl) {
      setFileUrl(cachedUrl);
    } else {
      event.preventDefault();
      try {
        const url = await queryClient.fetchQuery(queryKey, queryFunction, {
          staleTime: Infinity,
          cacheTime: Infinity,
        });
        setFileUrl(url);
        linkRef.current?.click();
      } catch (error) {
        setErrorText(t('common:error'));
      }
    }
  }

  function closeErrorNotification() {
    setErrorText(null);
  }

  return (
    <>
      <Link href={fileUrl} download={fileName} onClick={fetchFile} ref={linkRef}>
        {linkIcon}
        {linkText}
      </Link>

      {errorText && (
        <Notification
          position="top-right"
          dismissible
          type="error"
          closeButtonLabelText={t('common:components:notification:closeButtonLabelText')}
          onClose={closeErrorNotification}
        >
          {errorText}
        </Notification>
      )}
    </>
  );
}

export default FileDownloadLink;
