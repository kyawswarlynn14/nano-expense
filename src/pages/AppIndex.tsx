import { useData } from "@/App";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AppIndex = () => {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
  	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const {setEmail} = useData();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (formData.password.length < 6) {
			toast({ variant: "destructive", description: "Invalid Password!" });
			return;
		}
    	setLoading(true);
		try {
		const q = query(
			collection(db, "users"),
			where("email", "==", formData.email)
		);
		const querySnapshot = await getDocs(q);

		if (!querySnapshot.empty) {
			const doc = querySnapshot.docs[0];
			const user = doc.data();
			if(user?.password === formData.password) {
				sessionStorage.setItem("pwd", user?.password);
				sessionStorage.setItem("email", user?.email);
				setEmail(user?.email);
				navigate("/outcome", { replace: true });
			} else {
				toast({variant: "destructive", description: "Invalid password!"});
			}
		} else {
				toast({variant: "destructive", description: "Invalid email!"});
		}
		} catch (error) {
			toast({variant: "destructive", description: "Something went wrong!"});
			console.error("Error fetching document:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="w-full min-h-screen flex items-center justify-center">
			<Card className="w-[90%] max-w-sm mx-auto">
				<CardHeader>
					<CardTitle className="text-center font-bold text-xl">Login</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit}>
						<div className="mb-4">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								name="email"
								value={formData.email}
								onChange={handleChange}
								placeholder="Enter your email"
								className="mt-2"
								required
							/>
						</div>
						<div className="mb-4">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								type="password"
								name="password"
								value={formData.password}
								onChange={handleChange}
								placeholder="Enter your password"
								className="mt-2"
								required
							/>
						</div>
						<Button type="submit" className="w-full">
							{loading ? 'Login...' : 'Login'}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
};

export default AppIndex;
