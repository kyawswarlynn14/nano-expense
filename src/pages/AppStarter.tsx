import { useData } from "@/App";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { auth } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { FaArrowsDownToLine, FaTableList } from "react-icons/fa6";
import { GiExpense } from "react-icons/gi";
import { BiSolidCategory } from "react-icons/bi";
import { IoLogOut } from "react-icons/io5";
import { onAuthStateChanged, signOut } from "firebase/auth";

const AppStarter = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const { user, setUser } = useData();
	const [loading, setLoading] = useState(true);

	useEffect(()=>{
        onAuthStateChanged(auth, (user: any) => {
            if (user) {
				setUser({
					uid: user?.uid,
					name: user?.displayName,
					email: user?.email,
					accessToken: user?.accessToken || ''
				})
            } else {
				navigate('/', { replace: true })
              	console.log("user is logged out")
            }
			setLoading(false);
          });
    }, []);

	useEffect(() => {
		if(!loading && !user?.accessToken) {
			navigate('/', { replace: true })
		}
	}, [user, loading, navigate])

	const handleSignout = () => {
		signOut(auth).then(() => {
			toast({ variant: "default", description: "Sign out successfully!" });
			setUser(undefined);
			navigate("/", { replace: true });
		}).catch((error) => {
			toast({ variant: "destructive", description: error?.message ||"Something went wrong!" });
		});
	}

	return (
		<div className="w-full min-h-screen ">
			{loading ? (
				<p className="font-bold h-screen flex items-center justify-center">
					Checking...
				</p>
			) : (
				<>
					{location.pathname !== "/" && (
						<nav className="w-[80%] md:w-[70%] bg-slate-200 mx-auto shadow-lg px-4 py-2 flex justify-around rounded-b-lg">
							<NavButton
								title="Outcome"
								link="/outcome"
								icon={<GiExpense />}
							/>
							<NavButton
								title="Income"
								link="/income"
								icon={<FaArrowsDownToLine />}
							/>
							<NavButton
								title="Report"
								link="/report"
								icon={<FaTableList />}
							/>
							<NavButton
								title="Category"
								link="/categories"
								icon={<BiSolidCategory />}
							/>
							<Button
								variant={"outline"}
								onClick={handleSignout}
								className="flex items-center gap-2"
							>
								<span className="hidden md:block">Logout</span>
								<IoLogOut />
							</Button>
						</nav>
					)}
					<div>
						<Outlet />
					</div>
				</>
			)}
		</div>
	);
};

function NavButton({
	title,
	link,
	icon,
}: {
	title: string;
	link: string;
	icon: JSX.Element;
}) {
	const location = useLocation();
	const navigate = useNavigate();

	return (
		<Button
			variant={location.pathname == link ? "default" : "outline"}
			onClick={() => navigate(link)}
            className="flex items-center gap-2"
		>
			<span className="hidden md:block">{title}</span> {icon}
		</Button>
	);
}

export default AppStarter;
