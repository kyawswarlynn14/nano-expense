import { HashRouter, Route, Routes } from 'react-router-dom'
import { AppIndex, AppStarter, Categories, Incomes, Outcomes, PageNotFound, Report } from './pages'
import { createContext, useContext, useState } from 'react';
import { Toaster } from './components/ui/toaster';
import { AppContextType, TUser } from './types';
import useGetRequest from './hooks/useGetRequest';

const AppContext = createContext<AppContextType | undefined>(undefined);
export const useData = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useData must be used within an AppContext.Provider');
  }
  return context;
};

function App() {
  const [user, setUser] = useState<TUser | undefined>(undefined);
  const { loading: categoryLoading, data: categories} = useGetRequest("categories", user?.email || '');
  const { loading: incomeLoading, data: incomes} = useGetRequest("incomes", user?.email || '');
  const { loading: outcomeLoading, data: outcomes} = useGetRequest("outcomes", user?.email || '');

  const contextData: AppContextType = {
    user,
    setUser,
    categoryLoading,
    incomeLoading,
    outcomeLoading,
    categories,
    incomes,
    outcomes,
  }

  return (
    <AppContext.Provider value={contextData} >
      <HashRouter>
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
      </HashRouter>
      <Toaster />
    </AppContext.Provider>
  )
}

export default App
