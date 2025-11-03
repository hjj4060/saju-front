import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SajuForm from './SajuForm';
import SajuResult from './SajuResult';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<SajuForm />} />
          <Route path="/result" element={<SajuResult />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
