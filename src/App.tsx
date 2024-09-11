import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppIndex, AppStarter, Categories, Incomes, Outcomes, PageNotFound, Report } from './pages'
import { createContext, useContext, useState } from 'react';
import { Toaster } from './components/ui/toaster';
import useGetRequest from './hooks/useGetRequest';
import { TCategory, TIncome, TOutcome } from './types';

interface AppContextType {
  isLogin: boolean;
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
  categoryLoading: boolean;
  categories: TCategory[];
  incomeLoading: boolean;
  incomes: TIncome[];
  outcomeLoading: boolean;
  outcomes: TOutcome[];
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
  const { loading: categoryLoading, data: categories} = useGetRequest("categories");
  const { loading: incomeLoading, data: incomes} = useGetRequest("incomes");
  const { loading: outcomeLoading, data: outcomes} = useGetRequest("outcomes");

  return (
    <AppContext.Provider value={{ 
        isLogin, 
        setIsLogin, 
        categoryLoading, 
        categories,
        incomeLoading,
        incomes,
        outcomeLoading,
        outcomes,
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<AppStarter />}>
            <Route path='' element={<AppIndex />} />
            <Route path='income' element={<Incomes />} />
            <Route path='outcome' element={<Outcomes />} />
            <Route path='report' element={<Report />} />
            <Route path='categories' element={<Categories />} />
            <Route path='*' element={<PageNotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster />
    </AppContext.Provider>
  )
}

export default App
