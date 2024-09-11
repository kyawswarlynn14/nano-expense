import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useData } from "@/App";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { deleteDoc, doc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "@/hooks/use-toast";
import { displayDate, getCategoryName } from "@/lib/services";
import MonthYearPicker from "@/components/MonthYearPicker";
import { useState } from "react";
import OutcomeDetail from "@/components/OutcomeDetail";
import OutcomeForm from "@/components/OutcomeForm";

const Incomes = () => {
  const date = new Date();
  const { outcomeLoading, outcomes, categories } = useData();
  const [month, setMonth] = useState(date.getMonth());
  const [year, setYear] = useState(date.getFullYear());

  const deleteOutcome = async (id: string) => {
    try {
      await deleteDoc(doc(db, "outcomes", id));
      toast({ description: "Deleted successfully!" });
    } catch (err) {
      toast({ variant: "destructive", description: "Something went wrong!" });
      console.log("delete outcome error >>", err);
    }
  };

  const filteredOutcomes = outcomes.filter((outcome) => {
    const outcomeDate = outcome.createdAt instanceof Timestamp ? outcome.createdAt.toDate() : outcome.createdAt;
    return outcomeDate.getMonth() === month && outcomeDate.getFullYear() === year;
  });

  const totalAmount = filteredOutcomes.reduce((a, b) => a + Number(b.amount), 0)

  return (
    <div className="w-[80%] mx-auto">
      <div className="py-2 flex justify-between">
        <OutcomeForm />
        <MonthYearPicker month={month} setMonth={setMonth} year={year} setYear={setYear} />
      </div>

      <Table className="border border-slate-300 shadow-lg">
        <TableCaption>A list of outcomes.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[20%] font-bold">Title</TableHead>
            <TableHead className="w-[15%] font-bold">Amount</TableHead>
            <TableHead className="w-[20%] font-bold">Category</TableHead>
            <TableHead className="w-{20%} font-bold">Created At</TableHead>
            <TableHead className="w-[25%] font-bold text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        {outcomeLoading ? (
          <p className="text-center font-medium py-4">Loading...</p>
        ) : (
          <TableBody>
            {filteredOutcomes.map((i) => (
              <TableRow key={i.id}>
                <TableCell className="font-medium">{i.title}</TableCell>
                <TableCell>{Number(i.amount).toLocaleString()} MMK</TableCell>
                <TableCell>{getCategoryName(categories, i.category)}</TableCell>
                <TableCell>{displayDate(i.createdAt)}</TableCell>
                <TableCell className="space-x-2 text-center">
                  <OutcomeDetail item={i} />
                  <OutcomeForm isUpdate={true} item={i} />
                  <ConfirmDialog fn={() => deleteOutcome(i.id)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
        <TableFooter>
          <TableRow className="font-bold">
            <TableCell>Total</TableCell>
            <TableCell>{totalAmount.toLocaleString()} MMK</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default Incomes;
