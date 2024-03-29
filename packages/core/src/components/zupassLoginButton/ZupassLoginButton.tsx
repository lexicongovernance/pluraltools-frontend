import {
  openSignedZuzaluSignInPopup,
  usePCDMultiplexer,
  usePendingPCD,
  useSemaphoreSignatureProof,
  useZupassPopupMessages,
  SignInMessagePayload,
  requestUser,
} from '@pcd/passport-interface';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postPcdStr } from 'api';
import Button from '../button';

type ZupassLoginButtonProps = {
  children: React.ReactNode;
};

const POPUP_URL = window.location.origin + '/popup';

function ZupassLoginButton({ children, ...props }: ZupassLoginButtonProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: mutateVerify } = useMutation({
    mutationFn: postPcdStr,
    onSuccess: (body) => {
      if (body) {
        queryClient.invalidateQueries({ queryKey: ['user'] });
        navigate('/');
      }
    },
  });

  // State for Zupass proof verification
  const [signatureProofValid, setSignatureProofValid] = useState<boolean | undefined>();

  // Zupass-specific hooks for managing PCDs and proof verification
  const [zupassPCDStr, zupassPendingPCDStr] = useZupassPopupMessages();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, __, serverPCDStr] = usePendingPCD(
    zupassPendingPCDStr,
    import.meta.env.VITE_ZUPASS_SERVER_URL
  );
  const pcdStr = usePCDMultiplexer(zupassPCDStr, serverPCDStr);

  // Callback for proof verification
  const onProofVerified = (valid: boolean) => {
    setSignatureProofValid(valid);
  };
  // Hook for getting the signature proof
  // TODO: Do we need this?
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { signatureProof } = useSemaphoreSignatureProof(pcdStr, onProofVerified);

  useEffect(() => {
    if (signatureProofValid && signatureProof && pcdStr) {
      // get user from zupass server
      const signInPayload = JSON.parse(signatureProof?.claim.signedMessage) as SignInMessagePayload;

      requestUser(import.meta.env.VITE_ZUPASS_SERVER_URL, signInPayload.uuid).then((user) => {
        if (user.success) {
          mutateVerify({
            email: user.value.email,
            uuid: user.value.uuid,
            pcdStr: JSON.parse(pcdStr).pcd,
          });
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signatureProofValid, pcdStr, signatureProof]);

  const handleLoginClick = () => {
    openSignedZuzaluSignInPopup(import.meta.env.VITE_ZUPASS_URL, POPUP_URL, 'Lexicon');
  };

  return (
    <>
      <Button onClick={handleLoginClick} {...props}>
        {children}
      </Button>
    </>
  );
}

export default ZupassLoginButton;
