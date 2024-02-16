import BackButton from '../components/backButton';
import { FlexColumn } from '../components/containers/FlexColum.styled';
import { Title } from '../components/typography/Title.styled';

function Cycle() {
  return (
    <FlexColumn>
      <BackButton />
      <Title>Cycle here</Title>
    </FlexColumn>
  );
}

export default Cycle;
