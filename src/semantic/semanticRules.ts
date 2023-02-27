import { TypeofToken } from '@/lexer/automata.types'
import { ReservedWords, SymbolTable, Token } from '@/lexer/lexer.types'
import { NonTerminals } from '@/parser/parser.types'
import {
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

const assignTypeFromLastNonTerminal = (nonTerminal: NonTerminals, offset = 1) =>
  verifyIdAlreadyDefined(
    offset,
    (ctx, node) => {
      if (node.classe !== 'ID') {
        throw 'Erro no semântico, tentando adicionar tipo fora de um identificador'
      }

      const { semanticStack } = ctx
      const lastTerminal = semanticStack.reduceRight<
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

      const newNode: Token = {
        ...node,
        classe: 'ID',
        tipo: lastTerminal.tipo
      }

      ctx.semanticStack[ctx.semanticStack.length - offset] = newNode

      ctx.symbolTable.set(node.lexema, newNode)

      return ctx
    },
    buildGenericSemanticalErrorHandler('variável já declarada')
  )

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
        end: currentNode.end
      }
    },
    lastOne
  )

  return newNode
}

const popFromStack = (amount: number) => (context: SemanticContext) => {
  return { ...context, semanticStack: context.semanticStack.slice(0, -amount) }
}

type VerifyIdBranches = (
  context: SemanticContext,
  node: Omit<Token, 'classe'> & {
    classe: NonTerminals | ReservedWords | TypeofToken
  }
) => SemanticContext
const verifyIdAlreadyDefined =
  (
    offset: number,
    caseFalse: VerifyIdBranches,
    caseTrue: VerifyIdBranches = (context) => context,
    caseNotId: VerifyIdBranches = () => {
      throw 'Erro no semântico, tentando utilizar identificador não presente na tabela de simbolos'
    }
  ) =>
  (context: SemanticContext) => {
    const { semanticStack } = context

    const id = semanticStack.at(-offset)

    if (!id) {
      throw 'Erro no semântico, pilha semantica extrapolada'
    }

    const idFromSymbolTable = context.symbolTable.get(id.lexema)

    if (!idFromSymbolTable) return caseNotId(context, id)

    if (idFromSymbolTable.tipo === 'NULO') {
      return caseFalse(context, id)
    }

    return caseTrue(context, { ...id, tipo: idFromSymbolTable.tipo })
  }

const createTempVariableName = (
  oprdOne: Omit<Token, 'classe'> & {
    classe: NonTerminals | ReservedWords | TypeofToken
  },
  lastX: number,
  symbolTable: SymbolTable
): { identifier: string; type: 'int' | 'double' | 'literal' } => {
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

  return { identifier: tempIdentifier, type: tempType }
}

const buildGenericSemanticalErrorHandler: (
  message: string
) => VerifyIdBranches = (message) => (ctx, node) => {
  console.log(createSemanticalErrorMessage(message, node))
  ctx.shouldCreateOBJ = false
  return ctx
}

const createSemanticalErrorMessage = (
  message: string,
  node: Omit<Token, 'classe'> & {
    classe: NonTerminals | ReservedWords | TypeofToken
  }
) =>
  `Erro Semântico: ${message}, linha: ${node.start.line}, coluna: ${node.start.column}`

