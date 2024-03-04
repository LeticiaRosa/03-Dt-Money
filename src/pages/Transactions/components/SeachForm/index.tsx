import { MagnifyingGlass } from "phosphor-react";
import { SearchFormContainer } from "./styles";
import { useForm } from "react-hook-form";
import * as z from 'zod'
import { zodResolver } from "@hookform/resolvers/zod";
import { TransactionContext } from "../../../../contexts/TransactionsContext";
import { useContextSelector } from "use-context-selector";
import { memo } from "react";


/*

Por que um componente rendeiza ?
 - Hooks changed ( mudou estadom contexto, reducer e etc )
 - Props changed ( mudou as propriedades do componente )
 - Parent rerendered ( componente pai renderizou )
 
Qual  o fluxo de renderização do React ?
 1. O React recria o HTML da interface daquele componente.
 2. Compara a versão do HTML recrada com a versaão anterior
 3. SE mudou alguma coisa, ele reescreve o HTML na tela

MEMO:
Ele irá reinderizar o componentes apenas quando:
0. Hooks changed, Props changed ( deep comparison )
0.1: Comparar a versão do HTML recrida com a versão anterior
0.2: SE mudou algo, ele vai permitir a nova renderização

MEMO, quando usar ?
Optar por usar o MEMO apenas em components que tem muitos elementos em tela, com o HTML bem extenso.
Caso contrário não compensa, pois a comparação do react será mais efetiva que usar o MEMO

*/

const searchFormSchema = z.object({
  query: z.string()
})
type SearchFormInputs = z.infer<typeof searchFormSchema>

export const SearchForm = memo(function SearchFormComponent () {
  const fetchTransactions = useContextSelector(TransactionContext,(context)=>{ 
    return context.fetchTransactions
   }
  
)
  const {
    register, 
    handleSubmit, 
    formState : { 
    isSubmitting
  }} = useForm<SearchFormInputs>({
    resolver: zodResolver(searchFormSchema)
  })
  
  async function handleSearchTransactions(data: SearchFormInputs){
    await fetchTransactions(data.query)
  }
  return (
    <SearchFormContainer onSubmit={handleSubmit(handleSearchTransactions)}>
      <input type="text" placeholder="Busque por transações" { ...register('query')} />

      <button type="submit" disabled={isSubmitting}> 
        <MagnifyingGlass size={20} />
        Buscar
      </button>
    </SearchFormContainer>
  )
})

