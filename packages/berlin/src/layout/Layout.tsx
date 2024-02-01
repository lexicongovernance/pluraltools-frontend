// React and third-party libraries
import { Toaster } from 'react-hot-toast';

// Components
import Header from '../components/header';
import Footer from '../components/footer';

// Styled components
import { Main } from './Layout.styled';

type LayoutProps = {
  children: React.ReactNode;
};

function Layout({ children }: LayoutProps) {
  return (
    <>
      <Toaster position="top-center" />
      <Header />
      <Main>{children}</Main>
      <Footer />
    </>
  );
}

export default Layout;
