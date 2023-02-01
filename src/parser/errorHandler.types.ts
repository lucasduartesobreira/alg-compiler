import { State } from '@/lexer/automata.types'
import { Lexer, Token } from '@/lexer/lexer.types'

type ParsingContext = {
  stack: Array<State>
  a: Token
  lexer: Lexer
  rulesPrinted: Array<string>
}

type UpdatedParsingContext = Omit<ParsingContext, 'lexer'>

type ErrorNumber = number
type ErrorContext = { error: ErrorNumber } & ParsingContext

type RecoveryModeHandler = (errorContext: ErrorContext) => UpdatedParsingContext

type ErrorTable = Map<ErrorNumber, RecoveryModeHandler>

type ErrorHandler = {
  handle(error: number, context: ParsingContext): UpdatedParsingContext
}

type ErrorData = Map<ErrorNumber, { messageFormat: string }>

export {
  ErrorHandler,
  ParsingContext,
  ErrorTable,
  ErrorContext,
  RecoveryModeHandler,
  ErrorData,
  UpdatedParsingContext
}
