import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { TOutcome } from "@/types";
import { useState } from "react";
import { displayDate } from "@/lib/services";
import { Label } from "./ui/label";
import { BiSolidDetail } from "react-icons/bi";

export default function OutcomeDetail({
	item,
}: {
	item: TOutcome;
}) {
	const [open, setOpen] = useState(false);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<BiSolidDetail cursor={"pointer"} size={25} onClick={() => setOpen(true)} />
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Outcome Detail</DialogTitle>
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
