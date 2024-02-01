import { useAppStore } from '../../store';
import { FlexColumn } from '../containers/FlexColum.styled';
import { FlexRow } from '../containers/FlexRow.styled';
import { Copy, FooterContainer, SyledFooter } from './Footer.styled';

function Header() {
  const theme = useAppStore((state) => state.theme);
  return (
    <SyledFooter>
      <FooterContainer>
        <FlexColumn $gap="0.75rem">
          <FlexRow>
            <img src={`logos/arbitrum-${theme}.svg`} height={24} width={24} />
            <img src="logos/plurality.svg" height={24} width={24} />
          </FlexRow>
          <Copy>Powered by Lexicon</Copy>
        </FlexColumn>
      </FooterContainer>
    </SyledFooter>
  );
}

export default Header;
