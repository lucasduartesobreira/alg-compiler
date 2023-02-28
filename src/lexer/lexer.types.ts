import { Reader } from '@/lexer/file.types'
import { TokenType, TypeofToken } from './automata.types'

type Lexema = string
type ReservedWords =
  | 'se'
  | 'inicio'
  | 'varinicio'
  | 'varfim'
  | 'escreva'
  | 'leia'
  | 'entao'
  | 'fimse'
  | 'fim'
  | 'inteiro'
  | 'literal'
  | 'real'

type Token = {
  classe: TypeofToken | ReservedWords
  lexema: string
  tipo: TokenType | ReservedWords
  start: { line: number; column: number }
  end: { line: number; column: number }
  description?: string
}

type SymbolTable = Map<Lexema, Token>

type Lexer = {
  scanner(): Token
  getSymbolTable(): SymbolTable
}

type LexerConstructor = (reader: Reader) => Lexer

export { Lexer, LexerConstructor, Lexema, Token, ReservedWords, SymbolTable }
