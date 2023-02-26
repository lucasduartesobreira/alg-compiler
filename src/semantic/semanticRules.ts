import { TypeofToken } from '@/lexer/automata.types'
import { ReservedWords, Token } from '@/lexer/lexer.types'
import { NonTerminals } from 'src/parser/parser.types'
import {
  Executioner,
  RuleIndex,
  SemanticContext,
  SemanticRules
} from './semanticRules.types'

const makePrinter =
  (format: string, indexes: [number, 'tipo' | 'lexema'][]) =>
  (context: SemanticContext) => {
    const { semanticStack } = context
    const formatted = indexes.reduce((msg, offsetAndData) => {
      const a = semanticStack.at(-offsetAndData[0])

      if (!a) return msg
      return msg.replace(`{${offsetAndData[0]}}`, a[offsetAndData[1]])
    }, format)

    context.textObject += ' ' + formatted

    return context
  }

const assignTypeFromLastNonTerminal =
  (nonTerminal: NonTerminals, offset = 1) =>
  (context: SemanticContext) => {
    if (context.semanticStack.length === 0)
      throw `Error no semântico, utilizando pilha vazia`

    const lastTerminal = context.semanticStack.reduceRight<
      | (Omit<Token, 'classe'> & {
          classe: TypeofToken | ReservedWords | NonTerminals
        })
      | undefined
    >(
      (acc, value) =>
        value.classe.toUpperCase() === nonTerminal ? value : acc,
      undefined
    )

    if (!lastTerminal)
      throw `Error no semântico: não foi possivel encontrar o não terminal ${nonTerminal} na pilha`

    const poppedFromStack = context.semanticStack.at(-offset)

    if (!poppedFromStack) throw `Error no semântico, utilizando pilha vazia`

    if (poppedFromStack.classe !== 'ID')
      throw 'Erro no semântico, tentando adicionar tipo fora de um identificador'

    const idFromSymbolTable = context.symbolTable.get(poppedFromStack.lexema)

    if (!idFromSymbolTable)
      throw 'Erro no semântico, tentando adicionar tipo ao um token que não está na tabela de simbolos'

    if (idFromSymbolTable.tipo !== 'NULO') {
      console.log('Erro Semântico: variável já declarada')
      context.shouldCreateOBJ = false
      return context
    }

    poppedFromStack.tipo = lastTerminal.tipo
    context.semanticStack[context.semanticStack.length - offset] =
      poppedFromStack

    context.symbolTable.set(poppedFromStack.lexema, {
      ...poppedFromStack,
      classe: 'ID'
    })

    return context
  }

const buildNewNonTerminalNode = (context: SemanticContext) => {
  const { amountToPopFromStack, ruleSymbol } = context
  const newTokenWithFullLexema = joinLexemas(amountToPopFromStack)(context)
  const newTokenWithFixedClass = {
    ...newTokenWithFullLexema,
    classe: ruleSymbol
  }

  return newTokenWithFixedClass
}

const doReduction = (context: SemanticContext) => {
  const { amountToPopFromStack } = context
  const newNode = buildNewNonTerminalNode(context)
  const newContext = popFromStack(amountToPopFromStack)(context)
  newContext.semanticStack.push(newNode)

  return newContext
}

const buildExecutioner =
  (listOfOperations?: Array<(context: SemanticContext) => SemanticContext>) =>
  (context: SemanticContext) => {
    if (!listOfOperations?.length) {
      return doReduction(context)
    }

    return listOfOperations.reduce(
      (prevContext, operation) => operation(prevContext),
      context
    )
  }

const joinLexemas = (amount: number) => (context: SemanticContext) => {
  const lastOne = context.semanticStack.at(-amount)

  if (!lastOne) throw 'Erro no semântico, pilha semantica vazia'

  const newNode = Array.from(Array(amount - 1).keys()).reduceRight(
    (newItem, currentValue) => {
      const currentNode = context.semanticStack.at(-1 - currentValue)

      if (!currentNode) throw 'Erro no semântico, pilha semantica extrapolada'
      return {
        ...newItem,
        lexema: newItem.lexema + currentNode.lexema,
        tipo: currentNode.tipo,
        start: currentNode.start
      }
    },
    lastOne
  )

  return newNode
}

