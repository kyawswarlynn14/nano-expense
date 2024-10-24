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
import { changeTimestampToDate, displayDate, getCategoryName } from "@/lib/services";
import MonthYearPicker from "@/components/MonthYearPicker";
import { useEffect, useState } from "react";
import OutcomeDetail from "@/components/OutcomeDetail";
import OutcomeForm from "@/components/OutcomeForm";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TOutcome } from "@/types";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CgMoreVerticalO } from "react-icons/cg";

const Incomes = () => {
  const date = new Date();
  const { outcomeLoading, outcomes, categories, categoryLoading } = useData();
  const [month, setMonth] = useState(date.getMonth());
  const [year, setYear] = useState(date.getFullYear());
  const [showAll, setShowAll] = useState(false);
  const [categoryId, setCategoryId] = useState('');
  const [filteredOutcomes, setFilteredOutcomes] = useState<TOutcome[]>([]);

  useEffect(() => {
    if(showAll) {
      if(categoryId && categoryId !== "-") {
        setFilteredOutcomes(outcomes.filter(outcome => outcome.category === categoryId));
      } else {
        setFilteredOutcomes(outcomes);
      }
    } else {
      const data = (categoryId && categoryId !== "-") 
      ? outcomes.filter((outcome) => {
        const outcomeDate = changeTimestampToDate(outcome.createdAt);
        return outcomeDate.getMonth() === month && outcomeDate.getFullYear() === year && outcome.category === categoryId;
      })
      : outcomes.filter((outcome) => {
          const outcomeDate = changeTimestampToDate(outcome.createdAt);
          return outcomeDate.getMonth() === month && outcomeDate.getFullYear() === year;
        });
      setFilteredOutcomes(data);
    }
  }, [categoryId, outcomes, showAll, month, year]);

  const deleteOutcome = async (id: string) => {
    try {
      await deleteDoc(doc(db, "outcomes", id));
      toast({ description: "Deleted successfully!" });
    } catch (err) {
      toast({ variant: "destructive", description: "Something went wrong!" });
      console.log("delete outcome error >>", err);
    }
  };

  const totalAmount = filteredOutcomes.reduce((a, b) => a + Number(b.amount), 0)

  return (
    <div className="w-[98%] md:w-[90%] lg:w-[80%]  mx-auto">
      <div className="pt-4 flex justify-between items-center">
        <OutcomeForm />

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
                  categories.filter(c => c.type === '002').map((i) => (
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
        <TableCaption>A list of outcomes.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[25%] font-bold">Title</TableHead>
            <TableHead className="w-[23%] font-bold">Amount</TableHead>
            <TableHead className="w-[20%] font-bold hidden md:block">Category</TableHead>
            <TableHead className="w-[22%] font-bold">Created At</TableHead>
            <TableHead className="w-[10%] font-bold text-center">Action</TableHead>
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
            {filteredOutcomes.sort((a, b) => {
              const dateA = changeTimestampToDate(a.createdAt);
              const dateB = changeTimestampToDate(b.createdAt);
              return dateB.getTime() - dateA.getTime();
            }).map((i) => (
              <TableRow key={i.id}>
                <TableCell className="font-medium">{i.title}</TableCell>
                <TableCell>{Number(i.amount).toLocaleString()} MMK</TableCell>
                <TableCell className="hidden md:block">{getCategoryName(categories, i.category)}</TableCell>
                <TableCell>{displayDate(i.createdAt)}</TableCell>
                <TableCell className="flex items-center justify-center gap-2">
                  <Popover>
                    <PopoverTrigger><CgMoreVerticalO size={22} /></PopoverTrigger>
                    <PopoverContent side="left" align="start" className="w-36 space-y-1">
                      <OutcomeDetail item={i} />
                      <OutcomeForm isUpdate={true} item={i} />
                      <ConfirmDialog fn={() => deleteOutcome(i.id)} />
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
