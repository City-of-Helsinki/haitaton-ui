import { Box } from '@chakra-ui/react';
import { Link, LoadingSpinner, Notification } from 'hds-react';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { QueryFunction, QueryKey, useQueryClient } from 'react-query';

type Props = {
  linkText: string;
  fileName: string | null | undefined;
  queryKey: QueryKey;
  queryFunction: QueryFunction<string>;
  linkIcon?: React.ReactNode;
};

function FileDownloadLink({ linkText, fileName, queryKey, queryFunction, linkIcon }: Props) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [fileUrl, setFileUrl] = useState('');
  const linkRef = useRef<HTMLAnchorElement>(null);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function fetchFile(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    setErrorText(null);
    const cachedUrl = queryClient.getQueryData<string>(queryKey);
    if (cachedUrl) {
      setFileUrl(cachedUrl);
    } else {
      event.preventDefault();
      setLoading(true);
      try {
        const url = await queryClient.fetchQuery(queryKey, queryFunction, {
          staleTime: Infinity,
          cacheTime: Infinity,
        });
        setFileUrl(url);
        setLoading(false);
        linkRef.current?.click();
      } catch (error) {
        setLoading(false);
        setErrorText(t('common:error'));
      }
    }
  }

  function closeErrorNotification() {
    setErrorText(null);
  }

  if (loading) {
    return (
      <Box display="flex" alignItems="center">
        <LoadingSpinner small />
      </Box>
    );
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
