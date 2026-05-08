import { ThemeProvider } from './context/ThemeContext';
import Dashboard from './pages/Dashboard';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        <Dashboard />
        <Toaster position="top-right" />
      </div>
    </ThemeProvider>
  );
}

export default App;
