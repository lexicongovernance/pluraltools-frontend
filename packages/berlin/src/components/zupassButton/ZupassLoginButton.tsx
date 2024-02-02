import {
  usePCDMultiplexer,
  usePendingPCD,
  useSemaphoreSignatureProof,
  useZupassPopupMessages,
} from '@pcd/passport-interface';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchNonce, postPcdStr } from 'api';
import handleSignatureRequest from '../../../src/utils/handleSignatureRequest';
import Button from '../button';

type ZupassLoginButtonProps = {
  children: React.ReactNode;
};

function ZupassLoginButton({ children, ...props }: ZupassLoginButtonProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { refetch } = useQuery({
    queryKey: ['nonce'],
    queryFn: fetchNonce,
    enabled: false,
  });

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
    if (signatureProofValid && pcdStr) {
      mutateVerify(pcdStr);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signatureProofValid, pcdStr]);

  const handleLoginClick = async () => {
    const nonce = await refetch();
    if (nonce.data) {
      handleSignatureRequest(nonce.data);
    }
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
