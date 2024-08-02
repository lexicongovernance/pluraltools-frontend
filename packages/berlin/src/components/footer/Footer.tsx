import { useAppStore } from '../../store';
import { Link as RouterLink } from 'react-router-dom';
import footerData from '../../data/footer';

function Footer() {
  const theme = useAppStore((state) => state.theme);

  return (
    <footer className="bg-primary border-secondary border-t py-4 text-sm">
      <section className="mx-auto flex w-[min(90%,1080px)] flex-col items-center gap-2">
        {footerData.copy.map(({ id, text }) => (
          <p key={id}>{text}</p>
        ))}
        <div className="flex">
          {footerData.logos.map((logo) => (
            <RouterLink key={logo.src} to={logo.link}>
              <img src={`/logos/${logo.src}-${theme}.svg`} alt={logo.alt} height={24} width={24} />
            </RouterLink>
          ))}
        </div>
      </section>
    </footer>
  );
}

export default Footer;
