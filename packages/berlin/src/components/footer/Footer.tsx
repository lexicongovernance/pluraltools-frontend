import { useAppStore } from '../../store';
import { FlexRow } from '../containers/FlexRow.styled';
import { Link as RouterLink } from 'react-router-dom';
import { Copy, FooterContainer, SyledFooter } from './Footer.styled';

function Header() {
  const theme = useAppStore((state) => state.theme);
  return (
    <SyledFooter>
      <FooterContainer $gap="0.75rem" $align="center">
        <Copy>A grants program funded by Plurality Labs and the Arbitrum DAO</Copy>
        <Copy>Co-sponsored by RadicalXChange, MetaGov & De-Sci Foundation</Copy>
        <Copy>Tooling built by Lexicon Governance</Copy>
        <FlexRow $justify="center">
          <RouterLink to={'https://arbitrum.foundation/grants'}>
            <img src={`/logos/arbitrum-${theme}.svg`} height={24} width={24} />
          </RouterLink>
          <RouterLink to={'https://www.radicalxchange.org/'}>
            <img src={`/logos/radicalxchange-${theme}.svg`} height={24} width={24} />
          </RouterLink>
          <RouterLink to={'https://metagov.org/'}>
            <img src={`/logos/metagov-${theme}.svg`} height={24} width={24} />
          </RouterLink>
          <RouterLink to={'https://www.descifoundation.org/'}>
            <img src={`/logos/desci-${theme}.svg`} height={24} width={24} />
          </RouterLink>
          <RouterLink to={'https://github.com/lexicongovernance'}>
            <img src={`/logos/lexicon-${theme}.png`} height={24} width={24} />
          </RouterLink>
        </FlexRow>
      </FooterContainer>
    </SyledFooter>
  );
}

export default Header;
