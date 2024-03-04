import { useMemo } from "react";
import { TransactionContext } from "../contexts/TransactionsContext";
import { useContextSelector } from "use-context-selector";

/*
useMemo, assim como o MEMO, é utilizado para impedir que o elemento ( no caso a variável ), 
seja reinderizado quando o componente pai foi reinderizado.
Exemplo:

const cachedValue = useMemo(calculateValue, dependencies)

calculateValue = Função que será executada 
dependencies = informe aqui as dependencias da função. 

Exemplo: se você estiver filtrando ou transformando uma matriz grande, ou fazendo algum cálculo caro, 
talvez você queira pular a tarefa novamente se os dados não tiverem sido alterados.

*/

export function useSummary(){
  const transactions = useContextSelector(TransactionContext,(context)=>{
    return context.transactions
  });

  const summary = useMemo(()=>{
    transactions.reduce((acc, transaction) => {
      if (transaction.type === 'income') {
        acc.income += transaction.price;
        acc.total += transaction.price;
      } else {
        acc.outcome += transaction.price;
        acc.total -= transaction.price;
      }
  
      return acc;
    },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    )
  },[transactions]);

  return summary
}