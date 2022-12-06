import { Reader } from '@/lexer/file.types'
import { Token } from './automata.types'

type Lexer = {
  nextToken(): Token
}

type LexerConstructor = (reader: Reader) => Lexer

export { Lexer, LexerConstructor }
