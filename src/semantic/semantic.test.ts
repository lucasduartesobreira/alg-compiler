import { Reader } from '@/lexer/file'
import { Lexer } from '@/lexer/lexer'
import mock from 'mock-fs'
import { Parser } from '@/parser/parser'

type Example = {
  source: string
  expectedShouldCreateOBJ: boolean
  expectedSequence?: string[]
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
    const { object } = Parser.parse(lexer)

    const { textObject, shouldCreateOBJ } = object

    expect(shouldCreateOBJ).toBe(example.expectedShouldCreateOBJ)

    if (shouldCreateOBJ) {
      const splittedResult = textObject
        .split(/\s/)
        .filter((value) => value !== '')

      console.log(textObject)
      expect(splittedResult).toStrictEqual(example.expectedSequence)
    }

    mock.restore()
  } catch (e: any) {
    console.log(e)
  }
}

describe('Testing Semantic Analyzer', () => {
  describe('Ok Tests', () => {
    test('test just one literal', () => {
      const example: Example = {
        source: 'inicio varinicio literal A; varfim; fim',
        expectedSequence: [
          '#include<stdio.h>',
          'typedef',
          'char',
          'literal[256];',
          'void',
          'main(void)',
          '{',
          'literal',
          'A;',
          '}'
        ],
        expectedShouldCreateOBJ: true
      }

      testExample(example)
    })

    test('test just multiple variables', () => {
      const example: Example = {
        source:
          'inicio varinicio literal A, B; inteiro E, D, C; real I, H, G, F; varfim; fim',
        expectedSequence: [
          '#include<stdio.h>',
          'typedef',
          'char',
          'literal[256];',
          'void',
          'main(void)',
          '{',
          'literal',
          'A,B;',
          'int',
          'E,D,C;',
          'double',
          'I,H,G,F;',
          '}'
        ],
        expectedShouldCreateOBJ: true
      }

      testExample(example)
    })

    test('test just read to id', () => {
      const example: Example = {
        source: 'inicio varinicio literal A; varfim; leia A; fim',
        expectedSequence: [
          '#include<stdio.h>',
          'typedef',
          'char',
          'literal[256];',
          'void',
          'main(void)',
          '{',
          'literal',
          'A;',
          'scanf("%s",',
          'A);',
          '}'
        ],
        expectedShouldCreateOBJ: true
      }

      testExample(example)
    })

    test('test just read to id and print it', () => {
      const example: Example = {
        source: 'inicio varinicio literal A; varfim; leia A; escreva A; fim',
        expectedSequence: [
          '#include<stdio.h>',
          'typedef',
          'char',
          'literal[256];',
          'void',
          'main(void)',
          '{',
          'literal',
          'A;',
          'scanf("%s",',
          'A);',
          'printf("%s",',
          'A);',
          '}'
        ],
        expectedShouldCreateOBJ: true
      }

      testExample(example)
    })

    test('test just read and print multiple ids', () => {
      const example: Example = {
        source:
          'inicio varinicio literal A, B; inteiro C, D; real E, F; varfim; leia A; escreva A; leia B; escreva B; leia C; escreva C; leia D; escreva D; leia E; escreva E; leia F; escreva F;fim',
        expectedSequence: [
          '#include<stdio.h>',
          'typedef',
          'char',
          'literal[256];',
          'void',
          'main(void)',
          '{',
          'literal',
          'A,B;',
          'int',
          'C,D;',
          'double',
          'E,F;',
          'scanf("%s",',
          'A);',
          'printf("%s",',
          'A);',
          'scanf("%s",',
          'B);',
          'printf("%s",',
          'B);',
          'scanf("%d",',
          '&C);',
          'printf("%d",',
          '&C);',
          'scanf("%d",',
          '&D);',
          'printf("%d",',
          '&D);',
          'scanf("%lf",',
          '&E);',
          'printf("%lf",',
          '&E);',
          'scanf("%lf",',
          '&F);',
          'printf("%lf",',
          '&F);',
          '}'
        ],
        expectedShouldCreateOBJ: true
      }

      testExample(example)
    })

    test('test just printing constants', () => {
      const example: Example = {
        source:
          'inicio varinicio varfim; escreva "É um literal"; escreva 1234; fim',
        expectedSequence: [
          '#include<stdio.h>',
          'typedef',
          'char',
          'literal[256];',
          'void',
          'main(void)',
          '{',
          'printf("É',
          'um',
          'literal");',
          'printf("1234");',
          '}'
        ],
        expectedShouldCreateOBJ: true
      }

      testExample(example)
    })

    test('test mix read and printing ids ands constants', () => {
      const example: Example = {
        source:
          'inicio varinicio literal A; varfim; escreva "É um literal"; escreva 1234; leia A; escreva A;fim',
        expectedSequence: [
          '#include<stdio.h>',
          'typedef',
          'char',
          'literal[256];',
          'void',
          'main(void)',
          '{',
          'literal',
          'A;',
          'printf("É',
          'um',
          'literal");',
          'printf("1234");',
          'scanf("%s",',
          'A);',
          'printf("%s",',
          'A);',
          '}'
        ],
        expectedShouldCreateOBJ: true
      }

      testExample(example)
    })

    test('test conditionals', () => {
      const example: Example = {
        source:
          'inicio varinicio inteiro A; varfim; escreva "É um literal"; escreva 1234; leia A; escreva A; se (A<= 5) entao escreva "Literal aqui"; se (A > 2) entao escreva "Outro literal"; fimse fimse fim',
        expectedSequence: [
          '#include<stdio.h>',
          'typedef',
          'char',
          'literal[256];',
          'void',
          'main(void)',
          '{',
          'int',
          't0;',
          'int',
          't1;',
          'int',
          'A;',
          'printf("É',
          'um',
          'literal");',
          'printf("1234");',
          'scanf("%d",',
          '&A);',
          'printf("%d",',
          '&A);',
          't0',
          '=',
          'A',
          '<=',
          '5;',
          'if',
          '(t0)',
          '{',
          'printf("Literal',
          'aqui");',
          't1',
          '=',
          'A',
          '>',
          '2;',
          'if',
          '(t1)',
          '{',
          'printf("Outro',
          'literal");',
          '}',
          '}',
          '}'
        ],
        expectedShouldCreateOBJ: true
      }

      testExample(example)
    })

    test('test binding', () => {
      const example: Example = {
        source:
          'inicio varinicio inteiro A; inteiro B; varfim; leia A; B <- A + 1; A <- B; fim',
        expectedSequence: [
          '#include<stdio.h>',
          'typedef',
          'char',
          'literal[256];',
          'void',
          'main(void)',
          '{',
          'int',
          't0;',
          'int',
          'A;',
          'int',
          'B;',
          'scanf("%d",',
          '&A);',
          't0',
          '=',
          'A',
          '+',
          '1;',
          'B',
          '=',
          't0;',
          'A',
          '=',
          'B;',
          '}'
        ],
        expectedShouldCreateOBJ: true
      }

      testExample(example)
    })

    test('testing over example file', () => {
      const example: Example = {
        source: `inicio
  varinicio
    literal A;
    inteiro B,D;
    real C ;
  varfim;
  escreva "Digite B";
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
  escreva "\\nB=\\n";
  escreva D;
  escreva "\n";
  escreva C;
  escreva "\n";
  escreva A;
fim`,
        expectedSequence: [
          '#include<stdio.h>',
          'typedef',
          'char',
          'literal[256];',
          'void',
          'main(void)',
          '{',
          'int',
          't0;',
          'int',
          't1;',
          'int',
          't2;',
          'int',
          't3;',
          'int',
          't4;',
          'literal',
          'A;',
          'int',
          'B,D;',
          'double',
          'C;',
          'printf("Digite',
          'B");',
          'scanf("%d",',
          '&B);',
          'printf("Digite',
          'A:");',
          'scanf("%s",',
          'A);',
          't0',
          '=',
          'B',
          '>',
          '2;',
          'if',
          '(t0)',
          '{',
          't1',
          '=',
          'B',
          '<=',
          '4;',
          'if',
          '(t1)',
          '{',
          'printf("B',
          'esta',
          'entre',
          '2',
          'e',
          '4");',
          '}',
          '}',
          't2',
          '=',
          'B',
          '+',
          '1;',
          'B',
          '=',
          't2;',
          't3',
          '=',
          'B',
          '+',
          '2;',
          'B',
          '=',
          't3;',
          't4',
          '=',
          'B',
          '+',
          '3;',
          'B',
          '=',
          't4;',
          'D',
          '=',
          'B;',
          'C',
          '=',
          '5.0;',
          'printf("',
          'B=',
          '");',
          'printf("%d",',
          '&D);',
          'printf("',
          '");',
          'printf("%lf",',
          '&C);',
          'printf("',
          '");',
          'printf("%s",',
          'A);',
          '}'
        ],
        expectedShouldCreateOBJ: true
      }

      testExample(example)
    })
  })

  describe('Test errors', () => {
    test('Test create already created variable', () => {
      const example: Example = {
        source: 'inicio varinicio literal A; inteiro A; varfim; fim',
        expectedSequence: ['literal', 'A;', 'int', 'A;'],
        expectedShouldCreateOBJ: false
      }

      testExample(example)
    })

    test('Test use uncreated variable', () => {
      const example: Example = {
        source: 'inicio varinicio varfim; leia A; escreva A; fim',
        expectedSequence: [],
        expectedShouldCreateOBJ: false
      }

      testExample(example)
    })
  })
})
