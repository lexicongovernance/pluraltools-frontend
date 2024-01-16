import { useAppStore } from '../store';
import register from '../data/register';
import { default as Onboarding } from '../components/onboarding';
import { useNavigate } from 'react-router-dom';

function OnboardingPage() {
  const navigate = useNavigate();
  const setOnboardingStatus = useAppStore((state) => state.setOnboardingStatus);
  const handleSkip = () => {
    setOnboardingStatus('COMPLETE');
    navigate('/account');
  };
  return <Onboarding data={register.onboarding} handleSkip={handleSkip} />;
}

export default OnboardingPage;
