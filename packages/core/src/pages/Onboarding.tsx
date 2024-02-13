import { useNavigate } from 'react-router-dom';
import { default as Onboarding } from '../components/onboarding';
import onboarding from '../data/onboarding';
import { useAppStore } from '../store';

function OnboardingPage() {
  const navigate = useNavigate();
  const setOnboardingStatus = useAppStore((state) => state.setOnboardingStatus);
  const handleSkip = () => {
    setOnboardingStatus('COMPLETE');
    navigate('/account');
  };
  return <Onboarding data={onboarding.data} handleSkip={handleSkip} />;
}

export default OnboardingPage;
