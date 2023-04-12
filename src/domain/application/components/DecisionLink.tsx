import React, { useRef, useState } from 'react';
import { IconDocument, Link, Notification } from 'hds-react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import api from '../../api/api';

async function getDecision(id: number | null): Promise<string> {
  const { data } = await api.get<Blob>(`hakemukset/${id}/paatos`, { responseType: 'blob' });
  return URL.createObjectURL(data);
}

type Props = {
  applicationId: number | null;
  linkText: string;
  filename: string | undefined | null;
};

function DecisionLink({ linkText, filename, applicationId }: Props) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [decisionUrl, setDecisionUrl] = useState('');
  const linkRef = useRef<HTMLAnchorElement>(null);
  const [errorText, setErrorText] = useState<string | null>(null);

  async function fetchDecision(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    setErrorText(null);
    const queryKey = ['decision', applicationId];
    const cachedUrl = queryClient.getQueryData<string>(queryKey);
    if (cachedUrl) {
      setDecisionUrl(cachedUrl);
    } else {
      event.preventDefault();
      try {
        const url = await queryClient.fetchQuery(queryKey, () => getDecision(applicationId), {
          staleTime: Infinity,
          cacheTime: Infinity,
        });
        setDecisionUrl(url);
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
      <Link href={decisionUrl} download={filename} onClick={fetchDecision} ref={linkRef}>
        <IconDocument aria-hidden size="xs" style={{ marginRight: 'var(--spacing-3-xs)' }} />
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

export default DecisionLink;
