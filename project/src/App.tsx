import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProblemPage from './pages/ProblemPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/problem/:id" element={<ProblemPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
