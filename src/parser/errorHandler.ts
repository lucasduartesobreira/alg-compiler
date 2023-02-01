import { Token } from '@/lexer/lexer.types'
import {
  ErrorContext,
  ErrorHandler,
  ErrorData,
  ErrorTable,
  ParsingContext,
  UpdatedParsingContext
} from './errorHandler.types'
import { NonTerminals } from './parser.types'
import {
  FOLLOW_TABLE,
  GOTO_TABLE,
  GRAMMAR_RULES,
  POP_AMOUNT_PER_RULE,
  RULE_LETTER
} from './parsingTable'

const panicSync: Array<NonTerminals> = [
  "P'",
  'P',
  'V',
  'LV',
  'D',
  'A',
  'ES',
  'CMD',
  'COND'
]

const panicHandler = (context: ErrorContext) => {
  const { stack, a, lexer, rulesPrinted } = context
  let newA = a

  while (stack.length > 0) {
    const poppedStack = stack.pop()

    if (!poppedStack) throw 'Erro pilha vazia no panic handler'

    const stateGotoTable = GOTO_TABLE.get(poppedStack)

    if (!stateGotoTable) {
      continue
    }

    const gotoSyncRule = panicSync.find((value) => stateGotoTable.has(value))

    if (gotoSyncRule) {
      stack.push(poppedStack)
      do {
        if (FOLLOW_TABLE.get(gotoSyncRule)?.has(newA.classe)) {
          stack.push(stateGotoTable.get(gotoSyncRule) as number)
          return { stack, a: newA, rulesPrinted }
        }
        newA = lexer.scanner()
      } while (newA.classe !== 'EOF')

      throw `Erro: chegou ao final do arquivo e não foi possível terminar a recuperação do erro ${context.error}`
    }
  }
  throw 'Erro pilha vazia no panic handler'
}

const createPhraseHandler =
  (listOfActions: Array<(context: ErrorContext) => ParsingContext>) =>
  (context: ErrorContext): UpdatedParsingContext => {
    const { stack, a, rulesPrinted } = listOfActions.reduce((ctx, action) => {
      const newParsingContext = action(ctx)
      return {
        ...newParsingContext,
        error: context.error
      }
    }, context)

    return {
      stack,
      a,
      rulesPrinted
    }
  }

const makeAReduce =
  (identifier: number, replaceA?: Pick<Token, 'classe' | 'lexema' | 'tipo'>) =>
  (context: ErrorContext) => {
    let { stack } = context
    const { rulesPrinted } = context

    const amountToPop = POP_AMOUNT_PER_RULE.get(identifier) as number
    stack = stack.slice(0, -amountToPop)

    const t = stack.at(-1) as number

    const ruleSymbol = RULE_LETTER.get(identifier) as NonTerminals
    stack.push(GOTO_TABLE.get(t)?.get(ruleSymbol) as number)

    const fullRuleText = GRAMMAR_RULES.get(identifier) as string
    console.log(fullRuleText)
    rulesPrinted.push(fullRuleText)

    const newA = { ...context.a, ...replaceA }

    return { stack, a: newA, rulesPrinted, lexer: context.lexer }
  }

const popFromStack = (state: number) => (context: ErrorContext) => {
  const { stack } = context

  while (state > 0) {
    stack.pop()
    state--
  }
  return { ...context, stack }
}

const addToStack = (state: number) => (context: ErrorContext) => {
  const { stack } = context

  stack.push(state)
  return { ...context, stack }
}

const readNewToken = (context: ErrorContext) => {
  const { lexer } = context

  return { ...context, a: lexer.scanner() }
}

const error21Reduce = (context: ErrorContext) => {
  const { error, ...newContext } = popFromStack(1)(context)
  const reduce7 = makeAReduce(7)({ ...newContext, error: context.error })

  let tempContext = reduce7
  if (tempContext.stack.at(-1) === 58) {
    while (tempContext.stack.at(-1) !== 39) {
      tempContext = makeAReduce(6)({ ...tempContext, error: context.error })
    }
  }

  return addToStack(52)({ ...tempContext, error: context.error })
}

