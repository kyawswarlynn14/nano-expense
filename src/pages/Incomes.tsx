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
import { displayDate } from "@/lib/services";
import IncomeForm from "@/components/IncomeForm";
import MonthYearPicker from "@/components/MonthYearPicker";
import { useState } from "react";
import IncomeDetail from "@/components/IncomeDetail";

const Incomes = () => {
  const date = new Date();
  const { incomeLoading, incomes } = useData();
  const [month, setMonth] = useState(date.getMonth());
  const [year, setYear] = useState(date.getFullYear());

  const deleteIncome = async (id: string) => {
    try {
      await deleteDoc(doc(db, "incomes", id));
      toast({ description: "Deleted successfully!" });
    } catch (err) {
      toast({ variant: "destructive", description: "Something went wrong!" });
      console.log("delete income error >>", err);
    }
  };

  const filteredIncomes = incomes
    .filter((income) => {
      const incomeDate = income.createdAt instanceof Timestamp ? income.createdAt.toDate() : income.createdAt;
      return incomeDate.getMonth() === month && incomeDate.getFullYear() === year;
    })
    .sort((a, b) => {
      const dateA = a.createdAt instanceof Timestamp ? a.createdAt.toDate() : a.createdAt;
      const dateB = b.createdAt instanceof Timestamp ? b.createdAt.toDate() : b.createdAt;
      return dateB.getTime() - dateA.getTime();
    });

  const totalAmount = filteredIncomes.reduce((a, b) => a + Number(b.amount), 0)

  return (
    <div className="w-[98%] md:w-[90%] lg:w-[80%]  mx-auto">
      <div className="py-4 flex justify-between">
        <IncomeForm />
        <MonthYearPicker month={month} setMonth={setMonth} year={year} setYear={setYear} />
      </div>

      <Table className="border border-slate-300 shadow-lg">
        <TableCaption>A list of incomes.</TableCaption>
        <TableHeader>
          <TableRow className="font-bold">
            <TableHead className="w-[20%]">Title</TableHead>
            <TableHead className="w-[15%]">Amount</TableHead>
            <TableHead className="w-[30%]">Remark</TableHead>
            <TableHead className="w-{15%}">Created At</TableHead>
            <TableHead className="w-[20%] text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        {incomeLoading ? (
          <TableBody>
            <TableRow>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell className="text-start font-bold py-2">Loading...</TableCell>
            </TableRow>
          </TableBody>
        ) : (
          <TableBody>
            {filteredIncomes.map((i) => (
              <TableRow key={i.id}>
                <TableCell className="font-medium">{i.title}</TableCell>
                <TableCell>{Number(i.amount).toLocaleString()} MMK</TableCell>
                <TableCell>{i.remark}</TableCell>
                <TableCell>{displayDate(i.createdAt)}</TableCell>
                <TableCell className="flex items-center justify-center gap-2">
                  <IncomeDetail item={i} />
                  <IncomeForm isUpdate={true} item={i} />
                  <ConfirmDialog fn={() => deleteIncome(i.id)} />
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
