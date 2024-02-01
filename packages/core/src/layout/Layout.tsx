import { Toaster } from 'react-hot-toast';
import Footer from '../components/footer';
import Header from '../components/header';
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