const rules: SemanticRules = new Map([
  [4, buildExecutioner([makePrinter('\n\n\n', []), doReduction])],
  [
    6,
    buildExecutioner([
      assignTypeFromLastNonTerminal('L', 3),
      verifyIdAlreadyDefined(
        3,
        buildGenericSemanticalErrorHandler('variável já declarada'),
        (ctx, node) => {
          if (node.tipo.toLowerCase() === 'literal')
            return makePrinter('literal {3};\n', [[3, 'lexema']])(ctx)
          if (node.tipo.toLowerCase() === 'inteiro')
            return makePrinter('int {3};\n', [[3, 'lexema']])(ctx)
          if (node.tipo.toLowerCase() === 'real')
            return makePrinter('double {3};\n', [[3, 'lexema']])(ctx)

          throw 'Erro no semântico, atribuindo tipo impossível'
        }
      ),
      doReduction
    ])
  ],
  [
    7,
    buildExecutioner([
      assignTypeFromLastNonTerminal('TIPO'),
      makePrinter('{1};\n', [[1, 'lexema']]),
      doReduction
    ])
  ],
  [8, buildExecutioner([doReduction, makePrinter('int', [])])],
  [9, buildExecutioner([doReduction, makePrinter('double', [])])],
  [10, buildExecutioner([doReduction, makePrinter('{1}', [[1, 'tipo']])])],
  [
    12,
    buildExecutioner([
      verifyIdAlreadyDefined(
        2,
        buildGenericSemanticalErrorHandler('variável não declarada'),
        (ctx, node) => {
          if (node.tipo.toLowerCase() === 'literal') {
            return makePrinter('scanf("%s", {2});\n', [[2, 'lexema']])(ctx)
          } else if (node.tipo.toLowerCase() === 'inteiro') {
            return makePrinter('scanf("%d", &{2});\n', [[2, 'lexema']])(ctx)
          } else if (node.tipo.toLowerCase() === 'real') {
            return makePrinter('scanf("%lf", &{2});\n', [[2, 'lexema']])(ctx)
          }

          throw 'Erro no semântico, identificador com tipo impossível'
        }
      ),
      doReduction
    ])
  ],
  [
    13,
    buildExecutioner([
      verifyIdAlreadyDefined(
        2,
        (ctx, node) => {
          if (node.tipo.toLowerCase() === 'literal') {
            return makePrinter('printf({2});\n', [[2, 'lexema']])(ctx)
          } else {
            return makePrinter('printf("{2}");\n', [[2, 'lexema']])(ctx)
          }
        },
        (ctx, node) => {
          if (node.tipo.toLowerCase() === 'literal') {
            return makePrinter('printf("%s", {2});\n', [[2, 'lexema']])(ctx)
          } else if (node.tipo.toLowerCase() === 'inteiro') {
            return makePrinter('printf("%d", &{2});\n', [[2, 'lexema']])(ctx)
          } else if (node.tipo.toLowerCase() === 'real') {
            return makePrinter('printf("%lf", &{2});\n', [[2, 'lexema']])(ctx)
          } else {
            return ctx
          }
        },
        (ctx, node) => {
          if (node.tipo.toLowerCase() === 'literal') {
            return makePrinter('printf({2});\n', [[2, 'lexema']])(ctx)
          } else {
            return makePrinter('printf("{2}");\n', [[2, 'lexema']])(ctx)
          }
        }
      ),
      doReduction
    ])
  ],
  [
    16,
    buildExecutioner([
      verifyIdAlreadyDefined(
        1,
        buildGenericSemanticalErrorHandler('variável não declarada')
      ),
      doReduction
    ])
  ],
  [
    18,
    buildExecutioner([
      verifyIdAlreadyDefined(
        4,
        buildGenericSemanticalErrorHandler('variável não declarada'),
        (ctx, node) => {
          const { semanticStack } = ctx
          const ld = semanticStack.at(-2)

          if (!ld) throw 'Erro no semântico, pilha semantica extrapolada'

          if (ld.tipo.toLowerCase() !== node.tipo.toLowerCase()) {
            buildGenericSemanticalErrorHandler(
              'tipos diferentes para atribuição'
            )(ctx, node)
          }

          return makePrinter('{4} = {2};\n', [
            [4, 'lexema'],
            [2, 'lexema']
          ])(ctx)
        }
      ),
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
        ) {
          return buildGenericSemanticalErrorHandler(
            'Operandos com tipos incompativeis'
          )(context, oprdOne)
        }

        const tempVariable = createTempVariableName(oprdOne, lastX, symbolTable)
        context.temporaryVariables.set(lastX, tempVariable)

        return makePrinter(`${tempVariable.identifier} = {3} {2} {1};\n`, [
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
      verifyIdAlreadyDefined(
        1,
        buildGenericSemanticalErrorHandler('variável não declarada')
      ),
      doReduction
    ])
  ],
  [24, buildExecutioner([makePrinter('}\n', []), doReduction])],
  [
    25,
    buildExecutioner([
      makePrinter('if ({3}) {\n', [[3, 'lexema']]),
      doReduction
    ])
  ],
  [
    26,
    buildExecutioner([
      (context) => {
        const { semanticStack, lastX, symbolTable } = context

        const oprdOne = semanticStack.at(-3)
        const opr = semanticStack.at(-2)
        const oprdTwo = semanticStack.at(-1)

        if (!oprdOne || !oprdTwo || !opr)
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
        ) {
          return buildGenericSemanticalErrorHandler(
            'Operandos com tipos incompatíveis'
          )(context, oprdOne)
        }

        const tempVariable = createTempVariableName(oprdOne, lastX, symbolTable)
        context.temporaryVariables.set(lastX, tempVariable)

        return makePrinter(
          `${tempVariable.identifier} = {3} ${
            opr.lexema === '<>' ? '==' : opr.lexema
          } {1};\n`,
          [
            [3, 'lexema'],
            [1, 'lexema']
          ]
        )(context)
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

export { SemanticAnalyzer, doReduction }
