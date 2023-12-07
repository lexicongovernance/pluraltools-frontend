// Zupass Proof of concept.
import { useEffect, useState } from 'react'

import {
  constructZupassPcdGetRequestUrl,
  openZupassPopup,
  usePCDMultiplexer,
  usePendingPCD,
  useSemaphoreSignatureProof,
  useZupassPopupMessages,
} from '@pcd/passport-interface'
import { ArgumentTypeName } from '@pcd/pcd-types'
import {
  SemaphoreSignaturePCDPackage,
  SemaphoreSignaturePCDArgs,
} from '@pcd/semaphore-signature-pcd'
import { SemaphoreIdentityPCDPackage } from '@pcd/semaphore-identity-pcd'

// const ZUPASS_URL = 'https://zupass.org/'
const ZUPASS_URL = 'https://staging.zupass.org/'
// const ZUPASS_SERVER_URL = 'https://api.zupass.org/'
const ZUPASS_SERVER_URL = 'https://api-staging.zupass.org/'

const POPUP_URL = window.location.origin + '/popup'

function Landing() {
  const [nonce, setNonce] = useState('')

  useEffect(() => {
    async function getNonce() {
      try {
        const response = await fetch(
          'http://localhost:8080/api/auth/zupass/nonce'
        )
        const data = await response.json()
        setNonce(data.nonce)
      } catch (error) {
        console.error('The error is: ', error)
      }
    }
    getNonce()
  }, [])

  const [zupassPCDStr, zupassPendingPCDStr] = useZupassPopupMessages()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, __, serverPCDStr] = usePendingPCD(
    zupassPendingPCDStr,
    ZUPASS_SERVER_URL
  )
  const pcdStr = usePCDMultiplexer(zupassPCDStr, serverPCDStr)

  const [signatureProofValid, setSignatureProofValid] = useState<
    boolean | undefined
  >()

  const onProofVerified = (valid: boolean) => {
    setSignatureProofValid(valid)
  }

  const { signatureProof } = useSemaphoreSignatureProof(pcdStr, onProofVerified)

  const handleSignatureRequest = () => {
    const args: SemaphoreSignaturePCDArgs = {
      identity: {
        argumentType: ArgumentTypeName.PCD,
        pcdType: SemaphoreIdentityPCDPackage.name,
        value: undefined,
        userProvided: true,
      },
      signedMessage: {
        argumentType: ArgumentTypeName.String,
        value: nonce && nonce,
        userProvided: false,
      },
    }
    const constructProofUrl = constructZupassPcdGetRequestUrl(
      ZUPASS_URL,
      POPUP_URL,
      SemaphoreSignaturePCDPackage.name,
      args,
      {
        genericProveScreen: true,
      }
    )

    openZupassPopup(POPUP_URL, constructProofUrl)
  }

  const handlePostRequest = async () => {
    try {
      const response = await fetch(
        'http://localhost:8080/api/auth/zupass/verify',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ pcd: pcdStr }),
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const responseData = await response.json()
      console.log('POST successful. Response:', responseData)
    } catch (error) {
      console.error('Error during POST request:', error)
    }
  }

  if (signatureProofValid && pcdStr) {
    handlePostRequest()
  }

  return (
    <>
      <h1>Zupass test</h1>
      <pre>Nonce: {nonce}</pre>
      <button onClick={handleSignatureRequest}>
        Request Semaphore signature
      </button>

      {signatureProof != null && (
        <>
          <p>Got Semaphore Signature Proof from Zupass</p>
          <p>{`Message signed: ${signatureProof.claim.signedMessage}`}</p>
          {signatureProofValid === undefined && <p>❓ Proof verifying</p>}
          {signatureProofValid === false && <p>❌ Proof is invalid</p>}
          {signatureProofValid === true && <p>✅ Proof is valid</p>}
          <pre>{JSON.stringify(signatureProof, null, 2)}</pre>
        </>
      )}
    </>
  )
}

export default Landing
