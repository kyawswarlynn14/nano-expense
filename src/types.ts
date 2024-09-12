import { Timestamp } from "firebase/firestore"
import React from "react";

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

export interface AppContextType {
    email: string;
    setEmail: React.Dispatch<React.SetStateAction<string>>;
    categoryLoading: boolean;
    categories: TCategory[];
    incomeLoading: boolean;
    incomes: TIncome[];
    outcomeLoading: boolean;
    outcomes: TOutcome[];
}