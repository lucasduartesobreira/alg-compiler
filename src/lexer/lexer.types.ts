import { Reader } from '@/lexer/file.types'
//import { TypeofToken } from './automata.types'

enum TypeofToken {
  ConstanteNumerica = 'NUM',
  ConstanteLiteral = 'LIT',
  Identificador = 'ID',
  Comentario = 'COMMENT',
  EndOfFile = 'EOF',
  OPR = 'OPR',
  ATR = 'ATR',
  OPA = 'OPA',
  AB_P = 'AB_P',
  FC_P = 'FC_P',
  PT_V = 'PT_V',
  VIR = 'VIR',
  ERROR = 'ERROR',
  IGNORAR = 'IGNORAR',
  inicio = 'inicio',
  varinicio = 'varinicio',
  varfim = 'varfim',
  escreva = 'escreva',
  leia = 'leia',
  se = 'se',
  entao = 'entao',
  fimse = 'fimse',
  fim = 'fim',
  inteiro = 'inteiro',
  literal = 'literal',
  real = 'real'
}
interface TokenNode<T extends TypeofToken> {
  type: T
}

interface TokenValueNode<T extends TypeofToken> extends TokenNode<T> {
  value: string
}

type Token =
  | TokenNode<TypeofToken.Comentario>
  | TokenNode<TypeofToken.EndOfFile>
  | TokenNode<TypeofToken.OPR>
  | TokenNode<TypeofToken.ATR>
  | TokenNode<TypeofToken.OPA>
  | TokenNode<TypeofToken.AB_P>
  | TokenNode<TypeofToken.FC_P>
  | TokenNode<TypeofToken.PT_V>
  | TokenNode<TypeofToken.VIR>
  | TokenNode<TypeofToken.ERROR>
  | TokenNode<TypeofToken.IGNORAR>
  | TokenNode<TypeofToken.inicio>
  | TokenNode<TypeofToken.varinicio>
  | TokenNode<TypeofToken.varfim>
  | TokenNode<TypeofToken.escreva>
  | TokenNode<TypeofToken.leia>
  | TokenNode<TypeofToken.se>
  | TokenNode<TypeofToken.entao>
  | TokenNode<TypeofToken.fimse>
  | TokenNode<TypeofToken.fim>
  | TokenNode<TypeofToken.inteiro>
  | TokenNode<TypeofToken.literal>
  | TokenNode<TypeofToken.real>
  | TokenValueNode<TypeofToken.ConstanteNumerica>
  | TokenValueNode<TypeofToken.Identificador>
  | TokenValueNode<TypeofToken.ConstanteLiteral>
/* details: string
  start: number
  end: number */

type Lexer = {
  nextToken(): Token
}

type LexerConstructor = (reader: Reader) => Lexer

export { Lexer, LexerConstructor, Token, TypeofToken }
