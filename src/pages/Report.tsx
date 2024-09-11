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
import { useState } from "react";
import { Timestamp } from "firebase/firestore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Report = () => {
  const date = new Date();
  const { incomes, outcomes, incomeLoading, outcomeLoading } = useData();
  const [year, setYear] = useState(date.getFullYear());

  const years = [];
  for (let i = 2020; i <= 2030; i++) {
    years.push(i);
  }

  const getMonthName = (monthIndex: number) => {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    return months[monthIndex];
  };

  // Initialize months with empty arrays
  const initializeMonthlyData = () => {
    return Object.fromEntries(
      Array.from({ length: 12 }, (_, i) => [getMonthName(i), []])
    );
  };

  const filteredIncomes = incomes.filter((income) => {
    const incomeDate = income.createdAt instanceof Timestamp ? income.createdAt.toDate() : income.createdAt;
    return incomeDate.getFullYear() === year;
  });

  const filteredOutcomes = outcomes.filter((outcome) => {
    const outcomeDate = outcome.createdAt instanceof Timestamp ? outcome.createdAt.toDate() : outcome.createdAt;
    return outcomeDate.getFullYear() === year;
  });

  // Group data by month
  const groupedIncomes = filteredIncomes.reduce((acc: any, income) => {
    const incomeDate = income.createdAt instanceof Timestamp ? income.createdAt.toDate() : income.createdAt;
    const monthName = getMonthName(incomeDate.getMonth());
    acc[monthName].push(income);
    return acc;
  }, initializeMonthlyData());

  const groupedOutcomes = filteredOutcomes.reduce((acc: any, outcome) => {
    const outcomeDate = outcome.createdAt instanceof Timestamp ? outcome.createdAt.toDate() : outcome.createdAt;
    const monthName = getMonthName(outcomeDate.getMonth());
    acc[monthName].push(outcome);
    return acc;
  }, initializeMonthlyData());

  return (
    <div className="w-[80%] mx-auto">
      <div className="py-2">
        <Select value={year.toString()} onValueChange={(value) => setYear(parseInt(value))}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent className="w-[150px]">
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Table className="border border-slate-300 shadow-lg">
        <TableCaption>A list of report.</TableCaption>
        <TableHeader>
          <TableRow className="font-bold">
            <TableHead className="w-[40%]">Month</TableHead>
            <TableHead className="w-[30%]">Incomes</TableHead>
            <TableHead className="w-[30%]">Outcomes</TableHead>
          </TableRow>
        </TableHeader>
        {incomeLoading || outcomeLoading ? (
          <p className="text-center font-medium py-4">Loading...</p>
        ) : (
          <TableBody>
            {Object.keys(initializeMonthlyData()).map((month) => (
              <TableRow key={month}>
                <TableCell className="font-medium">{month}</TableCell>
                <TableCell>
                  {groupedIncomes[month].reduce((total: number, income: any) => total + Number(income.amount), 0).toLocaleString()} MMK
                </TableCell>
                <TableCell>
                  {groupedOutcomes[month].reduce((total: number, outcome: any) => total + Number(outcome.amount), 0).toLocaleString()} MMK
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
        <TableFooter>
          <TableRow className="font-bold">
            <TableCell>Total</TableCell>
            <TableCell>
              {Object.values(groupedIncomes).flat().reduce((total: number, income: any) => total + Number(income.amount), 0).toLocaleString()} MMK
            </TableCell>
            <TableCell>
              {Object.values(groupedOutcomes).flat().reduce((total: number, outcome: any) => total + Number(outcome.amount), 0).toLocaleString()} MMK
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default Report;
