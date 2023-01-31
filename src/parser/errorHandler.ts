/* eslint-disable no-constant-condition */
import {
  ErrorContext,
  ErrorHandler,
  ErrorData,
  ErrorTable,
  ParsingContext
} from './errorHandler.types'
import { NonTerminals } from './parser.types'
import { FOLLOW_TABLE, GOTO_TABLE } from './parsingTable'

const panicSync: Array<NonTerminals> = [
  "P'",
  'P',
  'V',
  'LV',
  'D',
  'A',
  'ES',
  'CMD',
  'COND'
]

const panicHandler = (context: ErrorContext) => {
  const { stack, lexer } = context
  let newA

  while (true) {
    const poppedStack = stack.pop()

    if (!poppedStack) throw 'Erro pilha vazia no panic handler'

    const stateGotoTable = GOTO_TABLE.get(poppedStack)

    if (!stateGotoTable) {
      continue
    }

    const gotoSyncRule = panicSync.find((value) => stateGotoTable.has(value))

    if (gotoSyncRule) {
      while (true) {
        newA = lexer.scanner()
        if (FOLLOW_TABLE.get(gotoSyncRule)?.has(newA.classe)) {
          return { stack, a: newA }
        }
      }
    }
  }
}

const PHRASE_MODE_TABLE: Map<
  number,
  (context: ErrorContext) => ParsingContext
> = new Map([])

const createPhraseHandler =
  (listOfActions: Array<(context: ErrorContext) => ParsingContext>) =>
  (context: ErrorContext) => {
    const { stack, a } = listOfActions.reduce((ctx, action) => {
      const newParsingContext = action(ctx)
      return {
        ...newParsingContext,
        error: context.error
      }
    }, context)

    return {
      stack,
      a
    }
  }

const addToStack = (state: number) => (context: ErrorContext) => {
  const { stack, a } = context

  stack.push(state)
  return { stack, a }
}

const readNewToken = (context: ErrorContext) => {
  const { lexer, stack } = context

  return { stack, a: lexer.scanner() }
}

const ERROR_TABLE: ErrorTable = new Map([]) // TODO: Definir essa tabela

const ERROR_DATA: ErrorData = new Map([])

const ErrorHandler: ErrorHandler = {
  handle(error, context) {
    console.log(
      ERROR_DATA.get(error)?.messageFormat.replace('%lexema%', context.a.lexema)
    )
    const recoveryModeHandler = ERROR_TABLE.get(error)

    if (!recoveryModeHandler) return panicHandler({ ...context, error })

    return recoveryModeHandler({ ...context, error })
  }
}

export { ErrorHandler }
