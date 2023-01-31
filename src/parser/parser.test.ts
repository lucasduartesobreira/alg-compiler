import { Reader } from '@/lexer/file'
import { Lexer } from '@/lexer/lexer'
import { Token } from '@/lexer/lexer.types'
import mock from 'mock-fs'
import { Parser } from './parser'
import { GRAMMAR_RULES } from './parsingTable'

type Example = {
  source: string
  expectedSequence: number[]
}

const testExample = (example: Example) => {
  mock({
    'path/with/content': {
      'file.alg': example.source
    }
  })

  const reader = Reader('path/with/content/file.alg')
  const lexer = Lexer(reader)
  try {
    const rulesReduced = Parser.parse(lexer)

    for (
      let reductionNumber = 0;
      reductionNumber < rulesReduced.length;
      reductionNumber++
    ) {
      const ruleNumber = example.expectedSequence[reductionNumber]
      const fullRule = GRAMMAR_RULES.get(ruleNumber)
      expect(fullRule).toBe(rulesReduced.at(reductionNumber))
    }

    mock.restore()
  } catch (e: any) {
    console.log(e)
  }
}

describe('Test parsing', () => {
  describe('Correct programs', () => {
    test('Test code from lexer', () => {
      const example: Example = {
        source: `inicio
varinicio
literal A;
inteiro B, D;
real C;
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
escreva "\nB=\n";
escreva D;
escreva "\n";
escreva C;
escreva "\n";
escreva A;
fim`,
        expectedSequence: [
          10, 7, 5, 8, 7, 6, 5, 9, 7, 5, 4, 3, 3, 3, 2, 14, 13, 12, 14, 13, 12,
          21, 22, 26, 25, 21, 22, 26, 25, 14, 13, 30, 27, 24, 30, 29, 24, 21,
          22, 19, 18, 21, 22, 19, 18, 21, 22, 19, 18, 21, 20, 18, 22, 20, 18,
          14, 13, 16, 13, 14, 13, 16, 13, 14, 13, 16, 13, 31, 11, 11, 11, 11,
          11, 11, 17, 17, 17, 17, 17, 23, 11, 11, 11, 11, 1
        ]
      }

      testExample(example)
    })
  })
})
