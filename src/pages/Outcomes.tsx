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

  const filteredOutcomes = outcomes
    .filter((outcome) => {
      const outcomeDate = outcome.createdAt instanceof Timestamp ? outcome.createdAt.toDate() : outcome.createdAt;
      return outcomeDate.getMonth() === month && outcomeDate.getFullYear() === year;
    })
    .sort((a, b) => {
      const dateA = a.createdAt instanceof Timestamp ? a.createdAt.toDate() : a.createdAt;
      const dateB = b.createdAt instanceof Timestamp ? b.createdAt.toDate() : b.createdAt;
      return dateB.getTime() - dateA.getTime();
    });

  const totalAmount = filteredOutcomes.reduce((a, b) => a + Number(b.amount), 0)

  return (
    <div className="w-[98%] md:w-[90%] lg:w-[80%]  mx-auto">
      <div className="py-4 flex justify-between">
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
          <TableBody>
            <TableRow>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell className="text-start font-bold py-2">Loading...</TableCell>
            </TableRow>
          </TableBody>
        ) : (
          <TableBody>
            {filteredOutcomes.map((i) => (
              <TableRow key={i.id}>
                <TableCell className="font-medium">{i.title}</TableCell>
                <TableCell>{Number(i.amount).toLocaleString()} MMK</TableCell>
                <TableCell>{getCategoryName(categories, i.category)}</TableCell>
                <TableCell>{displayDate(i.createdAt)}</TableCell>
                <TableCell className="flex items-center justify-center gap-2">
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
