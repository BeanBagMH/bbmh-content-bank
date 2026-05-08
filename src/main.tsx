import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'

console.log('BBMh: Initializing React Application...');

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('BBMh: Root element not found!');
} else {
  createRoot(rootElement).render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
