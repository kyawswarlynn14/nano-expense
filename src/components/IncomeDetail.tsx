import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { TIncome } from "@/types";
import { useState } from "react";
import { displayDate } from "@/lib/services";
import { Label } from "./ui/label";
import { BiSolidDetail } from "react-icons/bi";
import { Button } from "./ui/button";

export default function IncomeDetail({
	item,
}: {
	item: TIncome;
}) {
	const [open, setOpen] = useState(false);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button onClick={() => setOpen(true)} className="w-full flex justify-between items-center gap-2">
					<span>Details</span>
					<BiSolidDetail cursor={"pointer"} size={25} />
				</Button>
			</DialogTrigger>
			<DialogContent className="w-[90%] rounded-lg sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Income Detail</DialogTitle>
				</DialogHeader>

				<div className="grid gap-4 py-4">
                    <div className="input-container">
						<Label htmlFor="createdAt" className="text-right">
							Title
						</Label>
                        <div className="col-span-3">
                            {item.title}
                        </div>
					</div>

                    <div className="input-container">
						<Label htmlFor="createdAt" className="text-right">
							Amout
						</Label>
                        <div className="col-span-3">
                            {Number(item.amount).toLocaleString()} MMK
                        </div>
					</div>

                    <div className="input-container">
						<Label htmlFor="createdAt" className="text-right">
							Remark
						</Label>
                        <div className="col-span-3">
                            {item.remark}
                        </div>
					</div>

                    <div className="input-container">
						<Label htmlFor="createdAt" className="text-right">
							Created At
						</Label>
                        <div className="col-span-3">
                            {displayDate(item.createdAt)}
                        </div>
					</div>

                    <div className="input-container">
						<Label htmlFor="createdAt" className="text-right">
							Updated At
						</Label>
                        <div className="col-span-3">
                            {displayDate(item.updatedAt)}
                        </div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
