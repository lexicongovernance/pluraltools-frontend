// React and third-party libraries
import { Toaster } from 'react-hot-toast';
import { Outlet } from 'react-router-dom';

// Styled components
import { Main } from './Layout.styled';

// Components
// import Header from '../components/header';
import Footer from '../components/footer';
import NewHeader from '@/components/header';

function Layout() {
  return (
    <>
      <Toaster position="top-center" toastOptions={{ style: { fontFamily: 'Raleway' } }} />
      <NewHeader />
      <Main>
        <Outlet />
      </Main>
      <Footer />
    </>
  );
}

export default Layout;
