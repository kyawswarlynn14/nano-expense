import { useData } from '@/App';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

const AppStarter = () => {
    const navigate = useNavigate();
    const { isLogin } = useData();

    useEffect(() => {
        if(!isLogin) {
            navigate('/', {replace: true});
        }
    }, [isLogin, navigate]);

  return (
    <div className='w-full min-h-screen bg-slate-100'>
        {location.pathname !== '/' && (
            <nav className='w-[80%] md:w-[60%] bg-slate-200 mx-auto shadow-lg px-4 py-2 flex justify-around rounded-lg'>
                <NavButton title='Income' link='/income' />
                <NavButton title='Outcome' link='/outcome' />
                <NavButton title='Report' link='/report' />
                <NavButton title='Categories' link='/categories' />
            </nav>
        )}
        <div>
            <Outlet />
        </div>
    </div>
  )
}

function NavButton({title, link}: {title: string, link: string}) {
    const location = useLocation();
    const navigate = useNavigate();

    return(
        <Button 
            variant={ location.pathname == link ? "default" : "outline"} 
            onClick={() => navigate(link)} 
        >
            {title}
        </Button>
    )
}

export default AppStarter