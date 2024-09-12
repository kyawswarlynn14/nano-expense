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
import { CategoryForm } from "@/components/CategoryForm"
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "@/hooks/use-toast";

const Categories = () => {
  const { categoryLoading, categories } = useData();

  const deleteCategory = async (id: string) => {
    try{
      await deleteDoc(doc(db, "categories", id));
      toast({description: "Deleted successfully!"});
    } catch (err) {
      toast({variant: "destructive", description: "Something went wrong!"});
      console.log('delete category error >>', err)
    }
  }
  return (
    <div className="w-[98%] md:w-[90%] lg:w-[80%]  mx-auto">
        <div className="py-4">
          <CategoryForm />
        </div>
        
        <Table className="border">
          <TableCaption>A list of categories.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/3 font-bold">Title</TableHead>
              <TableHead className="w-1/3 font-bold">Description</TableHead>
              <TableHead className="w-1/3 font-bold text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          {categoryLoading ? (
            <TableBody>
              <TableRow>
                <TableCell></TableCell>
                <TableCell className="text-start font-bold py-2">Loading...</TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              {categories.map((i) => (
                <TableRow key={i.id}>
                  <TableCell className="font-medium">{i.title}</TableCell>
                  <TableCell>{i.description}</TableCell>
                  <TableCell className="flex items-center justify-center gap-2">
                    <CategoryForm isUpdate={true} item={i} />
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

export default Categories