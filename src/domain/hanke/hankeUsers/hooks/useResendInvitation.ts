import { useRef } from 'react';
import { useMutation } from 'react-query';
import { resendInvitation } from '../hankeUsersApi';
import { HankeUser } from '../hankeUser';

export default function useResendInvitation() {
  const resendInvitationMutation = useMutation(resendInvitation);

  // List of user ids for tracking which users have been sent the invitation link
  const linksSentTo = useRef<string[]>([]);

  function sendInvitation(user: HankeUser) {
    resendInvitationMutation.mutate(user.id, {
      onSuccess(data) {
        linksSentTo.current.push(data);
      },
    });
  }

  return {
    resendInvitationMutation,
    linksSentTo,
    sendInvitation,
  };
}