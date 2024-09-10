import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppIndex, AppStarter, Income, Outcome, PageNotFound, Report } from './pages'
import { createContext, useContext, useState } from 'react';
import { Toaster } from './components/ui/toaster';

interface AppContextType {
  isLogin: boolean;
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);
export const useData = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useData must be used within an AppContext.Provider');
  }
  return context;
};

function App() {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  return (
    <AppContext.Provider value={{ isLogin, setIsLogin }}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<AppStarter />}>
            <Route path='' element={<AppIndex />} />
            <Route path='income' element={<Income />} />
            <Route path='outcome' element={<Outcome />} />
            <Route path='report' element={<Report />} />
            <Route path='*' element={<PageNotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster />
    </AppContext.Provider>
  )
}

export default App
