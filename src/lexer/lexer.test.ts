import mock from 'mock-fs'
import { Reader } from './file'
import { Lexer } from './lexer'
import { Token } from './lexer.types'

type Examples = {
  source: string
  expectedTokens: Token[]
}[]

const testExamples = (setOfExamples: Examples) => {
  for (const example of setOfExamples) {
    mock({
      'path/with/content': {
        'file.mgol': example.source
      }
    })

    const reader = Reader('path/with/content/file.mgol')
    const lexer = Lexer(reader)

    for (const expectedToken of example.expectedTokens) {
      const nextToken = lexer.scanner()

      expect(nextToken.classe).toBe(expectedToken.classe)
      expect(nextToken.tipo).toBe(expectedToken.tipo)
      expect(nextToken.lexema).toBe(expectedToken.lexema)
      expect(nextToken.description).toBe(expectedToken.description)
      expect(nextToken.start).toStrictEqual(expectedToken.start)
      expect(nextToken.end).toStrictEqual(expectedToken.end)
    }

    mock.restore()
  }
}

describe('Testing lexer', () => {
  test('tokens with space in between', () => {
    const examples: Examples = [
      {
        source: '123 se aux @ x 1\n fimse',
        expectedTokens: [
          {
            classe: 'NUM',
            lexema: '123',
            tipo: 'INTEIRO',
            start: { line: 1, column: 1 },
            end: { line: 1, column: 3 }
          },
          {
            classe: 'se',
            lexema: 'se',
            tipo: 'se',
            start: { line: -1, column: -1 },
            end: { line: -1, column: -1 }
          },
          {
            classe: 'ID',
            lexema: 'aux',
            tipo: 'NULO',
            start: { line: 1, column: 8 },
            end: { line: 1, column: 10 }
          },
          {
            classe: 'ERROR',
            lexema: '@',
            tipo: 'NULO',
            start: { line: 1, column: 12 },
            end: { line: 1, column: 12 },
            description: 'Erro caractere inválido, linha: 1 e coluna: 12'
          },
          {
            classe: 'ID',
            lexema: 'x',
            tipo: 'NULO',
            start: { line: 1, column: 14 },
            end: { line: 1, column: 14 }
          },
          {
            classe: 'NUM',
            lexema: '1',
            tipo: 'INTEIRO',
            start: { line: 1, column: 16 },
            end: { line: 1, column: 16 }
          },
          {
            classe: 'fimse',
            lexema: 'fimse',
            tipo: 'fimse',
            start: { line: -1, column: -1 },
            end: { line: -1, column: -1 }
          }
        ]
      }
    ]

    testExamples(examples)
  })

  test('code example', () => {
    const examples: Examples = [
      {
        source: 
`inicio
  varinicio
    literal A;
    inteiro B, D, E;
    real C ;
  varfim;
  escreva "Digite B:";
  leia B;
  escreva "Digite A:";
  leia A;
  se(B>2)
  entao
    se(B<=4)
    entao
      escreva "B esta entre 2 e 4";
    fimse
  fimse
  B<-B+1;
  B<-B+2;
  B<-B+3;
  D<-B;
  C<-5.0;
  E<-B+2;
  escreva C;
  B<-B+1;
  escreva "\nB=\n"; {\n é o símbolo para salto de linha}
  escreva D;
  escreva "\n";
  escreva C;
  escreva "\n";
  escreva A;
  fim`,
        expectedTokens: [
          {
            classe: 'inicio',
            tipo: 'inicio',
            lexema: 'inicio',
            start: { line: -1, column: -1 },
            end: { line: -1, column: -1 }
          },
          {
            classe: 'varinicio',
            tipo: 'varinicio',
            lexema: 'varinicio',
            start: { line: -1, column: -1 },
            end: { line: -1, column: -1 }
          },
          {
            classe: 'literal',
            tipo: 'literal',
            lexema: 'literal',
            start: { line: -1, column: -1 },
            end: { line: -1, column: -1 }
          },
          {
            classe: 'ID',
            tipo: 'NULO',
            lexema: 'A',
            start: { line: 3, column: 12 },
            end: { line: 3, column: 12 }
          },
          {
            classe: 'PT_V',
            tipo: 'NULO',
            lexema: ';',
            start: { line: 3, column: 13 },
            end: { line: 3, column: 13 }
          },
          {
            classe: 'inteiro',
            tipo: 'inteiro',
            lexema: 'inteiro',
            start: { line: -1, column: -1 },
            end: { line: -1, column: -1 }
          },
          {
            classe: 'ID',
            tipo: 'NULO',
            lexema: 'B',
            start: { line: 4, column: 12 },
            end: { line: 4, column: 12 }
          },
          {
            classe: 'VIR',
            tipo: 'NULO',
            lexema: ',',
            start: { line: 4, column: 13 },
            end: { line: 4, column: 13 }
          },
          {
            classe: 'ID',
            tipo: 'NULO',
            lexema: 'D',
            start: { line: 4, column: 15 },
            end: { line: 4, column: 15 }
          },
          {
            classe: 'VIR',
            tipo: 'NULO',
            lexema: ',',
            start: { line: 4, column: 16 },
            end: { line: 4, column: 16 }
          },
          {
            classe: 'ID',
            tipo: 'NULO',
            lexema: 'E',
            start: { line: 4, column: 18 },
            end: { line: 4, column: 18 }
          },
          {
            classe: 'PT_V',
            tipo: 'NULO',
            lexema: ';',
            start: { line: 4, column: 19 },
            end: { line: 4, column: 19 }
          },
          {
            classe: 'real',
            tipo: 'real',
            lexema: 'real',
            start: { line: -1, column: -1 },
            end: { line: -1, column: -1 }
          },
          {
            classe: 'ID',
            tipo: 'NULO',
            lexema: 'C',
            start: { line: 5, column: 9 },
            end: { line: 5, column: 9 }
          },
          {
            classe: 'PT_V',
            tipo: 'NULO',
            lexema: ';',
            start: { line: 5, column: 11 },
            end: { line: 5, column: 11 }
          },
          {
            classe: 'varfim',
            tipo: 'varfim',
            lexema: 'varfim',
            start: { line: -1, column: -1 },
            end: { line: -1, column: -1 }
          },
          {
            classe: 'PT_V',
            tipo: 'NULO',
            lexema: ';',
            start: { line: 6, column: 8 },
            end: { line: 6, column: 8 }
          },
          {
            classe: 'escreva',
            tipo: 'escreva',
            lexema: 'escreva',
            start: { line: -1, column: -1 },
            end: { line: -1, column: -1 }
          },
          {
            classe: 'LIT',
            tipo: 'LITERAL',
            lexema: '"Digite B:"',
            start: { line: 7, column: 10 },
            end: { line: 7, column: 20 }
          },
          {
            classe: 'PT_V',
            tipo: 'NULO',
            lexema: ';',
            start: { line: 7, column: 21 },
            end: { line: 7, column: 21 }
          },
          {
            classe: 'leia',
            tipo: 'leia',
            lexema: 'leia',
            start: { line: -1, column: -1 },
            end: { line: -1, column: -1 }
          },
          {
            classe: 'ID',
            tipo: 'NULO',
            lexema: 'B',
            start: { line: 4, column: 12 },
            end: { line: 4, column: 12 }
          },
          {
            classe: 'PT_V',
            tipo: 'NULO',
            lexema: ';',
            start: { line: 8, column: 8 },
            end: { line: 8, column: 8 }
          },
          {
            classe: 'escreva',
            tipo: 'escreva',
            lexema: 'escreva',
            start: { line: -1, column: -1 },
            end: { line: -1, column: -1 }
          },
          {
            classe: 'LIT',
            tipo: 'LITERAL',
            lexema: '"Digite A:"',
            start: { line: 9, column: 10 },
            end: { line: 9, column: 20 }
          },
          {
            classe: 'PT_V',
            tipo: 'NULO',
            lexema: ';',
            start: { line: 9, column: 21 },
            end: { line: 9, column: 21 }
          },
          {
            classe: 'leia',
            tipo: 'leia',
            lexema: 'leia',
            start: { line: -1, column: -1 },
            end: { line: -1, column: -1 }
          },
          {
            classe: 'ID',
            tipo: 'NULO',
            lexema: 'A',
            start: { line: 3, column: 12 },
            end: { line: 3, column: 12 }
          },
          {
            classe: 'PT_V',
            tipo: 'NULO',
            lexema: ';',
            start: { line: 10, column: 8 },
            end: { line: 10, column: 8 }
          },
          {
            classe: 'se',
            tipo: 'se',
            lexema: 'se',
            start: { line: -1, column: -1 },
            end: { line: -1, column: -1 }
          },
          {
            classe: 'AB_P',
            tipo: 'NULO',
            lexema: '(',
            start: { line: 11, column: 4 },
            end: { line: 11, column: 4 }
          },
          {
            classe: 'ID',
            tipo: 'NULO',
            lexema: 'B',
            start: { line: 4, column: 12 },
            end: { line: 4, column: 12 }
          },
          {
            classe: 'OPR',
            tipo: 'NULO',
            lexema: '>',
            start: { line: 11, column: 6 },
            end: { line: 11, column: 6 }
          },
          {
            classe: 'NUM',
            tipo: 'INTEIRO',
            lexema: '2',
            start: { line: 11, column: 7 },
            end: { line: 11, column: 7 }
          },
          {
            classe: 'FC_P',
            tipo: 'NULO',
            lexema: ')',
            start: { line: 11, column: 8 },
            end: { line: 11, column: 8 }
          },
          {
            classe: 'entao',
            tipo: 'entao',
            lexema: 'entao',
            start: { line: -1, column: -1 },
            end: { line: -1, column: -1 }
          },
          {
            classe: 'se',
            tipo: 'se',
            lexema: 'se',
            start: { line: -1, column: -1 },
            end: { line: -1, column: -1 }
          },
          {
            classe: 'AB_P',
            tipo: 'NULO',
            lexema: '(',
            start: { line: 13, column: 6 },
            end: { line: 13, column: 6 }
          },
          {
            classe: 'ID',
            tipo: 'NULO',
            lexema: 'B',
            start: { line: 4, column: 12 },
            end: { line: 4, column: 12 }
          },
          {
            classe: 'OPR',
            tipo: 'NULO',
            lexema: '<=',
            start: { line: 13, column: 8 },
            end: { line: 13, column: 9 }
          },
          {
            classe: 'NUM',
            tipo: 'INTEIRO',
            lexema: '4',
            start: { line: 13, column: 10 },
            end: { line: 13, column: 10 }
          },
          {
            classe: 'FC_P',
            tipo: 'NULO',
            lexema: ')',
            start: { line: 13, column: 11 },
            end: { line: 13, column: 11 }
          },
          {
            classe: 'entao',
            tipo: 'entao',
            lexema: 'entao',
            start: { line: -1, column: -1 },
            end: { line: -1, column: -1 }
          },
          {
            classe: 'escreva',
            tipo: 'escreva',
            lexema: 'escreva',
            start: { line: -1, column: -1 },
            end: { line: -1, column: -1 }
          },
          {
            classe: 'LIT',
            tipo: 'LITERAL',
            lexema: '"B esta entre 2 e 4"',
            start: { line: 15, column: 14 },
            end: { line: 15, column: 33 }
          },
          {
            classe: 'PT_V',
            tipo: 'NULO',
            lexema: ';',
            start: { line: 15, column: 34 },
            end: { line: 15, column: 34 }
          },
          {
            classe: 'fimse',
            tipo: 'fimse',
            lexema: 'fimse',
            start: { line: -1, column: -1 },
            end: { line: -1, column: -1 }
          },
          {
            classe: 'fimse',
            tipo: 'fimse',
            lexema: 'fimse',
            start: { line: -1, column: -1 },
            end: { line: -1, column: -1 }
          },
          {
            classe: 'ID',
            tipo: 'NULO',
            lexema: 'B',
            start: { line: 4, column: 12 },
            end: { line: 4, column: 12 }
          },
          {
            classe: 'ATR',
            tipo: 'NULO',
            lexema: '<-',
            start: { line: 18, column: 3 },
            end: { line: 18, column: 4 }
          },
          {
            classe: 'ID',
            tipo: 'NULO',
            lexema: 'B',
            start: { line: 4, column: 12 },
            end: { line: 4, column: 12 }
          },
          {
            classe: 'OPA',
            tipo: 'NULO',
            lexema: '+',
            start: { line: 18, column: 6 },
            end: { line: 18, column: 6 }
          },
          {
            classe: 'NUM',
            tipo: 'INTEIRO',
            lexema: '1',
            start: { line: 18, column: 7 },
            end: { line: 18, column: 7 }
          },
          {
            classe: 'PT_V',
            tipo: 'NULO',
            lexema: ';',
            start: { line: 18, column: 8 },
            end: { line: 18, column: 8 }
          },
          {
            classe: 'ID',
            tipo: 'NULO',
            lexema: 'B',
            start: { line: 4, column: 12 },
            end: { line: 4, column: 12 }
          },
          {
            classe: 'ATR',
            tipo: 'NULO',
            lexema: '<-',
            start: { line: 19, column: 3 },
            end: { line: 19, column: 4 }
          },
          {
            classe: 'ID',
            tipo: 'NULO',
            lexema: 'B',
            start: { line: 4, column: 12 },
            end: { line: 4, column: 12 }
          },
          {
            classe: 'OPA',
            tipo: 'NULO',
            lexema: '+',
            start: { line: 19, column: 6 },
            end: { line: 19, column: 6 }
          },
          {
            classe: 'NUM',
            tipo: 'INTEIRO',
            lexema: '2',
            start: { line: 19, column: 7 },
            end: { line: 19, column: 7 }
          },
          {
            classe: 'PT_V',
            tipo: 'NULO',
            lexema: ';',
            start: { line: 19, column: 8 },
            end: { line: 19, column: 8 }
          },
          {
            classe: 'ID',
            tipo: 'NULO',
            lexema: 'B',
            start: { line: 4, column: 12 },
            end: { line: 4, column: 12 }
          },
          {
            classe: 'ATR',
            tipo: 'NULO',
            lexema: '<-',
            start: { line: 20, column: 3 },
            end: { line: 20, column: 4 }
          },
          {
            classe: 'ID',
            tipo: 'NULO',
            lexema: 'B',
            start: { line: 4, column: 12 },
            end: { line: 4, column: 12 }
          },
          {
            classe: 'OPA',
            tipo: 'NULO',
            lexema: '+',
            start: { line: 20, column: 6 },
            end: { line: 20, column: 6 }
          },
          {
            classe: 'NUM',
            tipo: 'INTEIRO',
            lexema: '3',
            start: { line: 20, column: 7 },
            end: { line: 20, column: 7 }
          },
          {
            classe: 'PT_V',
            tipo: 'NULO',
            lexema: ';',
            start: { line: 20, column: 8 },
            end: { line: 20, column: 8 }
          },
          {
            classe: 'ID',
            tipo: 'NULO',
            lexema: 'D',
            start: { line: 4, column: 15 },
            end: { line: 4, column: 15 }
          },
          {
            classe: 'ATR',
            tipo: 'NULO',
            lexema: '<-',
            start: { line: 21, column: 3 },
            end: { line: 21, column: 4 }
          },
          {
            classe: 'ID',
            tipo: 'NULO',
            lexema: 'B',
            start: { line: 4, column: 12 },
            end: { line: 4, column: 12 }
          },
          {
            classe: 'PT_V',
            tipo: 'NULO',
            lexema: ';',
            start: { line: 21, column: 6 },
            end: { line: 21, column: 6 }
          },
          {
            classe: 'ID',
            tipo: 'NULO',
            lexema: 'C',
            start: { line: 5, column: 9 },
            end: { line: 5, column: 9 }
          },
          {
            classe: 'ATR',
            tipo: 'NULO',
            lexema: '<-',
            start: { line: 22, column: 3 },
            end: { line: 22, column: 4 }
          },
          {
            classe: 'NUM',
            tipo: 'REAL',
            lexema: '5.0',
            start: { line: 22, column: 5 },
            end: { line: 22, column: 7 }
          },
          {
            classe: 'PT_V',
            tipo: 'NULO',
            lexema: ';',
            start: { line: 22, column: 8 },
            end: { line: 22, column: 8 }
          },
          {
            classe: 'ID',
            tipo: 'NULO',
            lexema: 'E',
            start: { line: 4, column: 18 },
            end: { line: 4, column: 18 }
          },
          {
            classe: 'ATR',
            tipo: 'NULO',
            lexema: '<-',
            start: { line: 23, column: 3 },
            end: { line: 23, column: 4 }
          },
          {
            classe: 'ID',
            tipo: 'NULO',
            lexema: 'B',
            start: { line: 4, column: 12 },
            end: { line: 4, column: 12 }
          },
          {
            classe: 'OPA',
            tipo: 'NULO',
            lexema: '+',
            start: { line: 23, column: 6 },
            end: { line: 23, column: 6 }
          },
          {
            classe: 'NUM',
            tipo: 'INTEIRO',
            lexema: '2',
            start: { line: 23, column: 7 },
            end: { line: 23, column: 7 }
          },
          {
            classe: 'PT_V',
            tipo: 'NULO',
            lexema: ';',
            start: { line: 23, column: 8 },
            end: { line: 23, column: 8 }
          },
          {
            classe: 'escreva',
            tipo: 'escreva',
            lexema: 'escreva',
            start: { line: -1, column: -1 },
            end: { line: -1, column: -1 }
          },
          {
            classe: 'ID',
            tipo: 'NULO',
            lexema: 'C',
            start: { line: 5, column: 9 },
            end: { line: 5, column: 9 }
          },
          {
            classe: 'PT_V',
            tipo: 'NULO',
            lexema: ';',
            start: { line: 24, column: 11 },
            end: { line: 24, column: 11 }
          },
          {
            classe: 'ID',
            tipo: 'NULO',
            lexema: 'B',
            start: { line: 4, column: 12 },
            end: { line: 4, column: 12 }
          },
          {
            classe: 'ATR',
            tipo: 'NULO',
            lexema: '<-',
            start: { line: 25, column: 3 },
            end: { line: 25, column: 4 }
          },
          {
            classe: 'ID',
            tipo: 'NULO',
            lexema: 'B',
            start: { line: 4, column: 12 },
            end: { line: 4, column: 12 }
          },
          {
            classe: 'OPA',
            tipo: 'NULO',
            lexema: '+',
            start: { line: 25, column: 6 },
            end: { line: 25, column: 6 }
          },
          {
            classe: 'NUM',
            tipo: 'INTEIRO',
            lexema: '1',
            start: { line: 25, column: 7 },
            end: { line: 25, column: 7 }
          },
          {
            classe: 'PT_V',
            tipo: 'NULO',
            lexema: ';',
            start: { line: 25, column: 8 },
            end: { line: 25, column: 8 }
          },
          {
            classe: 'escreva',
            tipo: 'escreva',
            lexema: 'escreva',
            start: { line: -1, column: -1 },
            end: { line: -1, column: -1 }
          },
          {
            classe: 'LIT',
            tipo: 'LITERAL',
            lexema: '"\nB=\n"',
            start: { line: 26, column: 10 },
            end: { line: 28, column: 0 }
          },
          {
            classe: 'PT_V',
            tipo: 'NULO',
            lexema: ';',
            start: { line: 28, column: 1 },
            end: { line: 28, column: 1 }
          },
          {
            classe: 'escreva',
            tipo: 'escreva',
            lexema: 'escreva',
            start: { line: -1, column: -1 },
            end: { line: -1, column: -1 }
          },
          {
            classe: 'ID',
            tipo: 'NULO',
            lexema: 'D',
            start: { line: 4, column: 15 },
            end: { line: 4, column: 15 }
          },
          {
            classe: 'PT_V',
            tipo: 'NULO',
            lexema: ';',
            start: { line: 30, column: 11 },
            end: { line: 30, column: 11 }
          },
          {
            classe: 'escreva',
            tipo: 'escreva',
            lexema: 'escreva',
            start: { line: -1, column: -1 },
            end: { line: -1, column: -1 }
          },
          {
            classe: 'LIT',
            tipo: 'LITERAL',
            lexema: '"\n"',
            start: { line: 31, column: 10 },
            end: { line: 32, column: 0 }
          },
          {
            classe: 'PT_V',
            tipo: 'NULO',
            lexema: ';',
            start: { line: 32, column: 1 },
            end: { line: 32, column: 1 }
          },
          {
            classe: 'escreva',
            tipo: 'escreva',
            lexema: 'escreva',
            start: { line: -1, column: -1 },
            end: { line: -1, column: -1 }
          },
          {
            classe: 'ID',
            tipo: 'NULO',
            lexema: 'C',
            start: { line: 5, column: 9 },
            end: { line: 5, column: 9 }
          },
          {
            classe: 'PT_V',
            tipo: 'NULO',
            lexema: ';',
            start: { line: 33, column: 11 },
            end: { line: 33, column: 11 }
          },
          {
            classe: 'escreva',
            tipo: 'escreva',
            lexema: 'escreva',
            start: { line: -1, column: -1 },
            end: { line: -1, column: -1 }
          },
          {
            classe: 'LIT',
            tipo: 'LITERAL',
            lexema: '"\n"',
            start: { line: 34, column: 10 },
            end: { line: 35, column: 0 }
          },
          {
            classe: 'PT_V',
            tipo: 'NULO',
            lexema: ';',
            start: { line: 35, column: 1 },
            end: { line: 35, column: 1 }
          },
          {
            classe: 'escreva',
            tipo: 'escreva',
            lexema: 'escreva',
            start: { line: -1, column: -1 },
            end: { line: -1, column: -1 }
          },
          {
            classe: 'ID',
            tipo: 'NULO',
            lexema: 'A',
            start: { line: 3, column: 12 },
            end: { line: 3, column: 12 }
          },
          {
            classe: 'PT_V',
            tipo: 'NULO',
            lexema: ';',
            start: { line: 36, column: 11 },
            end: { line: 36, column: 11 }
          },
          {
            classe: 'fim',
            tipo: 'fim',
            lexema: 'fim',
            start: { line: -1, column: -1 },
            end: { line: -1, column: -1 }
          },
          {
            classe: 'EOF',
            tipo: 'NULO',
            lexema: 'EOF',
            start: { line: 37, column: 4 },
            end: { line: 37, column: 4 }
          }
        ]
      }
    ]
    testExamples(examples)
  })

  test("generate a error token with all chars that aren't in the alphabet", () => {
    const examples: Examples = [
      {
        source: '123 abc &@¨',
        expectedTokens: [
          {
            classe: 'NUM',
            lexema: '123',
            tipo: 'INTEIRO',
            start: { line: 1, column: 1 },
            end: { line: 1, column: 3 }
          },
          {
            classe: 'ID',
            lexema: 'abc',
            tipo: 'NULO',
            start: { line: 1, column: 5 },
            end: { line: 1, column: 7 }
          },
          {
            classe: 'ERROR',
            lexema: '&@¨',
            tipo: 'NULO',
            start: { line: 1, column: 9 },
            end: { line: 1, column: 11 },
            description: 'Erro caractere inválido, linha: 1 e coluna: 9'
          }
        ]
      }
    ]

    testExamples(examples)
  })
})
