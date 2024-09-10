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
import { TIncome } from "@/types";
import { addDoc, collection, doc, Timestamp, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { DatePicker } from "./DatePicker";

const initialValues = {
	title: "",
	category: "",
	amount: 0,
	remark: "",
	createdAt: new Date(),
	updatedAt: new Date(),
};

export default function IncomeForm({
	isUpdate = false,
	item,
}: {
	isUpdate?: boolean;
	item?: TIncome;
}) {
	const [formData, setFormData] = useState(initialValues);
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);
	const { categoryLoading, categories } = useData();

	useEffect(() => {
		if (isUpdate && item) {
			setFormData({
                title: item.title,
                category: item.category,
                amount: item.amount,
                remark: item.remark,
                createdAt: item.createdAt instanceof Timestamp ? item.createdAt.toDate() : item.createdAt,
                updatedAt: item.updatedAt instanceof Timestamp ? item.updatedAt.toDate() : item.updatedAt,
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

	const createCategory = async () => {
		setLoading(true);
		if (formData.title.trim() === "" || formData.amount < 0) {
			toast({ description: "Please enter valid data" });
			setLoading(false);
			return;
		}
		if (isUpdate && item?.id) {
			await updateDoc(doc(db, "incomes", item.id), formData);
		} else {
			await addDoc(collection(db, "incomes"), formData);
			setFormData(initialValues);
		}
		setLoading(false);
		setOpen(false);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="default" onClick={() => setOpen(true)}>
					{isUpdate ? "Edit" : "New"}
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>{isUpdate ? "Edit" : "New"} Income</DialogTitle>
				</DialogHeader>

				<div className="grid gap-4 py-4">
					<div className="grid grid-cols-4 items-center gap-4">
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
					<div className="grid grid-cols-4 items-center gap-4">
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
                    <div className="grid grid-cols-4 items-center gap-4">
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
					<Button type="submit" disabled={loading} onClick={createCategory}>
						{loading ? "Saving..." : "Save"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
