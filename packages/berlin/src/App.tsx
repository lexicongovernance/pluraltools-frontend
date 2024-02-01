// React and third-party libraries
import { Route, Routes } from 'react-router-dom';

// Pages
import Landing from './pages/Landing';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
    </Routes>
  );
}

export default App;