const ERROR_TABLE: ErrorTable = new Map([
  [8, createPhraseHandler([addToStack(38), readNewToken])],
  [13, createPhraseHandler([addToStack(60), readNewToken])],
  [14, createPhraseHandler([addToStack(41), readNewToken])],
  [15, createPhraseHandler([addToStack(42), readNewToken])],
  [16, createPhraseHandler([addToStack(52), readNewToken])],
  [17, createPhraseHandler([addToStack(54), readNewToken])],
  [
    18,
    createPhraseHandler([
      makeAReduce(14, { tipo: 'NULO', classe: 'PT_V', lexema: ';' })
    ])
  ],
  [
    19,
    createPhraseHandler([
      makeAReduce(15, { tipo: 'NULO', classe: 'PT_V', lexema: ';' })
    ])
  ],
  [
    20,
    createPhraseHandler([
      makeAReduce(16, { tipo: 'NULO', classe: 'PT_V', lexema: ';' })
    ])
  ],
  [21, error21Reduce],
  [
    22,
    createPhraseHandler([
      makeAReduce(21, { tipo: 'NULO', classe: 'PT_V', lexema: ';' })
    ])
  ],
  [
    23,
    createPhraseHandler([
      makeAReduce(22, { tipo: 'NULO', classe: 'PT_V', lexema: ';' })
    ])
  ],
  [
    24,
    createPhraseHandler([
      makeAReduce(24, { tipo: 'NULO', classe: 'PT_V', lexema: ';' })
    ])
  ],
  [
    25,
    createPhraseHandler([
      makeAReduce(20, { tipo: 'NULO', classe: 'PT_V', lexema: ';' })
    ])
  ]
])

const ERROR_DATA: ErrorData = new Map([
  [1, { messageFormat: '"inicio" era esperado, foi encontrado: "%lexema%"' }],
  [2, { messageFormat: '"EOF" era esperado, foi encontrado: "%lexema%"' }],
  [3, { messageFormat: '"inicio" já declarado anteriormente' }],
  [4, { messageFormat: '"%lexema%" inesperado' }],
  [5, { messageFormat: 'Identificador não reconhecido: "%lexema%"' }],
  [6, { messageFormat: '"atr" era esperado, foi encontrado: "%lexema%"' }],
  [7, { messageFormat: '"(" era esperado, foi encontrado: "%lexema%"' }],
  [
    8,
    { messageFormat: '"%lexema%" utilizado incorretamente, era esperado ";"' }
  ],
  [9, { messageFormat: 'Estrutura sintática incorreta' }],
  [10, { messageFormat: '")" era esperado, foi encontrado: "%lexema%"' }],
  [
    11,
    {
      messageFormat:
        'Operador aritimético era esperado, foi encontrad: "%lexema%"'
    }
  ],
  [12, { messageFormat: '"então" era esperado, foi encontrado: "%lexema%"' }],
  [13, { messageFormat: '"então" escrito incorretamente: "%lexema%"' }],
  [
    14,
    { messageFormat: '"%lexema%" utilizado incorretamente, era esperado ";"' }
  ],
  [
    15,
    { messageFormat: '"%lexema%" utilizado incorretamente, era esperado ";"' }
  ],
  [
    16,
    { messageFormat: '"%lexema%" utilizado incorretamente, era esperado ";"' }
  ],
  [
    17,
    { messageFormat: '"%lexema%" utilizado incorretamente, era esperado ";"' }
  ],
  [18, { messageFormat: '"," utilizado incorretamente, era esperado ";"' }],
  [19, { messageFormat: '"," utilizado incorretamente, era esperado ";"' }],
  [20, { messageFormat: '"," utilizado incorretamente, era esperado ";"' }],
  [21, { messageFormat: '"," utilizado incorretamente, era esperado ";"' }],
  [22, { messageFormat: '"," utilizado incorretamente, era esperado ";"' }],
  [23, { messageFormat: '"," utilizado incorretamente, era esperado ";"' }],
  [24, { messageFormat: '"," utilizado incorretamente, era esperado ";"' }],
  [25, { messageFormat: '"," utilizado incorretamente, era esperado ";"' }]
])

const ErrorHandler: ErrorHandler = {
  handle(error, context) {
    console.log(
      'Erro sintático: '.concat(
        ERROR_DATA.get(error)
          ?.messageFormat.replace('%lexema%', context.a.lexema)
          .concat(
            `. linha: ${context.a.start.line}, coluna: ${context.a.start.column}`
          ) ?? ''
      )
    )
    const recoveryModeHandler = ERROR_TABLE.get(error)

    if (!recoveryModeHandler) return panicHandler({ ...context, error })

    return recoveryModeHandler({ ...context, error })
  }
}

export { ErrorHandler }
