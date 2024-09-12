import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { toast } from "./use-toast";

function useGetRequest(tableName: string, email: string) {
	const [data, setData] = useState<any>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const onStartUp = async () => {
			try {
				const dataQuery = query(
					collection(db, tableName),
					where("userid", "==", email)
				);
				const unsubscribe = onSnapshot(
					dataQuery,
					(querySnapshot) => {
						const dataArray = querySnapshot.docs.map((doc) => ({
							...doc.data(),
							id: doc.id,
						}));
						setData(dataArray);
					}
				);

				return () => {
					unsubscribe();
				};
			} catch (err) {
				console.log(err);
                toast({variant: "destructive", description: "Something went wrong!"})
			} finally {
				setLoading(false);
			}
		};
		
		onStartUp();
	}, [email]);

	return { loading, data };
}

export default useGetRequest;