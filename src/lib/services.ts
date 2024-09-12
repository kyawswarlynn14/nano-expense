import { TCategory } from "@/types";
import { format } from "date-fns";
import { Timestamp } from "firebase/firestore";

export const getCategoryName = (categories: TCategory[], id: string) => {
  return categories.find(c => c.id === id)?.title || "Unknown";
}

export function displayDate(date: Timestamp | Date) {
  const formattedDate = date instanceof Timestamp ? date.toDate() : date;

  return format(formattedDate, "dd-MM-yyyy");
}

export const thousandSeparator = (num: number) => {
  return new Intl.NumberFormat('en-US').format(num);
};

export const YEARS: number[] = [];
for (let i = 2020; i <= 2030; i++) {
  YEARS.push(i);
}

export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
