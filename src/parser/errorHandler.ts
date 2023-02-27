import { Token } from '@/lexer/lexer.types'
import * as Semantic from '@/semantic/semanticRules'
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
  EXPECTED_TOKENS_PER_STATE,
  FOLLOW_STATE_TABLE,
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
  'COND',
  'ARG'
]

const createPanicHandler =
  (useLastToken?: boolean) => (context: ErrorContext) => {
    printMessage(useLastToken)(context)
    const { stack, a, lexer, rulesPrinted, lastToken, semanticContext } =
      context
    let newA = a
    let newNodeLexema = ''

    while (stack.length > 0) {
      const poppedStack = stack.pop()
      const semanticPop = semanticContext.semanticStack.pop()

      if (!poppedStack) throw 'Erro pilha sintática vazia no panic handler'
      if (!semanticPop) throw 'Erro pilha semantica vazia no panic handler'

      newNodeLexema = newNodeLexema.concat(semanticPop.lexema)

      const stateGotoTable = GOTO_TABLE.get(poppedStack)

      if (!stateGotoTable) {
        continue
      }

      const gotoSyncRule = panicSync.find((value) => stateGotoTable.has(value))

      if (gotoSyncRule) {
        let EOFCount = 0
        do {
          const gotoState = stateGotoTable.get(gotoSyncRule) as number
          const followState = FOLLOW_STATE_TABLE.get(gotoState)
          if (followState?.has(newA.classe)) {
            stack.push(poppedStack)
            semanticContext.semanticStack.push(semanticPop)
            stack.push(gotoState)
            semanticContext.semanticStack.push({
              ...semanticPop,
              classe: gotoSyncRule,
              lexema: newNodeLexema,
              tipo: 'NULO'
            })
            return { stack, a: newA, rulesPrinted, lastToken, semanticContext }
          }
          newA = lexer.scanner()
          EOFCount += newA.classe === 'EOF' ? 1 : 0
        } while (EOFCount !== 2)
      }
    }
    throw 'Erro pilha vazia no panic handler'
  }

const createPhraseHandler =
  (listOfActions: Array<(context: ErrorContext) => ParsingContext>) =>
  (context: ErrorContext): UpdatedParsingContext => {
    const { stack, a, rulesPrinted, lastToken, semanticContext } =
      listOfActions.reduce((ctx, action) => {
        const newParsingContext = action(ctx)
        return {
          ...newParsingContext,
          error: context.error
        }
      }, context)

    return {
      stack,
      a,
      rulesPrinted,
      lastToken,
      semanticContext
    }
  }

const makeAReduce =
  (identifier: number, replaceA?: Pick<Token, 'classe' | 'lexema' | 'tipo'>) =>
  (context: ErrorContext) => {
    let { stack } = context
    const { rulesPrinted, lastToken, semanticContext } = context

    const amountToPop = POP_AMOUNT_PER_RULE.get(identifier) as number
    stack = stack.slice(0, -amountToPop)

    const t = stack.at(-1) as number

    const ruleSymbol = RULE_LETTER.get(identifier) as NonTerminals
    stack.push(GOTO_TABLE.get(t)?.get(ruleSymbol) as number)

    const fullRuleText = GRAMMAR_RULES.get(identifier) as string
    rulesPrinted.push(fullRuleText)

    const newA = { ...context.a, ...replaceA }

    const newSemanticContext = Semantic.SemanticAnalyzer.analyze(identifier, {
      ...semanticContext,
      amountToPopFromStack: amountToPop,
      ruleSymbol
    })

    return {
      stack,
      a: newA,
      rulesPrinted,
      lexer: context.lexer,
      lastToken,
      semanticContext: newSemanticContext
    }
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
  const { stack, semanticContext, lastToken } = context

  stack.push(state)
  semanticContext.semanticStack.push(lastToken)
  return { ...context, stack }
}

const readNewToken = (context: ErrorContext) => {
  const { lexer } = context

  return { ...context, a: lexer.scanner() }
}

const printMessage = (useLastToken?: boolean) => (context: ErrorContext) => {
  const { a, error, lastToken, stack } = context

  const expectedTokens = EXPECTED_TOKENS_PER_STATE.get(
    stack.at(-1) as number
  )?.join(', ')
  const errorData = ERROR_DATA.get(error)

  if (!errorData) {
    console.log(
      `Erro Sintático(${error}): "${a.lexema}" inesperado, era esperado um desses: ${expectedTokens}`
    )
    return context
  }

  const { messageFormat } = errorData

  const rule = ERROR_RULES.get(stack.at(-1) as number) ?? ''

  console.log(
    `Erro sintático(${error}): `.concat(
      messageFormat
        .replace('%lexema%', context.a.lexema)
        .replace('%expected_tokens%', expectedTokens ?? '')
        .replace('%rule%', rule)
        .concat(
          useLastToken
            ? `. linha: ${lastToken.start.line}, coluna: ${
                lastToken.start.column + 1
              }`
            : `. linha: ${a.start.line}, coluna: ${a.start.column + 1}`
        ) ?? ''
    )
  )

  return context
}

