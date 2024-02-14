import { constructZupassPcdGetRequestUrl, openZupassPopup } from '@pcd/passport-interface';
import { ArgumentTypeName } from '@pcd/pcd-types';
import {
  SemaphoreSignaturePCDPackage,
  SemaphoreSignaturePCDArgs,
} from '@pcd/semaphore-signature-pcd';
import { SemaphoreIdentityPCDPackage } from '@pcd/semaphore-identity-pcd';

const POPUP_URL = window.location.origin + '/popup';

const handleSignatureRequest = (nonce: string | null) => {
  const args: SemaphoreSignaturePCDArgs = {
    identity: {
      argumentType: ArgumentTypeName.PCD,
      pcdType: SemaphoreIdentityPCDPackage.name,
      value: undefined,
      userProvided: true,
    },
    signedMessage: {
      argumentType: ArgumentTypeName.String,
      value: nonce ? nonce : undefined,
      userProvided: false,
    },
  };

  const constructProofUrl = constructZupassPcdGetRequestUrl(
    import.meta.env.VITE_ZUPASS_URL,
    POPUP_URL,
    SemaphoreSignaturePCDPackage.name,
    args,
    {
      genericProveScreen: true,
    },
  );

  openZupassPopup(POPUP_URL, constructProofUrl);
};

export default handleSignatureRequest;
