// React and third-party libraries
import { Toaster } from 'react-hot-toast';
import { Outlet } from 'react-router-dom';

// Styled components
import { Content, Main } from './Layout.styled';

// Components
import Header from '../components/header';
import Footer from '../components/footer';

function Layout() {
  return (
    <>
      <Toaster position="top-center" toastOptions={{ style: { fontFamily: 'Raleway' } }} />
      <Content>
        <Header />
        <Main>
          <Outlet />
        </Main>
        <Footer />
      </Content>
    </>
  );
}

export default Layout;
