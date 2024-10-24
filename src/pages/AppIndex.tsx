import { useData } from "@/App";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AppIndex = () => {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
  	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const { user, setUser } = useData();

	useEffect(() => {
		if(user && user.accessToken) {
			navigate('/outcome', {replace: true});
		}
	}, [user])

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
		signInWithEmailAndPassword(auth, formData.email, formData.password)
        .then((userCredential) => {
            const user: any = userCredential.user;
			setUser({
				uid: user?.uid,
				name: user?.displayName,
				email: user?.email,
				accessToken: user?.accessToken || ''
			})
			navigate('/outcome', {replace: true})
            console.log(user);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log("login error >>", errorCode, errorMessage)
			toast({variant: "destructive", description:  error.message || "Invalid credentials!"});
        });
	};

	if(user && user.accessToken) return null;

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
