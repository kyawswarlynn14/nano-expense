import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { TOutcome } from "@/types";
import { useState } from "react";
import { displayDate, thousandSeparator } from "@/lib/services";
import { Label } from "./ui/label";

export default function OutcomeDetail({
	item,
}: {
	item: TOutcome;
}) {
	const [open, setOpen] = useState(false);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button size={"sm"} variant="default" onClick={() => setOpen(true)}>
					More
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Outcome Detail</DialogTitle>
				</DialogHeader>

				<div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="createdAt" className="text-right">
							Title
						</Label>
                        <div className="col-span-3">
                            {item.title}
                        </div>
					</div>

                    <div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="createdAt" className="text-right">
							Amout
						</Label>
                        <div className="col-span-3">
                            {thousandSeparator(item.amount)} MMK
                        </div>
					</div>

                    <div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="createdAt" className="text-right">
							Remark
						</Label>
                        <div className="col-span-3">
                            {item.remark}
                        </div>
					</div>

                    <div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="createdAt" className="text-right">
							Created At
						</Label>
                        <div className="col-span-3">
                            {displayDate(item.createdAt)}
                        </div>
					</div>

                    <div className="grid grid-cols-4 items-center gap-4">
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
