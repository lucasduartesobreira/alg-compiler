import { SemanticAnalyzer } from '@/semantic/semanticRules'
import { NodeStack } from '@/semantic/semanticRules.types'
import { ErrorHandler } from './errorHandler'
import { NonTerminals, Parser } from './parser.types'
import {
  ACTION_TABLE,
  GOTO_TABLE,
  GRAMMAR_RULES,
  POP_AMOUNT_PER_RULE,
  RULE_LETTER
} from './parsingTable'

const Parser: Parser = {
  parse(lexer) {
    let stack = [0]
    let a = lexer.scanner()
    let s = 0
    let rulesPrinted: string[] = []

    let lastX = 0
    let textObject = ''
    let nodeStack: NodeStack = []
    let temporaryVariables: Map<
      number,
      {
        identifier: string
        type: 'int' | 'double' | 'literal'
      }
    > = new Map()

    let shouldCreateOBJ = true

    let lastToken = a
    while (stack.length > 0) {
      s = stack.at(-1) as number
      const actionsForState = ACTION_TABLE.get(s)

      if (!actionsForState) throw 'Erro na tabela de ações'

      const action = actionsForState.get(a.classe)

      if (action?.action === 'SHIFT') {
        stack.push(action.identifier)
        nodeStack.push(a)
        lastToken = a
        a = lexer.scanner()
      } else if (action?.action === 'REDUCE') {
        const amountToPop = POP_AMOUNT_PER_RULE.get(action.identifier) as number
        stack = stack.slice(0, -amountToPop)

        const t = stack.at(-1) as number

        const ruleSymbol = RULE_LETTER.get(action.identifier) as NonTerminals
        stack.push(GOTO_TABLE.get(t)?.get(ruleSymbol) as number)

        const fullRuleText = GRAMMAR_RULES.get(action.identifier) as string
        rulesPrinted.push(fullRuleText)

        const updatedSemanticContext = SemanticAnalyzer.analyze(
          action.identifier,
          {
            lastX,
            semanticStack: nodeStack,
            ruleIndex: action.identifier,
            textObject,
            amountToPopFromStack: amountToPop,
            ruleSymbol,
            symbolTable: lexer.getSymbolTable(),
            temporaryVariables,
            shouldCreateOBJ
          }
        )

        lastX = updatedSemanticContext.lastX
        nodeStack = updatedSemanticContext.semanticStack
        textObject = updatedSemanticContext.textObject
        temporaryVariables = updatedSemanticContext.temporaryVariables
        shouldCreateOBJ = updatedSemanticContext.shouldCreateOBJ
      } else if (action?.action === 'ACCEPT') {
        break
      } else if (action?.action === 'ERROR') {
        const updatedContext = ErrorHandler.handle(action.identifier, {
          stack,
          a,
          lexer,
          rulesPrinted,
          lastToken,
          semanticStack: nodeStack
        })
        stack = updatedContext.stack
        a = updatedContext.a
        rulesPrinted = updatedContext.rulesPrinted
      } else {
        if (a.classe === 'ERROR') {
          console.log(
            `Erro Léxico: ${
              a.description ?? 'token escrito de maneira incorreta'
            }`
          )

          a = lexer.scanner()

          continue
        }
        throw 'Erro ação não encontrada, cancelando o parsing'
      }
    }

    return {
      rulesPrinted,
      object: {
        shouldCreateOBJ,
        textObject
      }
    }
  }
}

export { Parser }
