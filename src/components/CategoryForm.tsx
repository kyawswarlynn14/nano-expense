import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { TCategory } from "@/types";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const initialValues = {
	userid: "",
	title: "",
	description: "",
};

export function CategoryForm({ 
	isUpdate = false,
	item,
}: { 
	isUpdate?: boolean,
	item?: TCategory,
}) {
	const email = sessionStorage.getItem('email');
	const navigate = useNavigate();
	const [formData, setFormData] = useState(initialValues);
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);

	useEffect(() => {
		if(email) {
			setFormData(prev => ({...prev, userid: email}))
		} else {
			navigate('/', {replace: true})
		}
	}, [email, navigate])

	useEffect(() => {
		if(isUpdate && item) {
			setFormData({
				userid: item.userid,
				title: item.title,
				description: item.description,
			});
		}
	}, [isUpdate, item])

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { id, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[id]: value,
		}));
	};

	const createCategory = async () => {
		setLoading(true);
		if (formData.title.trim() === "") {
			toast({ description: "Please enter a valid category title" });
			setLoading(false);
			return;
		}
		if(isUpdate && item?.id) {
			await updateDoc(doc(db, 'categories', item.id), formData);
		} else {
			await addDoc(collection(db, "categories"), formData);
			setFormData(initialValues);
		}
		setLoading(false);
		setOpen(false); 
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				{isUpdate ? (
					<FiEdit size={22} onClick={() => setOpen(true)} />
				) : (
					<Button size={"sm"} variant="default" onClick={() => setOpen(true)}>New</Button>
				)}
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>{isUpdate ? "Edit" : "New"} Category</DialogTitle>
				</DialogHeader>

				<div className="grid gap-4 py-4">
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="title" className="text-right">
							Title
						</Label>
						<Input
							id="title"
							value={formData.title}
							onChange={handleChange}
							className="col-span-3"
						/>
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="description" className="text-right">
							Description
						</Label>
						<Input
							id="description"
							value={formData.description}
							onChange={handleChange}
							className="col-span-3"
						/>
					</div>
				</div>
				<DialogFooter>
					<Button type="submit" disabled={loading} onClick={createCategory}>
						{loading ? "Saving..." : "Save"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
