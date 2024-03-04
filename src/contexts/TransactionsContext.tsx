import { ReactNode, useEffect, useState, useCallback } from "react";
import { api } from "../lib/axios";
import { createContext } from "use-context-selector";
import { toast } from "react-toastify";

interface Transaction {
  id: number;
  description: string;
  type: "income" | "outcome";
  price: number;
  category: string;
  createdAt: string;
}

interface CreateTransactionInput {
  description: string;
  type: "income" | "outcome";
  price: number;
  category: string;
}

interface TransactionContextType {
  transactions: Transaction[],
  fetchTransactions: (query: string)=> Promise<void>
  createTransaction: (data: CreateTransactionInput)=> Promise<void>
  deleteTransaction: (id:number)=> Promise<void>
}
interface TransactionsProviderProps {
  children: ReactNode; // qualquer elemento/component/text/numero válido no react
}

export const TransactionContext = createContext({} as TransactionContextType)

export function TransactionsProvider({ children }: TransactionsProviderProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  const fetchTransactions = useCallback(async (query?: string)=> {
    api.get('transactions',{
      params: {
        _sort:'createdAt',
        _order: 'desc',
        q:query
      }
    }).then((response)=> setTransactions(response.data))
    .catch((error)=> toast.error("Ocorreu um erro!"+ error, {
      position: "top-center"
    }))
  },[])

  const createTransaction = useCallback (
    async (data: CreateTransactionInput)=> {
    const { category, description, price, type  } = data
    api.post('transactions',{
      category,
      description,
      price,
      type,
      createdAt: new Date()
    }).then(((response)=>{
      const closeButton = document.getElementById('close-button-modal')
      closeButton?.click();
      setTransactions(state=>[response.data,...state])
      toast.success("Transação Cadastrada com Sucesso! ", {
        position: "top-center"
      })
    }
      
    )).catch((error)=>
    toast.error("Ocorreu um erro!"+ error, {
      position: "top-center"
    })
    )
  }, 
  [ ] )
  
  const deleteTransaction = useCallback (
    async (id: number)=> {
      api.delete(`transactions/${id}`)
      .then(()=>{
        fetchTransactions()
        toast.success("Transação Excluida com Sucesso! ", {
          position: "top-center"
        })
        
      }
        )
      .catch((error)=> toast.error("Ocorreu um erro!"+ error, {
        position: "top-center"
      })) 
  },
  [] )

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  return (
    <TransactionContext.Provider value={{ transactions, fetchTransactions, createTransaction,deleteTransaction }}>
      {children}
    </TransactionContext.Provider>
  )
}