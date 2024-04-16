import { Combobox } from '../../../ui/src';
import Button from '../components/button';
import { FlexColumn } from '../components/containers/FlexColum.styled';
import { Form } from '../components/containers/Form.styled';
import { Body } from '../components/typography/Body.styled';
import { Subtitle } from '../components/typography/Subtitle.styled';
import publicGroups from '../data/publicGroups';

const data = [
  {
    value: 'polis',
    label: 'Polis',
  },
  {
    value: 'test',
    label: 'Test',
  },
];

function PublicGroupRegistration() {
  return (
    <FlexColumn $gap="1.5rem">
      <Subtitle>{publicGroups.copy.subtitle}</Subtitle>
      <Body>{publicGroups.copy.body}</Body>
      <Form>
        <Combobox data={data} name="public group" />
        <Button>Join public group</Button>
      </Form>
    </FlexColumn>
  );
}

export default PublicGroupRegistration;
