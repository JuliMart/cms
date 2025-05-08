import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import PlayerScreen from './pages/PlayerScreen';
import ReactDOM from 'react-dom/client'; // <== esta línea falta


ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/player/:screenKey" element={<PlayerScreen />} />
    </Routes>
  </BrowserRouter>
);
