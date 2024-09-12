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
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { TOutcome } from "@/types";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { DatePicker } from "./DatePicker";
import { useNavigate } from "react-router-dom";
import { BiSolidMessageSquareEdit } from "react-icons/bi";
import { changeTimestampToDate } from "@/lib/services";

const initialValues = {
	userid: "",
	title: "",
	category: "",
	amount: 0,
	remark: "",
	createdAt: new Date(),
	updatedAt: new Date(),
};

export default function OutcomeForm({
	isUpdate = false,
	item,
}: {
	isUpdate?: boolean;
	item?: TOutcome;
}) {
	const email = sessionStorage.getItem('email');
	const navigate = useNavigate();
	const [formData, setFormData] = useState(initialValues);
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);
	const { categoryLoading, categories } = useData();

	useEffect(() => {
		if(email) {
			setFormData(prev => ({...prev, userid: email}))
		} else {
			navigate('/', {replace: true})
		}
	}, [email, navigate])

	useEffect(() => {
		if (isUpdate && item) {
			setFormData({
				userid: item.userid,
                title: item.title,
                category: item.category,
                amount: item.amount,
                remark: item.remark,
                createdAt: changeTimestampToDate(item.createdAt),
                updatedAt: new Date(),
            });
		}
	}, [isUpdate, item]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { id, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[id]: value,
		}));
	};

    const handleDateChange = (selectedDate: Date | undefined) => {
		if (selectedDate) {
			setFormData((prevData) => ({
				...prevData,
				createdAt: selectedDate,
			}));
		}
	};

	const handleCreate = async () => {
		setLoading(true);
		if (formData.title.trim() === "" || formData.amount < 0) {
			toast({ description: "Please enter valid data" });
			setLoading(false);
			return;
		}
		if (isUpdate && item?.id) {
			await updateDoc(doc(db, "outcomes", item.id), formData);
		} else {
			await addDoc(collection(db, "outcomes"), formData);
			setFormData(initialValues);
		}
		setLoading(false);
		setOpen(false);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				{isUpdate ? (
					<BiSolidMessageSquareEdit cursor={"pointer"} size={22} onClick={() => setOpen(true)} />
				) : (
					<Button size={"sm"} variant="default" onClick={() => setOpen(true)}>New</Button>
				)}
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>{isUpdate ? "Edit" : "New"} Outcome</DialogTitle>
				</DialogHeader>

				<div className="grid gap-4 py-4">
					<div className="input-container">
						<Label htmlFor="category" className="text-right">
							Category
						</Label>
						<Select 
                        disabled={categoryLoading} 
                        value={formData.category}
                        onValueChange={value => setFormData(prev => ({...prev, category: value}))}
                        >
							<SelectTrigger className="col-span-3">
								<SelectValue
									placeholder={
										categoryLoading ? "Loading..." : "Select a category"
									}
								/>
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectLabel>Categories</SelectLabel>
									{categories.length > 0 &&
										categories.map((i) => (
											<SelectItem key={i.id} value={i.id}>
												{i.title}
											</SelectItem>
										))}
								</SelectGroup>
							</SelectContent>
						</Select>
					</div>
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
						<Label htmlFor="amount" className="text-right">
							Amount
						</Label>
						<Input
							id="amount"
							type="number"
							value={formData.amount}
							onChange={handleChange}
							className="col-span-3"
						/>
					</div>
					<div className="input-container">
						<Label htmlFor="remark" className="text-right">
							Remark
						</Label>
						<Input
							id="remark"
							value={formData.remark}
							onChange={handleChange}
							className="col-span-3"
						/>
					</div>
                    <div className="input-container">
						<Label htmlFor="createdAt" className="text-right">
							Created At
						</Label>
                        <div className="col-span-3">
                            <DatePicker 
                                date={formData.createdAt} 
                                setDate={handleDateChange} 
                            />
                        </div>
					</div>
				</div>
				<DialogFooter>
					<Button type="submit" disabled={loading} onClick={handleCreate}>
						{loading ? "Saving..." : "Save"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
