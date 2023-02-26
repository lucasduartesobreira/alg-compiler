import { Reader } from '@/lexer/file'
import { Lexer } from '@/lexer/lexer'
import mock from 'mock-fs'
import { Parser } from './parser'
import { GRAMMAR_RULES } from './parsingTable'

type Example = {
  source: string
  expectedSequence: number[]
}

const testExample = (example: Example) => {
  const fileName = `file${Math.round(Math.random() * 100)}.alg`
  mock({
    'path/with/content': {
      [fileName]: example.source
    }
  })

  const reader = Reader(`path/with/content/${fileName}`)
  const lexer = Lexer(reader)
  try {
    const { rulesPrinted: rulesReduced } = Parser.parse(lexer)

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

  describe('Incorrect programs', () => {
    test('error before first reduction', () => {
      const example: Example = {
        source: 'inicio varinicio varfim fim',
        expectedSequence: [2, 31, 1]
      }

      testExample(example)
    })

    test('error recovery e008', () => {
      const example: Example = {
        source: 'inicio varinicio varfim , fim',
        expectedSequence: [4, 2, 31, 1]
      }

      testExample(example)
    })

    test('error recovery e013', () => {
      const example: Example = {
        source: 'inicio varinicio varfim , se (2<3) enta fimse fim',
        expectedSequence: [4, 2, 22, 22, 26, 25, 30, 24, 31, 23, 1]
      }

      testExample(example)
    })

    test('error recovery e014', () => {
      const example: Example = {
        source: 'inicio varinicio varfim , leia A , fim',
        expectedSequence: [4, 2, 12, 31, 11, 1]
      }

      testExample(example)
    })

    describe('error recovery e015', () => {
      test('e015 with lit', () => {
        const exampleWithLit: Example = {
          source: 'inicio varinicio varfim , escreva "Teste Literal" , fim',
          expectedSequence: [4, 2, 14, 13, 31, 11, 1]
        }

        testExample(exampleWithLit)
      })

      test('e015 with lit', () => {
        const exampleWithNum: Example = {
          source: 'inicio varinicio varfim , escreva 20, fim',
          expectedSequence: [4, 2, 15, 13, 31, 11, 1]
        }

        testExample(exampleWithNum)
      })

      test('e015 with lit', () => {
        const exampleWithId: Example = {
          source: 'inicio varinicio varfim , escreva A, fim',
          expectedSequence: [4, 2, 16, 13, 31, 11, 1]
        }

        testExample(exampleWithId)
      })
    })

    describe('error recovery e016', () => {
      test('e016 with solo id', () => {
        const exampleWithSoloId: Example = {
          source: 'inicio varinicio inteiro A, varfim; fim',
          expectedSequence: [8, 7, 5, 4, 3, 2, 31, 1]
        }

        testExample(exampleWithSoloId)
      })

      test('e016 with multiple ids', () => {
        const exampleWithMultipleIds: Example = {
          source: 'inicio varinicio inteiro A,B,C, varfim; fim',
          expectedSequence: [8, 7, 6, 6, 5, 4, 3, 2, 31, 1]
        }

        testExample(exampleWithMultipleIds)
      })

      test('e016 with multiple lines', () => {
        const exampleWithMultipleLines: Example = {
          source: 'inicio varinicio inteiro A,B, literal C; varfim; fim',
          expectedSequence: [8, 7, 6, 5, 10, 7, 5, 4, 3, 3, 2, 31, 1]
        }

        testExample(exampleWithMultipleLines)
      })

      test('e016 with multiple lines and variables', () => {
        const exampleWithMultipleLinesAndVariables: Example = {
          source:
            'inicio varinicio inteiro A,B,C, literal D; real E, varfim; fim',
          expectedSequence: [
            8, 7, 6, 6, 5, 10, 7, 5, 9, 7, 5, 4, 3, 3, 3, 2, 31, 1
          ]
        }

        testExample(exampleWithMultipleLinesAndVariables)
      })
    })
  })

  describe('error recovery e017', () => {
    test('e017 with id', () => {
      const example: Example = {
        source: 'inicio varinicio varfim, A <- B, fim',
        expectedSequence: [4, 2, 21, 20, 18, 31, 17, 1]
      }

      testExample(example)
    })

    test('e017 with num', () => {
      const example: Example = {
        source: 'inicio varinicio varfim, A <- 10, fim',
        expectedSequence: [4, 2, 22, 20, 18, 31, 17, 1]
      }

      testExample(example)
    })

    test('e017 with OPRD', () => {
      const exampleNumThenId: Example = {
        source: 'inicio varinicio varfim, A <- 10 + B, fim',
        expectedSequence: [4, 2, 22, 21, 19, 18, 31, 17, 1]
      }

      testExample(exampleNumThenId)

      const exampleWithIdThenNum: Example = {
        source: 'inicio varinicio varfim, A <- B + 10, fim',
        expectedSequence: [4, 2, 21, 22, 19, 18, 31, 17, 1]
      }

      testExample(exampleWithIdThenNum)

      const exampleWithIdAndId: Example = {
        source: 'inicio varinicio varfim, A <- B + B, fim',
        expectedSequence: [4, 2, 21, 21, 19, 18, 31, 17, 1]
      }

      testExample(exampleWithIdAndId)
    })
  })
})
