import { MONTHS, YEARS } from "@/lib/services";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";

const MonthYearPicker = ({
  month, 
  setMonth, 
  year, 
  setYear
} : {
  month: number,
  setMonth: React.Dispatch<React.SetStateAction<number>>,
  year: number,
  setYear: React.Dispatch<React.SetStateAction<number>>,
}) => {

  return (
    <div className="flex space-x-2">
      {/* Month Selector */}
      <Select value={MONTHS[month]} onValueChange={(value) => setMonth(MONTHS.indexOf(value))}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Select month" />
        </SelectTrigger>
        <SelectContent className="w-[150px]">
          {MONTHS.map((month) => (
            <SelectItem key={month} value={month}>
              {month}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Year Selector */}
      <Select value={year.toString()} onValueChange={(value) => setYear(parseInt(value))}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Select year" />
        </SelectTrigger>
        <SelectContent className="w-[150px]">
          {YEARS.map((year) => (
            <SelectItem key={year} value={year.toString()}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default MonthYearPicker;
