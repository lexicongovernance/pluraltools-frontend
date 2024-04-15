import toast from 'react-hot-toast';
import { useAppStore } from '../../store';

import { Body } from '../typography/Body.styled';
import { FlexRow } from '../containers/FlexRow.styled';
import { SecretCodeContainer } from './SecretCode.styled';
import { Subtitle } from '../typography/Subtitle.styled';
import IconButton from '../icon-button';

type SecretCodeProps = {
  groupName: string;
  secretCode: string;
};

function SecretCode({ groupName, secretCode }: SecretCodeProps) {
  const theme = useAppStore((state) => state.theme);

  const handleCopyButtonClick = () => {
    navigator.clipboard.writeText(secretCode);
    toast.success(`Secret code ${secretCode} copied to clipboard`);
  };
  return (
    <SecretCodeContainer>
      <Body>
        Secret code for <i>{groupName}</i> research group:
      </Body>
      <FlexRow $align="center" $justify="space-between">
        <Subtitle>{secretCode}</Subtitle>
        <IconButton
          onClick={handleCopyButtonClick}
          icon={{ src: `/icons/copy-${theme}.svg`, alt: 'Copy icon' }}
          $color="secondary"
          $padding={4}
        />
      </FlexRow>
    </SecretCodeContainer>
  );
}

export default SecretCode;
