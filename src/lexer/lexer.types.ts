import { Reader } from '@/lexer/file.types'
import { TypeofToken } from './automata.types'

type Token = {
  type: TypeofToken
  details: string
  start: number
  end: number
}

type Lexer = {
  nextToken(): Token
}

type LexerConstructor = (reader: Reader) => Lexer

export { Lexer, LexerConstructor }
