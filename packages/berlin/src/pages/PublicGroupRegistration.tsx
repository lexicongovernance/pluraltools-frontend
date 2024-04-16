import Button from '../components/button';
import { FlexColumn } from '../components/containers/FlexColum.styled';
import { Form } from '../components/containers/Form.styled';
import { Body } from '../components/typography/Body.styled';
import { Subtitle } from '../components/typography/Subtitle.styled';
import publicGroups from '../data/publicGroups';

function PublicGroupRegistration() {
  return (
    <FlexColumn $gap="2rem">
      <Subtitle>{publicGroups.copy.subtitle}</Subtitle>
      <Body>{publicGroups.copy.body}</Body>
      <Form>
        <Button>Join public group</Button>
      </Form>
    </FlexColumn>
  );
}

export default PublicGroupRegistration;
