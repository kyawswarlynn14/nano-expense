import { Timestamp } from "firebase/firestore"

export type TIncome = {
    id: string, 
    userid: string,
    title: string, 
    amount: number, 
    remark: string, 
    createdAt: Date | Timestamp,
    updatedAt: Date | Timestamp,
}

export type TOutcome = {
    id: string, 
    userid: string,
    title: string, 
    category: string, 
    amount: number, 
    remark: string, 
    createdAt: Date | Timestamp,
    updatedAt: Date | Timestamp,
}

export type TCategory = {
    id: string, 
    userid: string,
    title: string, 
    description: string,
}