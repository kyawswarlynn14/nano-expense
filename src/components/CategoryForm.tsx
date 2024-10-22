import { useData } from "@/App";
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
import { BiSolidMessageSquareEdit } from "react-icons/bi";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";

export function CategoryForm({ 
	isUpdate = false,
	item,
}: { 
	isUpdate?: boolean,
	item?: TCategory,
}) {
	const { user } = useData();
	const initialValues = {
		userid: user?.email,
		title: "",
		type: "",
		description: "",
	};
	const [formData, setFormData] = useState(initialValues);
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);

	useEffect(() => {
		if(isUpdate && item) {
			setFormData({
				userid: item.userid,
				type: item?.type,
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
					<Button onClick={() => setOpen(true)} className="w-full flex justify-between items-center gap-2">
						<span>Edit</span>
						<BiSolidMessageSquareEdit cursor={"pointer"} size={22} />
					</Button>
				) : (
					<Button size={"sm"} variant="default" onClick={() => setOpen(true)}>New</Button>
				)}
			</DialogTrigger>
			<DialogContent className="w-[90%] rounded-lg sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>{isUpdate ? "Edit" : "New"} Category</DialogTitle>
				</DialogHeader>

				<div className="grid gap-4 py-4">
					<div className="input-container">
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
					<div className="input-container">
						<Label htmlFor="type" className="text-right">
							Type
						</Label>
						<Select 
                        value={formData.type}
                        onValueChange={value => setFormData(prev => ({...prev, type: value}))}
                        >
							<SelectTrigger className="col-span-3">
								<SelectValue
									placeholder={"Select a type"}
								/>
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectLabel>Types</SelectLabel>
										<SelectItem value={"001"}>
											Income
										</SelectItem>
										<SelectItem value={"002"}>
											Outcome
										</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>
					</div>
					<div className="input-container">
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
