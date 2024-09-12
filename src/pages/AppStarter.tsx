import { useData } from '@/App';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

const AppStarter = () => {
    const [loading, setLoading] = useState(false);
    const { setEmail } = useData();
    const navigate = useNavigate();
    const email = sessionStorage.getItem('email') || '';
    const pwd = sessionStorage.getItem('pwd') || '';

    useEffect(() => {
        const starter = async () => {
            setLoading(true);
            try {
                const q = query(
                    collection(db, "users"),
                    where("email", "==", email)
                );
                const querySnapshot = await getDocs(q);

                
                if (!querySnapshot.empty) {
                    const doc = querySnapshot.docs[0];
                    const user = doc.data();
                    if(user?.password !== pwd) {
                        navigate("/", { replace: true });
                    } else {
                        setEmail(user?.email);
                    }
                } else {
                    navigate("/", { replace: true });
                }
            } catch (error) {
                toast({variant: "destructive", description: "Something went wrong!"});
                navigate("/", { replace: true });
                console.error("Error fetching document:", error);
            } finally {
                setLoading(false);
            }
        }
        starter();
    }, [email]);

  return (
    <div className='w-full min-h-screen '>
        {loading ? (
            <p className='text-center font-bold py-6'>Checking...</p>
        ) : (
            <>
                {location.pathname !== '/#/' && (
                    <nav className='w-[80%] md:w-[60%] bg-slate-200 mx-auto shadow-lg px-4 py-2 flex justify-around rounded-lg'>
                        <NavButton title='Outcome' link='/outcome' />
                        <NavButton title='Income' link='/income' />
                        <NavButton title='Report' link='/report' />
                        <NavButton title='Category' link='/categories' />
                        <Button 
                            variant={"outline"}
                            onClick={() => {
                                sessionStorage.clear();
                                window.location.reload();
                            }} 
                        >
                            Logout
                        </Button>
                    </nav>
                )}
            <div>
                <Outlet />
            </div>
            </>
        )}
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