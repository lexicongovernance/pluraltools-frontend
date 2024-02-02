// Components
import { FlexColumn } from '../components/containers/FlexColum.styled';
import { Title } from '../components/typography/Title.styled';
import Button from '../components/button';
import Input from '../components/input';
import Select from '../components/select';
import { FlexRow } from '../components/containers/FlexRow.styled';
import Label from '../components/typography/Label';

const options = [
  { id: '0', name: 'Option 1' },
  { id: '1', name: 'Option 2' },
  { id: '2', name: 'Option 3' },
];

function Account() {
  return (
    <FlexColumn>
      <Title>Complete your registration</Title>
      <Input label="Username" placeholder="Enter your Username" required />
      <Input label="Name" placeholder="Enter your Name" />
      <Input label="Email" placeholder="Enter your Email" />
      <Input label="Role" placeholder="Enter your role" />
      <Select options={options} label="Afilitaion" placeholder="Select an afiliation" required />
      <FlexColumn>
        <FlexColumn $gap="0.5rem">
          <Label $required>Credentials</Label>
          <FlexRow>
            <Select options={options} placeholder="Select your credential" />
            <Input placeholder="Institution" errors={['Possible error']} />
            <Input placeholder="Fields" errors={['Possible error']} />
          </FlexRow>
        </FlexColumn>
        <Button>Add credential</Button>
      </FlexColumn>
      <Input
        label="Publications"
        placeholder="Insert up to 5 urls separated by commas"
        errors={['Possible error 1', 'Possible error 2']}
      />
      <Input
        label="Contributions to MEV(URLs)"
        placeholder="Insert up to 5 urls separated by commas"
      />
      <Button>Submit</Button>
    </FlexColumn>
  );
}

export default Account;
