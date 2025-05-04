
import { createRoot } from 'react-dom/client';
import App from './App';
import { seedInitialData } from './utils/seedData';
import './index.css';

// Inicializa dados de exemplo
seedInitialData();

createRoot(document.getElementById("root")!).render(<App />);
