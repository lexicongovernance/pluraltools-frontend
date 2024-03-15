import { useAppStore } from '../../store';
import { FlexRow } from '../containers/FlexRow.styled';
import { Link as RouterLink } from 'react-router-dom';
import { FooterContainer, SyledFooter } from './Footer.styled';

function Header() {
  const theme = useAppStore((state) => state.theme);
  return (
    <SyledFooter>
      <FooterContainer $gap="0.75rem" $align="center">
        <FlexRow $justify="center">
          <RouterLink to={'https://github.com/lexicongovernance'}>
            <img src={`/logos/lexicon-${theme}.png`} height={24} width={24} />
          </RouterLink>
          <RouterLink to={'https://arbitrum.foundation/grants'}>
            <img src={`/logos/arbitrum-${theme}.svg`} height={24} width={24} />
          </RouterLink>
          <img src="/logos/plurality.svg" height={24} width={24} />
        </FlexRow>
      </FooterContainer>
    </SyledFooter>
  );
}

export default Header;
