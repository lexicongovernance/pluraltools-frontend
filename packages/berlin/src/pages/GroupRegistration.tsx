import Button from '../components/button';
import { FlexColumn } from '../components/containers/FlexColum.styled';
import { FlexRowToColumn } from '../components/containers/FlexRowToColumn.styled';
import Input from '../components/input';
import { Body } from '../components/typography/Body.styled';
import { Subtitle } from '../components/typography/Subtitle.styled';

function GroupRegistration() {
  return (
    <FlexRowToColumn $gap="2rem">
      <FlexColumn>
        <Subtitle>Create a Research Group</Subtitle>
        <Body>
          If you are the Lead Researcher or a Solo Researcher, please create a research group.
        </Body>
        <Body>You will get a code that you can share with your collaborators.</Body>
        <Button>Create group</Button>
      </FlexColumn>
      <div style={{ borderLeft: '1px solid #fff', height: '330px' }} />
      <FlexColumn>
        <Subtitle>Join a Research Group</Subtitle>
        <Body>As a collaborator, you can join a research group.</Body>
        <Body>Please ask to your Lead Researcher for the group code.</Body>
        <Input label="Research Group Code" placeholder="Enter the secret code here..." />
        <Button>Join group</Button>
      </FlexColumn>
    </FlexRowToColumn>
  );
}

export default GroupRegistration;
