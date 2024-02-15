// React and third-party libraries
import { Toaster } from 'react-hot-toast';

// Components
import Header from '../components/header';
import Footer from '../components/footer';

// Styled components
import { Main } from './Layout.styled';
import { Outlet } from 'react-router-dom';

function Layout() {
  return (
    <>
      <Toaster position="top-center" />
      <Header />
      <Main>
        <Outlet />
      </Main>
      <Footer />
    </>
  );
}

export default Layout;
