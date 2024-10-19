import { useData } from "@/App";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { FaArrowsDownToLine, FaTableList } from "react-icons/fa6";
import { GiExpense } from "react-icons/gi";
import { BiSolidCategory } from "react-icons/bi";
import { IoLogOut } from "react-icons/io5";

const AppStarter = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const { setEmail } = useData();
	const email = sessionStorage.getItem("email") || "";
	const pwd = sessionStorage.getItem("pwd") || "";

	useEffect(() => {
		const starter = async () => {
			try {
				const q = query(collection(db, "users"), where("email", "==", email));
				const querySnapshot = await getDocs(q);

				if (!querySnapshot.empty) {
					const doc = querySnapshot.docs[0];
					const user = doc.data();
					if (user?.password !== pwd) {
						navigate("/", { replace: true });
					} else {
						setEmail(user?.email);
					}
				} else {
					navigate("/", { replace: true });
				}
			} catch (error) {
				toast({ variant: "destructive", description: "Something went wrong!" });
				navigate("/", { replace: true });
				console.error("Error fetching document:", error);
			} finally {
				setLoading(false);
			}
		};
		starter();
	}, [email]);

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
								onClick={() => {
									sessionStorage.clear();
									window.location.reload();
								}}
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
