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
