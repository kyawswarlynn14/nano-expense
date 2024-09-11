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

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const years = [];
  for (let i = 2020; i <= 2030; i++) {
    years.push(i);
  }

  return (
    <div className="flex space-x-2">
      {/* Month Selector */}
      <Select value={months[month]} onValueChange={(value) => setMonth(months.indexOf(value))}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Select month" />
        </SelectTrigger>
        <SelectContent className="w-[150px]">
          {months.map((month) => (
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
          {years.map((year) => (
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
