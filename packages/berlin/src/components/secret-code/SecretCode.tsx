import { Body } from '../typography/Body.styled';
import { Copy } from 'lucide-react';
import { FlexRow } from '../containers/FlexRow.styled';
import { SecretCodeContainer } from './SecretCode.styled';
import { Subtitle } from '../typography/Subtitle.styled';
import Icon from '../icon';
import toast from 'react-hot-toast';

type SecretCodeProps = {
  groupName: string;
  secretCode: string;
};

function SecretCode({ groupName, secretCode }: SecretCodeProps) {
  const handleCopyButtonClick = () => {
    navigator.clipboard.writeText(secretCode);
    toast.success(`Secret code ${secretCode} copied to clipboard`);
  };
  return (
    <SecretCodeContainer>
      <Body>Access code for {groupName} research group</Body>
      <FlexRow $align="center" $justify="space-between">
        <Subtitle>{secretCode}</Subtitle>
        <Icon>
          <Copy onClick={handleCopyButtonClick} />
        </Icon>
      </FlexRow>
    </SecretCodeContainer>
  );
}

export default SecretCode;
