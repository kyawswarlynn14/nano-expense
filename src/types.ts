import { Timestamp } from "firebase/firestore"
import React from "react";

export type TUser = {
    uid: string,
    name?: string,
    email: string,
    accessToken: string,
}

export type TIncome = {
    id: string, 
    userid: string,
    title: string, 
    category: string,
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
    type: string,
    title: string, 
    description: string,
}

export interface AppContextType {
    user: TUser | undefined;
    setUser: React.Dispatch<React.SetStateAction<TUser | undefined>>;
    categoryLoading: boolean;
    categories: TCategory[];
    incomeLoading: boolean;
    incomes: TIncome[];
    outcomeLoading: boolean;
    outcomes: TOutcome[];
}