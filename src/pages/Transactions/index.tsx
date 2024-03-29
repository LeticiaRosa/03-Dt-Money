
import { Header } from "../../components/Header";
import { Summary } from "../../components/Summary";
import { SearchForm } from "./components/SeachForm";
import { PriceHighlight, TransactionsContainer, TransactionsTable } from "./styles";
import { TransactionContext } from "../../contexts/TransactionsContext";
import { dateFormatter, priceFormatter } from "../../utils/formatter";
import { useContextSelector } from "use-context-selector";
import { Trash } from "phosphor-react";
import { ToastContainer } from "react-toastify";

export function Transactions() {
  const  transactions  = useContextSelector(TransactionContext,(context)=>{
    return context.transactions
  })

  const  deleteTransaction = useContextSelector(TransactionContext,(context)=>{
    return context.deleteTransaction 
  })

  function handleDeleteTransaction(id:number) {
    deleteTransaction(id)
    
  }
  return (
    <div>
      <Header />
      <Summary />
      <TransactionsContainer>
        <SearchForm />
        <TransactionsTable>
          <tbody>
            {transactions.map((transaction) => {
              return (
                <tr key={transaction.id}>
                  <td width="50%">{transaction.description}</td>
                  <td>
                    <PriceHighlight $variant={transaction.type}>
                      {transaction.type === 'outcome' && '- '}
                      &nbsp;
                      {priceFormatter.format(transaction.price)}
                    </PriceHighlight>
                  </td>
                  <td>{transaction.category}</td>
                  <td>{dateFormatter.format(new Date(transaction.createdAt))}</td>
                  <td><button onClick={()=> handleDeleteTransaction(transaction.id)} ><Trash size={20}/></button></td>
                </tr>
              )
            })}


          </tbody>
        </TransactionsTable>
      </TransactionsContainer>
      <ToastContainer />
    </div>
  )
}