import { useQueryClient } from '@tanstack/react-query';
import { useSIWE, useModal } from 'connectkit';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';

export const SIWEButton = () => {
  const { setOpen } = useModal();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isConnected } = useAccount();

  const { data, isRejected, isLoading, isSignedIn, signOut, signIn } = useSIWE({
    onSignIn: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      navigate('/');
    },
    onSignOut: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      navigate('/');
    },
  });

  const handleSignIn = async () => {
    await signIn();
  };

  const handleSignOut = async () => {
    await signOut();
  };

  /** Wallet is connected and signed in */
  if (isSignedIn) {
    return (
      <>
        <div>Address: {data?.address}</div>
        <div>ChainId: {data?.chainId}</div>
        <button onClick={handleSignOut}>Sign Out</button>
      </>
    );
  }

  /** Wallet is connected, but not signed in */
  if (isConnected) {
    return (
      <>
        <button onClick={handleSignIn} disabled={isLoading}>
          {isRejected // User Rejected
            ? 'Try Again'
            : isLoading // Waiting for signing request
              ? 'Awaiting request...'
              : // Waiting for interaction
                'Sign In'}
        </button>
      </>
    );
  }

  /** A wallet needs to be connected first */
  return (
    <>
      <button onClick={() => setOpen(true)}>Connect Wallet</button>
    </>
  );
};
