import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CadastroPaciente from './pages/PacienteCadastro'
import AvaliacaoMando from './pages/AvaliacaoMando';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CadastroPaciente />} />
        <Route path="/avaliacao" element={<AvaliacaoMando />} />
      </Routes>
    </Router>
  );
}

export default App;
