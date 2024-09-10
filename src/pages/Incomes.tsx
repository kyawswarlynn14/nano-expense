import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useData } from "@/App"
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "@/hooks/use-toast";
import { displayDate, getCategoryName } from "@/lib/services";
import IncomeForm from "@/components/IncomeForm";

const Incomes = () => {
  const { incomeLoading, incomes, categories } = useData();

  const deleteCategory = async (id: string) => {
    try{
      await deleteDoc(doc(db, "incomes", id));
      toast({description: "Deleted successfully!"});
    } catch (err) {
      toast({variant: "destructive", description: "Something went wrong!"});
      console.log('delete income error >>', err)
    }
  }
  return (
    <div className="w-[80%] mx-auto">
        <div className="py-4">
          <IncomeForm />
        </div>
        
        <Table className="border">
          <TableCaption>A list of incomes.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/5 font-bold">Title</TableHead>
              <TableHead className="w-1/5 font-bold">Category</TableHead>
              <TableHead className="w-1/5 font-bold">Amount</TableHead>
              <TableHead className="w-1/5 font-bold">Created At</TableHead>
              <TableHead className="w-1/5 font-bold text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          {incomeLoading ? (
            <p className="text-center font-medium py-4">Loading...</p>
          ) : (
            <TableBody>
              {incomes.map((i) => (
                <TableRow key={i.id}>
                  <TableCell className="font-medium">{i.title}</TableCell>
                  <TableCell>{getCategoryName(categories, i.category)}</TableCell>
                  <TableCell>{i.amount}</TableCell>
                  <TableCell>{displayDate(i.createdAt)}</TableCell>
                  <TableCell className="space-x-2 text-center">
                    <IncomeForm isUpdate={true} item={i} />
                    <ConfirmDialog fn={() => deleteCategory(i.id)} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
    </div>
  )
}

export default Incomes;