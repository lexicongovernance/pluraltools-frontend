import { StyledCountdown } from './Countdown.styled';

type CountdownProps = {
  formattedTime: string;
};

function Countdown({ formattedTime }: CountdownProps) {
  return <StyledCountdown>{formattedTime}</StyledCountdown>;
}

export default Countdown;
