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
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "@/hooks/use-toast";
import { changeTimestampToDate, displayDate } from "@/lib/services";
import IncomeForm from "@/components/IncomeForm";
import MonthYearPicker from "@/components/MonthYearPicker";
import { useEffect, useState } from "react";
import IncomeDetail from "@/components/IncomeDetail";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CgMoreVerticalO } from "react-icons/cg";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TIncome } from "@/types";

const Incomes = () => {
  const date = new Date();
  const { incomeLoading, incomes, categories, categoryLoading } = useData();
  const [month, setMonth] = useState(date.getMonth());
  const [year, setYear] = useState(date.getFullYear());
  const [showAll, setShowAll] = useState(false);
  const [categoryId, setCategoryId] = useState('');
  const [filteredIncomes, setFilteredIncomes] = useState<TIncome[]>([]);

  useEffect(() => {
    if(showAll) {
      if(categoryId && categoryId !== "-") {
        setFilteredIncomes(incomes.filter(income => income.category === categoryId));
      } else {
        setFilteredIncomes(incomes);
      }
    } else {
      const data = (categoryId && categoryId !== "-") 
      ? incomes.filter((income) => {
        const incomeDate = changeTimestampToDate(income.createdAt);
        return incomeDate.getMonth() === month && incomeDate.getFullYear() === year && income.category === categoryId;
      })
      : incomes.filter((income) => {
          const incomeDate = changeTimestampToDate(income.createdAt);
          return incomeDate.getMonth() === month && incomeDate.getFullYear() === year;
        });
      setFilteredIncomes(data);
    }
  }, [categoryId, incomes, showAll, month, year]);

  const deleteIncome = async (id: string) => {
    try {
      await deleteDoc(doc(db, "incomes", id));
      toast({ description: "Deleted successfully!" });
    } catch (err) {
      toast({ variant: "destructive", description: "Something went wrong!" });
      console.log("delete income error >>", err);
    }
  };

  const totalAmount = filteredIncomes.reduce((a, b) => a + Number(b.amount), 0)

  return (
    <div className="w-[98%] md:w-[90%] lg:w-[80%]  mx-auto">
      <div className="pt-4 flex justify-between items-center">
        <IncomeForm />

        <div className="flex items-center gap-2">
          <Checkbox id="showAll" checked={showAll} onCheckedChange={() => setShowAll(prev => !prev)} />

          <label
            htmlFor="showAll"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Show all?
          </label>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 py-2">
        <Select 
            disabled={categoryLoading} 
            value={categoryId}
            onValueChange={value => setCategoryId(value)}
          >
            <SelectTrigger className="w-[100px] md:w-[150px]">
              <SelectValue
                placeholder={
                  categoryLoading ? "Loading..." : "Categories"
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value={"-"}>All</SelectItem>
                {categories.length > 0 &&
                  categories.filter(c => c.type === '001').map((i) => (
                    <SelectItem key={i.id} value={i.id}>
                      {i.title}
                    </SelectItem>
                  ))}
              </SelectGroup>
            </SelectContent>
        </Select>

        { !showAll && <MonthYearPicker month={month} setMonth={setMonth} year={year} setYear={setYear} />}
      </div>

      <Table className="border border-slate-300 shadow-lg">
        <TableCaption>A list of incomes.</TableCaption>
        <TableHeader>
          <TableRow className="font-bold">
            <TableHead className="w-[25%]">Title</TableHead>
            <TableHead className="w-[25%]">Amount</TableHead>
            <TableHead className="w-[25%] hidden md:block">Remark</TableHead>
            <TableHead className="w-[25%] md:w-[20%]">Created At</TableHead>
            <TableHead className="w-[10%] text-center">Action</TableHead>
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
            {filteredIncomes.sort((a, b) => {
              const dateA = changeTimestampToDate(a.createdAt);
              const dateB = changeTimestampToDate(b.createdAt);
              return dateB.getTime() - dateA.getTime();
            }).map((i) => (
              <TableRow key={i.id}>
                <TableCell className="font-medium">{i.title}</TableCell>
                <TableCell>{Number(i.amount).toLocaleString()} MMK</TableCell>
                <TableCell className="hidden md:block">{i.remark}</TableCell>
                <TableCell>{displayDate(i.createdAt)}</TableCell>
                <TableCell className="flex items-center justify-center">
                  <Popover>
                    <PopoverTrigger><CgMoreVerticalO size={22} /></PopoverTrigger>
                    <PopoverContent side="left" align="start" className="w-36 space-y-1">
                      <IncomeDetail item={i} />
                      <IncomeForm isUpdate={true} item={i} />
                      <ConfirmDialog fn={() => deleteIncome(i.id)} />
                    </PopoverContent>
                  </Popover>
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