const error21Reduce = (context: ErrorContext) => {
  printMessage(true)(context)
  const { error, ...newContext } = popFromStack(1)(context)
  const virNode = newContext.semanticContext.semanticStack.pop()

  if (!virNode)
    throw 'Erro no semantico, ajustando "," para ";", porém "," faltando na pilha semântica'
  const reduce7 = makeAReduce(7)({ ...newContext, error: context.error })

  let tempContext = reduce7
  if (tempContext.stack.at(-1) === 58) {
    while (tempContext.stack.at(-1) !== 39) {
      tempContext = makeAReduce(6)({ ...tempContext, error: context.error })
    }
  }

  const newPtvNode: Token = {
    classe: 'PT_V',
    tipo: 'NULO',
    lexema: ';',
    start: virNode.start,
    end: virNode.end
  }

  tempContext.lastToken = newPtvNode

  return addToStack(52)({ ...tempContext, error: context.error })
}

const ERROR_TABLE: ErrorTable = new Map([
  [8, createPhraseHandler([printMessage(), addToStack(38), readNewToken])],
  [9, createPanicHandler(true)],
  [13, createPhraseHandler([printMessage(), addToStack(60), readNewToken])],
  [14, createPhraseHandler([printMessage(), addToStack(41), readNewToken])],
  [15, createPhraseHandler([printMessage(), addToStack(42), readNewToken])],
  [16, createPhraseHandler([printMessage(), addToStack(52), readNewToken])],
  [17, createPhraseHandler([printMessage(), addToStack(54), readNewToken])],
  [
    18,
    createPhraseHandler([
      printMessage(),
      makeAReduce(14, { tipo: 'NULO', classe: 'PT_V', lexema: ';' })
    ])
  ],
  [
    19,
    createPhraseHandler([
      printMessage(),
      makeAReduce(15, { tipo: 'NULO', classe: 'PT_V', lexema: ';' })
    ])
  ],
  [
    20,
    createPhraseHandler([
      printMessage(),
      makeAReduce(16, { tipo: 'NULO', classe: 'PT_V', lexema: ';' })
    ])
  ],
  [21, error21Reduce],
  [
    22,
    createPhraseHandler([
      printMessage(),
      makeAReduce(21, { tipo: 'NULO', classe: 'PT_V', lexema: ';' })
    ])
  ],
  [
    23,
    createPhraseHandler([
      printMessage(),
      makeAReduce(22, { tipo: 'NULO', classe: 'PT_V', lexema: ';' })
    ])
  ],
  [
    24,
    createPhraseHandler([
      printMessage(),
      makeAReduce(24, { tipo: 'NULO', classe: 'PT_V', lexema: ';' })
    ])
  ],
  [
    25,
    createPhraseHandler([
      printMessage(),
      makeAReduce(20, { tipo: 'NULO', classe: 'PT_V', lexema: ';' })
    ])
  ],
  [26, createPhraseHandler([printMessage(), addToStack(35)])]
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
  [9, { messageFormat: 'Estrutura sintática incorreta, esperado: "%rule%"' }],
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
  [25, { messageFormat: '"," utilizado incorretamente, era esperado ";"' }],
  [
    26,
    { messageFormat: '"fim" utilizado incorretamente, era esperado "fimse"' }
  ]
])

const ERROR_RULES = new Map([
  [15, 'varinicio variáveis varfim;'],
  [19, 'inteiro identificadores;'],
  [20, 'real identificadores;'],
  [21, 'literal identificadores;'],
  [27, 'escreva "literal";'],
  [28, 'escreva 1234;'],
  [29, 'escreva A;'],
  [31, 'se (expressão) então comandos fimse'],
  [35, 'se (expressão) então comandos fimse'],
  [37, 'tipo identificador; ... varfim;'],
  [38, 'varfim; ...comandos fim'],
  [40, 'identificador,identificador...;'],
  [41, 'comando;comando;...;fim'],
  [42, 'comando;comando;...;fim'],
  [44, 'id <- id|num +|-|/|* id|num'],
  [45, 'id <- id|num +|-|/|* id|num'],
  [46, 'id <- id|num +|-|/|* id|num'],
  [47, 'comando;comando;...;fim'],
  [48, 'comando;comando;...;fim'],
  [49, 'comando;comando;...;fim'],
  [52, 'varinicio variávels varfim;'],
  [54, 'comando;comando;...;fim'],
  [58, 'varinicio variávels varfim;'],
  [59, 'comando;comando;...;fim'],
  [60, 'comando;comando;...;fim'],
  [61, 'comando;comando;...;fim']
])

const ErrorHandler: ErrorHandler = {
  handle(error, context) {
    const recoveryModeHandler = ERROR_TABLE.get(error)

    if (!recoveryModeHandler) return createPanicHandler()({ ...context, error })

    return recoveryModeHandler({ ...context, error })
  }
}

export { ErrorHandler }
