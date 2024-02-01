import { FlexColumn } from '../containers/FlexColum.styled';
import { FlexRow } from '../containers/FlexRow.styled';
import { FooterContainer, SyledFooter } from './Footer.styled';

function Header() {
  return (
    <SyledFooter>
      <FooterContainer>
        <FlexColumn>
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
