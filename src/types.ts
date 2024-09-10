
export type TIncome = {
    id: string, 
    title: string, 
    category: string, 
    amount: number, 
    remark: string, 
    createdAt: Date,
    updatedAt: Date,
}

export type TCategory = {
    id: string, 
    title: string, 
    description: string,
}