import { FlexColumn, FlexRow } from '../../layout/Layout.styled';
import { FooterContainer, SyledFooter } from './Footer.styled';

function Header() {
  return (
    <SyledFooter>
      <FooterContainer>
        <FlexColumn $gap="0.5rem" $alignItems="center">
          <FlexRow>
            <img src="logos/arbitrum.svg" height={24} width={24} />
            <img src="logos/plurality.svg" height={24} width={24} />
          </FlexRow>
          <p>Powered by Lexicon</p>
        </FlexColumn>
      </FooterContainer>
    </SyledFooter>
  );
}

export default Header;
