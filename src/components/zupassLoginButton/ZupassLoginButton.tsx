import {
  usePCDMultiplexer,
  usePendingPCD,
  useSemaphoreSignatureProof,
  useZupassPopupMessages,
} from '@pcd/passport-interface'
import { useEffect, useState } from 'react'
import postPcdStr from '../../utils/postPcdStr'
import handleSignatureRequest from '../../utils/handleSignatureRequest'
import Button from '../button'

type ZupassLoginButtonProps = {
  children: React.ReactNode
  nonce: string | undefined
}
function ZupassLoginButton({ children, nonce }: ZupassLoginButtonProps) {
  // State for Zupass proof verification
  const [signatureProofValid, setSignatureProofValid] = useState<
    boolean | undefined
  >()

  // Zupass-specific hooks for managing PCDs and proof verification
  const [zupassPCDStr, zupassPendingPCDStr] = useZupassPopupMessages()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, __, serverPCDStr] = usePendingPCD(
    zupassPendingPCDStr,
    import.meta.env.VITE_ZUPASS_SERVER_URL
  )
  const pcdStr = usePCDMultiplexer(zupassPCDStr, serverPCDStr)

  // Callback for proof verification
  const onProofVerified = (valid: boolean) => {
    setSignatureProofValid(valid)
  }
  // Hook for getting the signature proof
  // TODO: Do we need this?
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { signatureProof } = useSemaphoreSignatureProof(pcdStr, onProofVerified)

  useEffect(() => {
    const handlePostRequest = async () => {
      try {
        const response = await postPcdStr({ pcdStr })
        console.log('POST successful. Response:', response)
      } catch (error) {
        console.error('Error during POST request:', error)
      }
    }

    if (signatureProofValid && pcdStr) {
      handlePostRequest()
    }
  }, [signatureProofValid, pcdStr])
  return (
    <>
      <Button onClick={() => handleSignatureRequest(nonce)}>{children}</Button>
      {/* {signatureProof != null && (
        <>
          <p>Got Semaphore Signature Proof from Zupass</p>
          <p>{`Message signed: ${signatureProof.claim.signedMessage}`}</p>
          {signatureProofValid === undefined && <p>❓ Proof verifying</p>}
          {signatureProofValid === false && <p>❌ Proof is invalid</p>}
          {signatureProofValid === true && <p>✅ Proof is valid</p>}
          <pre>{JSON.stringify(signatureProof, null, 2)}</pre>
        </>
      )} */}
    </>
  )
}

export default ZupassLoginButton
