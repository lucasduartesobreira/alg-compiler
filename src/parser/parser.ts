/* eslint-disable no-constant-condition */
import { ErrorHandler } from './errorHandler'
import { NonTerminals, Parser } from './parser.types'
import { ACTION_TABLE, GOTO_TABLE, GRAMMAR_RULES } from './parsingTable'

const popAmountPerRule = new Map(
  Array.from(GRAMMAR_RULES.entries()).map((value) => [
    value[0],
    value[1].replace(/[A-Z']+->/, '').split(' ').length
  ])
)

console.log(popAmountPerRule.get(7))

const ruleLetter = new Map(
  Array.from(GRAMMAR_RULES.entries()).map((value) => [
    value[0],
    value[1].replace(/->.*/, '')
  ])
)

const Parser: Parser = {
  parse(lexer) {
    let stack = [0]
    let a = lexer.scanner()
    let s = 0
    const rulesPrinted = []
    while (true) {
      s = stack.at(-1) as number
      const actionsForState = ACTION_TABLE.get(s)

      if (!actionsForState) throw 'Erro na tabela de ações'

      const action = actionsForState.get(a.classe)

      if (action?.action === 'SHIFT') {
        stack.push(action.identifier)
        a = lexer.scanner()
      } else if (action?.action === 'REDUCE') {
        const amountToPop = popAmountPerRule.get(action.identifier) as number
        stack = stack.slice(0, -amountToPop)

        const t = stack.at(-1) as number

        const ruleSymbol = ruleLetter.get(action.identifier) as NonTerminals
        stack.push(GOTO_TABLE.get(t)?.get(ruleSymbol) as number)

        const fullRuleText = GRAMMAR_RULES.get(action.identifier) as string
        console.log(fullRuleText)
        rulesPrinted.push(fullRuleText)
      } else if (action?.action === 'ACCEPT') {
        break
      } else if (action?.action === 'ERROR') {
        const updatedContext = ErrorHandler.handle(action.identifier, {
          stack,
          a,
          lexer
        })
        stack = updatedContext.stack
        a = updatedContext.a
      } else {
        throw 'Erro ação não encontrada'
      }
    }

    return rulesPrinted
  }
}

export { Parser }