const popFromStack = (amount: number) => (context: SemanticContext) => {
  return { ...context, semanticStack: context.semanticStack.slice(0, -amount) }
}

const verifyIdAlreadyDefined =
  (
    offset: number,
    caseFalse: Executioner,
    caseTrue: Executioner = (context) => context
  ) =>
  (context: SemanticContext) => {
    const { semanticStack } = context

    const id = semanticStack.at(-offset)

    if (!id) {
      throw 'Erro no semântico, pilha semantica extrapolada'
    }

    const idFromSymbolTable = context.symbolTable.get(id.lexema)

    if (!idFromSymbolTable)
      throw 'Erro no semântico, tentando utilizar identificador que não presente na tabela de simbolos'

    if (idFromSymbolTable.tipo === 'NULO') {
      return caseFalse(context)
    }

    return caseTrue(context)
  }

const rules: SemanticRules = new Map([
  [4, buildExecutioner([makePrinter('\n\n\n', []), doReduction])],
  [5, buildExecutioner([makePrinter(' {2};\n', [[2, 'lexema']]), doReduction])],
  [6, buildExecutioner([assignTypeFromLastNonTerminal('L', 3), doReduction])],
  [7, buildExecutioner([assignTypeFromLastNonTerminal('TIPO'), doReduction])],
  [8, buildExecutioner([doReduction, makePrinter('int', [])])],
  [9, buildExecutioner([doReduction, makePrinter('double', [])])],
  [10, buildExecutioner([doReduction, makePrinter('{1}', [[1, 'tipo']])])],
  [
    12,
    buildExecutioner([
      (context) => {
        const { semanticStack } = context

        const id = semanticStack.at(-2)

        if (!id) {
          throw 'Erro no semântico, pilha semantica extrapolada'
        }

        const idFromSymbolTable = context.symbolTable.get(id.lexema)

        if (!idFromSymbolTable)
          throw 'Erro no semântico, tentando utilizar identificador que não presente na tabela de simbolos'

        if (idFromSymbolTable.tipo === 'NULO') {
          console.log(
            `Erro Semântico: variável não declarada, linha: ${id.start.line}, coluna: ${id.start.column}`
          )
          context.shouldCreateOBJ = false
          return context
        }

        if (id.tipo.toLowerCase() === 'literal') {
          return makePrinter('scanf("%s", {2});\n', [[2, 'lexema']])(context)
        } else if (id.tipo.toLowerCase() === 'inteiro') {
          return makePrinter('scanf("%d", &{2});\n', [[2, 'lexema']])(context)
        } else if (id.tipo.toLowerCase() === 'real') {
          return makePrinter('scanf("%lf", &{2});\n', [[2, 'lexema']])(context)
        }

        throw 'Erro no semântico, identificador com tipo impossível'
      },
      doReduction
    ])
  ],
  [
    13,
    buildExecutioner([
      (context) => {
        const { semanticStack } = context

        const arg = semanticStack.at(-2)

        if (!arg) throw 'Erro no semântico, pilha semantica extrapolada'

        const idFromSymbolTable = context.symbolTable.get(arg.lexema)

        if (!idFromSymbolTable) {
          if (arg.tipo.toLowerCase() === 'literal') {
            return makePrinter('printf({2});\n', [[2, 'lexema']])(context)
          } else {
            return makePrinter('printf("{2}");\n', [[2, 'lexema']])(context)
          }
        }

        if (idFromSymbolTable.tipo.toLowerCase() === 'literal') {
          return makePrinter('printf("%s", {2});\n', [[2, 'lexema']])(context)
        } else if (idFromSymbolTable.tipo.toLowerCase() === 'inteiro') {
          return makePrinter('printf("%d", &{2});\n', [[2, 'lexema']])(context)
        } else if (idFromSymbolTable.tipo.toLowerCase() === 'real') {
          return makePrinter('printf("%lf", &{2});\n', [[2, 'lexema']])(context)
        } else {
          return context
        }
      },
      doReduction
    ])
  ],
  [
    16,
    buildExecutioner([
      (context) => {
        const { semanticStack, symbolTable } = context

        const arg = semanticStack.at(-1)

        if (!arg) throw 'Erro no semântico, pilha semantica extrapolada'

        const idFromSymbolTable = symbolTable.get(arg.lexema)

        if (!idFromSymbolTable)
          throw 'Erro no semântico, tentando utilizar identificador que não presente na tabela de simbolos'

        if (idFromSymbolTable.tipo.toUpperCase() === 'NULO') {
          console.log(
            `Erro Semântico: variável não declarada, linha: ${arg.start.line}, coluna: ${arg.start.column}`
          )
        }

        return context
      },
      doReduction
    ])
  ],
  [
    18,
    buildExecutioner([
      (context) => {
        const { semanticStack, symbolTable } = context

        const id = semanticStack.at(-4)

        if (!id) throw 'Erro no semântico, pilha semantica extrapolada'

        const idFromSymbolTable = symbolTable.get(id.lexema)

        if (!idFromSymbolTable)
          throw 'Erro no semântico, tentando utilizar identificador que não presente na tabela de simbolos'

        if (idFromSymbolTable.tipo === 'NULO')
          console.log(
            `Erro Semântico: variável não declarada, linha: ${id.start.line}, coluna: ${id.start.column}`
          )

        const ld = semanticStack.at(-2)

        if (!ld) throw 'Erro no semântico, pilha semantica extrapolada'

        if (ld.tipo.toLowerCase() !== id.tipo.toLowerCase())
          throw `Erro Semântico: tipos diferentes para atribuição, linha: ${id.start.line}, coluna: ${id.start.column}`

        return makePrinter('{4} = {2};\n', [
          [4, 'lexema'],
          [2, 'lexema']
        ])(context)
      },
      doReduction
    ])
  ],
  [
    19,
    buildExecutioner([
      (context) => {
        const { semanticStack, lastX, symbolTable } = context

        const oprdOne = semanticStack.at(-3)
        const oprdTwo = semanticStack.at(-1)

        if (!oprdOne || !oprdTwo)
          throw 'Erro no semântico, pilha semantica extrapolada'

        if (
          oprdOne.tipo.toLowerCase() !== oprdTwo.tipo.toLowerCase() ||
          oprdOne.tipo.toLowerCase() === 'literal' ||
          oprdTwo.tipo.toLowerCase() === 'literal'
        )
          throw `Erro Semântico: Operandos incompativeis, linha: ${oprdOne.start.line}, coluna: ${oprdOne.start.column}`

        const numberOfTs = ['t']

        while (symbolTable.has(`${numberOfTs.join('')}${lastX}`)) {
          numberOfTs.push('t')
        }

        const tempIdentifier = `${numberOfTs.join('')}${lastX}`
        const tempType =
          oprdOne.tipo.toLowerCase() === 'inteiro'
            ? 'int'
            : oprdOne.tipo.toLowerCase() === 'real'
            ? 'double'
            : 'literal'

        context.temporaryVariables.set(lastX, {
          identifier: tempIdentifier,
          type: tempType
        })

        return makePrinter(`${numberOfTs.join('')}${lastX} = {3} {2} {1};\n`, [
          [3, 'lexema'],
          [2, 'lexema'],
          [1, 'lexema']
        ])(context)
      },
      doReduction,
      (context) => {
        const { semanticStack, temporaryVariables, lastX } = context

        const newLexema = temporaryVariables.get(lastX)

        context.semanticStack[semanticStack.length - 1] = {
          ...semanticStack[semanticStack.length - 1],
          lexema: newLexema?.identifier ?? `t${context.lastX}`
        }

        context.lastX += 1

        return context
      }
    ])
  ],
  [
    21,
    buildExecutioner([
      (context) => {
        const { semanticStack, symbolTable } = context

        const id = semanticStack.at(-1)

        if (!id) throw 'Erro no semântico, pilha semantica extrapolada'

        const idFromSymbolTable = symbolTable.get(id.lexema)

        if (!idFromSymbolTable)
          throw 'Erro no semântico, tentando utilizar identificador que não presente na tabela de simbolos'

        if (idFromSymbolTable.tipo === 'NULO')
          console.log(
            `Erro Semântico: variável não declarada, linha: ${id.start.line}, coluna: ${id.start.column}`
          )

        semanticStack[semanticStack.length - 1] = {
          ...id,
          tipo: idFromSymbolTable.tipo
        }

        return { ...context, semanticStack }
      },
      doReduction
    ])
  ],
  [24, buildExecutioner([makePrinter('}\n', []), doReduction])],
  [25, buildExecutioner([makePrinter('if ({3}) {\n', [[3, 'lexema']])])],
  [
    26,
    buildExecutioner([
      (context) => {
        const { semanticStack, lastX, symbolTable } = context

        const oprdOne = semanticStack.at(-3)
        const oprdTwo = semanticStack.at(-1)

        if (!oprdOne || !oprdTwo)
          throw 'Erro no semântico, pilha semantica extrapolada'

        const oprdOneAndOprdTwo = [
          oprdOne.tipo.toLowerCase(),
          oprdTwo.tipo.toLowerCase()
        ] as const

        if (
          // TODO: Verify if we'll allow literal and literal
          oprdOneAndOprdTwo.every(
            (value, index) => value === ['literal', 'inteiro'][index]
          ) ||
          oprdOneAndOprdTwo.every(
            (value, index) => value === ['inteiro', 'literal'][index]
          ) ||
          oprdOneAndOprdTwo.every(
            (value, index) => value === ['literal', 'real'][index]
          ) ||
          oprdOneAndOprdTwo.every(
            (value, index) => value === ['real', 'literal'][index]
          )
        )
          throw `Erro Semântico: Operandos incompativeis, linha: ${oprdOne.start.line}, coluna: ${oprdOne.start.column}`

        const numberOfTs = ['t']

        while (symbolTable.has(`${numberOfTs.join('')}${lastX}`)) {
          numberOfTs.push('t')
        }

        const tempIdentifier = `${numberOfTs.join('')}${lastX}`
        const tempType =
          oprdOne.tipo.toLowerCase() === 'inteiro'
            ? 'int'
            : oprdOne.tipo.toLowerCase() === 'real'
            ? 'double'
            : 'literal'

        context.temporaryVariables.set(lastX, {
          identifier: tempIdentifier,
          type: tempType
        })

        return makePrinter(`${numberOfTs.join('')}${lastX} = {3} {2} {1};\n`, [
          [3, 'lexema'],
          [2, 'lexema'],
          [1, 'lexema']
        ])(context)
      },
      doReduction,
      (context) => {
        const { semanticStack, temporaryVariables, lastX } = context

        const newLexema = temporaryVariables.get(lastX)

        context.semanticStack[semanticStack.length - 1] = {
          ...semanticStack[semanticStack.length - 1],
          lexema: newLexema?.identifier ?? `t${context.lastX}`
        }

        context.lastX += 1

        return context
      }
    ])
  ]
])

const SemanticAnalyzer = {
  analyze(rule: RuleIndex, context: SemanticContext): SemanticContext {
    const ruleExecuter = rules.get(rule)

    const newContext = ruleExecuter
      ? ruleExecuter(context)
      : buildExecutioner()(context)

    return newContext
  }
}

export { SemanticAnalyzer }
