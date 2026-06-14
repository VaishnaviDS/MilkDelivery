import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { AdminProvider } from '../context/AdminContext.jsx'
import { registerSW } from "virtual:pwa-register";
registerSW({ immediate: true });
export const server="https://milkdelivery-ygq5.onrender.com"
createRoot(document.getElementById('root')).render(
<AdminProvider>
    <App />
</AdminProvider>
)
