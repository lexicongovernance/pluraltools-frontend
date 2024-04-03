import { useAppStore } from '../../store';
import { FlexRow } from '../containers/FlexRow.styled';
import { Link as RouterLink } from 'react-router-dom';
import { Copy, FooterContainer, SyledFooter } from './Footer.styled';
import footerData from '../../data/footer';

function Footer() {
  const theme = useAppStore((state) => state.theme);

  return (
    <SyledFooter>
      <FooterContainer $gap="0.75rem" $align="center">
        {footerData.copy.map(({ id, text }) => (
          <Copy key={id}>{text}</Copy>
        ))}
        <FlexRow $justify="center">
          {footerData.logos.map((logo) => (
            <RouterLink key={logo.src} to={logo.link}>
              <img src={`/logos/${logo.src}-${theme}.svg`} alt={logo.alt} height={24} width={24} />
            </RouterLink>
          ))}
        </FlexRow>
      </FooterContainer>
    </SyledFooter>
  );
}

export default Footer;
