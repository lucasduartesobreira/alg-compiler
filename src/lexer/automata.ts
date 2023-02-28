import {
  AcceptableStates,
  Automata,
  State,
  StateInfo,
  StatesInfo,
  TransitionTable,
  UpdateAcceptableStates,
  UpdateStatesInfo,
  UpdateTransitionTable
} from '@/lexer/automata.types'

const EOF = 'EOF'
const DIGITS = '0123456789'
const LETTERS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
const ALPHABET =
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ \n\t?!;:,.<>=/*+-\\(){}_||\'[]"'
const CLOSE_TOKEN_CHARS = ' \n\t;,*+-/()><-{"'

const ERRORS = {
  REAL_NUMBER: {
    STATE_INDEX: 102,
    DESCRIPTION: 'Erro número real incompleto'
  },
  EXPONENCIAL_NUMBER: {
    STATE_INDEX: 103,
    DESCRIPTION: 'Erro exponencial incompleto'
  },
  EXPONENCIAL_NUMBER_WITH_SIGN: {
    STATE_INDEX: 104,
    DESCRIPTION: 'Erro exponencial incompleto'
  },
  LITERAL: {
    STATE_INDEX: 7,
    DESCRIPTION: 'Erro literal incompleto'
  },
  COMMENT: {
    STATE_INDEX: 10,
    DESCRIPTION: 'Erro commentário incompleto'
  },
  INVALID_CHARACTER: {
    STATE_INDEX: 100,
    DESCRIPTION: 'Erro caractere inválido'
  },
  INVALID_PATTERN: {
    STATE_INDEX: 0,
    DESCRIPTION: 'Erro token fora do padrão'
  },
  UNEXPECTED_CHARACTER: {
    STATE_INDEX: 101,
    DESCRIPTION: 'Erro caractere inesperado'
  },
  WHITE_SPACE_LOOP: {
    STATE_INDEX: 99,
    DESCRIPTION: 'Erro white space'
  }
}

const createTransitionTable = () => {
  const transitionTable: TransitionTable = new Map()
  const acceptableStates: AcceptableStates = new Map()
  const statesInfo: StatesInfo = new Map()
  const updateTransitionTable = addTransition(transitionTable)
  const updateAcceptableStates = addAcceptableState(acceptableStates)
  const updateStatesInfo = addStateInfo(statesInfo)

  const updateFunctions = {
    updateTransitionTable,
    updateAcceptableStates,
    updateStatesInfo
  }

  createSkipWhitespaceOnStart(updateFunctions)

  createInvalidCharacterState(updateFunctions)

  createUnexpectedCharacterState(updateFunctions)

  createDetectNumberBranch(updateFunctions)

  createDetectLiteralBranch(updateFunctions)

  createDetectIdBranch(updateFunctions)

  createDetectCommentBranch(updateFunctions)

  createDetectOPRBranch(updateFunctions)

  createDetectATRBranch(updateFunctions)

  createDetectOPABranch(updateFunctions)

  createDetectAB_PBranch(updateFunctions)

  createDetectFC_PBranch(updateFunctions)

  createDetectPT_VBranch(updateFunctions)

  createDetectVIRBranch(updateFunctions)

  createDetectEOFBranch(updateFunctions)

  return { transitionTable, acceptableStates, statesInfo }
}

const addTransition =
  (transitionTable: TransitionTable) =>
  (
    actualState: State,
    nextState: State,
    charOrString: string,
    options?: {
      outOfAlphabetTransitions?: State
      defaultTransition?: State
    }
  ): TransitionTable => {
    const stateTransitionTable = transitionTable.get(actualState)

    if (!stateTransitionTable) {
      const { outOfAlphabetTransitions, defaultTransition } = options ?? {}

      transitionTable.set(actualState, {
        includeTransitions: new Map(),
        outOfAlphabetTransitions:
          outOfAlphabetTransitions ?? ERRORS.INVALID_CHARACTER.STATE_INDEX,
        defaultTransition: defaultTransition ?? -1
      })
      return addTransition(transitionTable)(
        actualState,
        nextState,
        charOrString
      )
    }

    const { includeTransitions } = stateTransitionTable

    if (includeTransitions.has(charOrString)) {
      throw new Error(
        `Erro tentando sobrescrever a transição do estado: ${actualState} com o char: ${charOrString}`
      )
    }

    if (charOrString !== EOF) {
      for (const char of charOrString) {
        includeTransitions.set(char, nextState)
      }
    } else {
      includeTransitions.set(EOF, nextState)
    }

    transitionTable.set(actualState, stateTransitionTable)

    return transitionTable
  }

const addAcceptableState =
  (acceptableStates: AcceptableStates) => (state: number) => {
    if (acceptableStates.has(state)) {
      throw new Error(
        `Erro ao tentar adicionar o estado: ${state} à lista de estados finais`
      )
    }

    acceptableStates.set(state)
  }

const addStateInfo = (statesInfo: StatesInfo) => (info: StateInfo) => {
  if (statesInfo.has(info.state)) {
    throw new Error(
      `Erro ao tentar registrar as informações do estado: ${info.state}`
    )
  }

  statesInfo.set(info.state, info)
}

const createSkipWhitespaceOnStart = (updateFunctions: {
  updateTransitionTable: UpdateTransitionTable
  updateAcceptableStates: UpdateAcceptableStates
  updateStatesInfo: UpdateStatesInfo
}) => {
  const { updateStatesInfo, updateTransitionTable } = updateFunctions

  updateTransitionTable(0, 0, ' \n\t')

  updateStatesInfo({
    state: ERRORS.INVALID_PATTERN.STATE_INDEX,
    classOfToken: 'ERROR',
    description: ERRORS.INVALID_PATTERN.DESCRIPTION,
    typeOfToken: 'NULO'
  })

  updateTransitionTable(0, ERRORS.WHITE_SPACE_LOOP.STATE_INDEX, '\\')
  updateTransitionTable(ERRORS.WHITE_SPACE_LOOP.STATE_INDEX, 0, 'nt', {
    defaultTransition: ERRORS.INVALID_PATTERN.STATE_INDEX
  })

  updateStatesInfo({
    state: ERRORS.WHITE_SPACE_LOOP.STATE_INDEX,
    classOfToken: 'ERROR',
    description: ERRORS.WHITE_SPACE_LOOP.DESCRIPTION,
    typeOfToken: 'NULO'
  })
}

const createInvalidCharacterState = (updateFunctions: {
  updateTransitionTable: UpdateTransitionTable
  updateAcceptableStates: UpdateAcceptableStates
  updateStatesInfo: UpdateStatesInfo
}) => {
  const { updateStatesInfo, updateTransitionTable } = updateFunctions

  const invalidCharStateIndex = ERRORS.INVALID_CHARACTER.STATE_INDEX

  updateTransitionTable(invalidCharStateIndex, invalidCharStateIndex, '', {
    outOfAlphabetTransitions: invalidCharStateIndex,
    defaultTransition: invalidCharStateIndex
  })

  updateTransitionTable(invalidCharStateIndex, -1, CLOSE_TOKEN_CHARS)
  updateTransitionTable(invalidCharStateIndex, -1, 'EOF')

  updateStatesInfo({
    state: ERRORS.INVALID_CHARACTER.STATE_INDEX,
    classOfToken: 'ERROR',
    description: ERRORS.INVALID_CHARACTER.DESCRIPTION,
    typeOfToken: 'NULO'
  })
}

const createUnexpectedCharacterState = (updateFunctions: {
  updateTransitionTable: UpdateTransitionTable
  updateAcceptableStates: UpdateAcceptableStates
  updateStatesInfo: UpdateStatesInfo
}) => {
  const { updateStatesInfo, updateTransitionTable } = updateFunctions

  const unexpectedCharStateIndex = ERRORS.UNEXPECTED_CHARACTER.STATE_INDEX

  updateTransitionTable(
    unexpectedCharStateIndex,
    unexpectedCharStateIndex,
    '',
    {
      outOfAlphabetTransitions: unexpectedCharStateIndex,
      defaultTransition: unexpectedCharStateIndex
    }
  )

  updateTransitionTable(unexpectedCharStateIndex, -1, CLOSE_TOKEN_CHARS)
  updateTransitionTable(unexpectedCharStateIndex, -1, 'EOF')

  updateStatesInfo({
    state: ERRORS.UNEXPECTED_CHARACTER.STATE_INDEX,
    classOfToken: 'ERROR',
    description: ERRORS.UNEXPECTED_CHARACTER.DESCRIPTION,
    typeOfToken: 'NULO'
  })
}

const createDetectNumberBranch = (updateFunctions: {
  updateTransitionTable: UpdateTransitionTable
  updateAcceptableStates: UpdateAcceptableStates
  updateStatesInfo: UpdateStatesInfo
}) => {
  const { updateStatesInfo, updateAcceptableStates, updateTransitionTable } =
    updateFunctions
  const numberBranchOptions = {
    defaultTransition: ERRORS.UNEXPECTED_CHARACTER.STATE_INDEX
  }

  const realNumberErrorState = ERRORS.REAL_NUMBER.STATE_INDEX
  const exponentialNumberErrorState = ERRORS.EXPONENCIAL_NUMBER.STATE_INDEX
  const exponentialNumberWithSignErrorState =
    ERRORS.EXPONENCIAL_NUMBER_WITH_SIGN.STATE_INDEX

  updateTransitionTable(0, 1, DIGITS)
  updateTransitionTable(1, 1, DIGITS, numberBranchOptions)
  updateTransitionTable(1, -1, CLOSE_TOKEN_CHARS)
  updateTransitionTable(1, 2, '.')
  updateTransitionTable(2, 3, DIGITS, {
    defaultTransition: realNumberErrorState
  })
  updateTransitionTable(3, 3, DIGITS, numberBranchOptions)
  updateTransitionTable(3, -1, CLOSE_TOKEN_CHARS)
  updateTransitionTable(1, 4, 'Ee')
  updateTransitionTable(3, 4, 'Ee')
  updateTransitionTable(4, 5, '+-', {
    defaultTransition: exponentialNumberErrorState
  })
  updateTransitionTable(4, 6, DIGITS)
  updateTransitionTable(5, 6, DIGITS, {
    defaultTransition: exponentialNumberWithSignErrorState
  })
  updateTransitionTable(6, 6, DIGITS, numberBranchOptions)
  updateTransitionTable(6, -1, CLOSE_TOKEN_CHARS)

  updateTransitionTable(realNumberErrorState, realNumberErrorState, '', {
    outOfAlphabetTransitions: realNumberErrorState,
    defaultTransition: ERRORS.UNEXPECTED_CHARACTER.STATE_INDEX
  })

  updateTransitionTable(realNumberErrorState, -1, CLOSE_TOKEN_CHARS)
  updateTransitionTable(realNumberErrorState, -1, 'EOF')

  updateTransitionTable(
    exponentialNumberErrorState,
    exponentialNumberErrorState,
    '',
    {
      outOfAlphabetTransitions: exponentialNumberErrorState,
      defaultTransition: ERRORS.UNEXPECTED_CHARACTER.STATE_INDEX
    }
  )

  updateTransitionTable(exponentialNumberErrorState, -1, CLOSE_TOKEN_CHARS)
  updateTransitionTable(exponentialNumberErrorState, -1, 'EOF')

  updateTransitionTable(
    exponentialNumberWithSignErrorState,
    exponentialNumberWithSignErrorState,
    '',
    {
      outOfAlphabetTransitions: exponentialNumberWithSignErrorState,
      defaultTransition: ERRORS.UNEXPECTED_CHARACTER.STATE_INDEX
    }
  )

  updateTransitionTable(
    exponentialNumberWithSignErrorState,
    -1,
    CLOSE_TOKEN_CHARS
  )
  updateTransitionTable(exponentialNumberWithSignErrorState, -1, 'EOF')

  updateAcceptableStates(1)
  updateAcceptableStates(3)
  updateAcceptableStates(6)

  updateStatesInfo({
    state: 1,
    description: 'Número inteiro',
    classOfToken: 'NUM',
    typeOfToken: 'INTEIRO'
  })
  updateStatesInfo({
    state: 2,
    description: ERRORS.REAL_NUMBER.DESCRIPTION,
    classOfToken: 'ERROR',
    typeOfToken: 'NULO'
  })
  updateStatesInfo({
    state: 3,
    description: 'Número real',
    classOfToken: 'NUM',
    typeOfToken: 'REAL'
  })
  updateStatesInfo({
    state: 4,
    description: ERRORS.EXPONENCIAL_NUMBER.DESCRIPTION,
    classOfToken: 'ERROR',
    typeOfToken: 'NULO'
  })
  updateStatesInfo({
    state: 5,
    description: ERRORS.EXPONENCIAL_NUMBER_WITH_SIGN.DESCRIPTION,
    classOfToken: 'ERROR',
    typeOfToken: 'NULO'
  })
  updateStatesInfo({
    state: 6,
    description: 'Número exponencial',
    classOfToken: 'NUM',
    typeOfToken: 'REAL'
  })

  updateStatesInfo({
    state: ERRORS.REAL_NUMBER.STATE_INDEX,
    description: ERRORS.REAL_NUMBER.DESCRIPTION,
    classOfToken: 'ERROR',
    typeOfToken: 'NULO'
  })

  updateStatesInfo({
    state: ERRORS.EXPONENCIAL_NUMBER.STATE_INDEX,
    description: ERRORS.EXPONENCIAL_NUMBER.DESCRIPTION,
    classOfToken: 'ERROR',
    typeOfToken: 'NULO'
  })

  updateStatesInfo({
    state: ERRORS.EXPONENCIAL_NUMBER_WITH_SIGN.STATE_INDEX,
    description: ERRORS.EXPONENCIAL_NUMBER_WITH_SIGN.DESCRIPTION,
    classOfToken: 'ERROR',
    typeOfToken: 'NULO'
  })
}

const createDetectLiteralBranch = (updateFunctions: {
  updateTransitionTable: UpdateTransitionTable
  updateAcceptableStates: UpdateAcceptableStates
  updateStatesInfo: UpdateStatesInfo
}) => {
  const { updateStatesInfo, updateAcceptableStates, updateTransitionTable } =
    updateFunctions
  const alphabetWithoutQuotes = ALPHABET.replace('"', '')
  updateTransitionTable(0, 7, '"')
  updateTransitionTable(7, 7, alphabetWithoutQuotes, {
    outOfAlphabetTransitions: 7
  })
  updateTransitionTable(7, 8, '"')

  updateAcceptableStates(8)

  updateStatesInfo({
    state: 7,
    classOfToken: 'ERROR',
    description: 'Erro literal incompleto',
    typeOfToken: 'NULO'
  })

  updateStatesInfo({
    state: 8,
    classOfToken: 'LIT',
    description: 'Literal',
    typeOfToken: 'LITERAL'
  })
}

const createDetectIdBranch = (updateFunctions: {
  updateTransitionTable: UpdateTransitionTable
  updateAcceptableStates: UpdateAcceptableStates
  updateStatesInfo: UpdateStatesInfo
}) => {
  const { updateStatesInfo, updateAcceptableStates, updateTransitionTable } =
    updateFunctions
  updateTransitionTable(0, 9, LETTERS)
  updateTransitionTable(9, 9, LETTERS + DIGITS + '_')

  updateAcceptableStates(9)

  updateStatesInfo({
    state: 9,
    description: 'Identifier',
    classOfToken: 'ID',
    typeOfToken: 'NULO'
  })
}

const createDetectCommentBranch = (updateFunctions: {
  updateTransitionTable: UpdateTransitionTable
  updateAcceptableStates: UpdateAcceptableStates
  updateStatesInfo: UpdateStatesInfo
}) => {
  const { updateStatesInfo, updateAcceptableStates, updateTransitionTable } =
    updateFunctions

  const alphabetWithoutCurlyBrackets = ALPHABET.replace('{}', '')
  updateTransitionTable(0, 10, '{')
  updateTransitionTable(10, 10, alphabetWithoutCurlyBrackets, {
    outOfAlphabetTransitions: 10
  })
  updateTransitionTable(10, 11, '}')

  updateAcceptableStates(11)

  updateStatesInfo({
    state: 10,
    classOfToken: 'ERROR',
    description: 'Erro comentário incompleto',
    typeOfToken: 'NULO'
  })
  updateStatesInfo({
    state: 11,
    description: 'Commentary',
    classOfToken: 'COMMENT',
    typeOfToken: 'NULO'
  })
}

const createDetectOPRBranch = (updateFunctions: {
  updateTransitionTable: UpdateTransitionTable
  updateAcceptableStates: UpdateAcceptableStates
  updateStatesInfo: UpdateStatesInfo
}) => {
  const { updateStatesInfo, updateAcceptableStates, updateTransitionTable } =
    updateFunctions

  updateTransitionTable(0, 13, '>')
  updateTransitionTable(13, 14, '=')
  updateTransitionTable(0, 15, '<')
  updateTransitionTable(15, 16, '=')
  updateTransitionTable(15, 18, '>')

  updateAcceptableStates(13)
  updateAcceptableStates(14)
  updateAcceptableStates(15)
  updateAcceptableStates(16)
  updateAcceptableStates(18)

  updateStatesInfo({
    state: 13,
    classOfToken: 'OPR',
    description: '>',
    typeOfToken: 'NULO'
  })
  updateStatesInfo({
    state: 14,
    classOfToken: 'OPR',
    description: '>=',
    typeOfToken: 'NULO'
  })
  updateStatesInfo({
    state: 15,
    classOfToken: 'OPR',
    description: '<',
    typeOfToken: 'NULO'
  })
  updateStatesInfo({
    state: 16,
    classOfToken: 'OPR',
    description: '<=',
    typeOfToken: 'NULO'
  })
  updateStatesInfo({
    state: 18,
    classOfToken: 'OPR',
    description: '<>',
    typeOfToken: 'NULO'
  })
}

const createDetectATRBranch = (updateFunctions: {
  updateTransitionTable: UpdateTransitionTable
  updateAcceptableStates: UpdateAcceptableStates
  updateStatesInfo: UpdateStatesInfo
}) => {
  const { updateStatesInfo, updateAcceptableStates, updateTransitionTable } =
    updateFunctions

  updateTransitionTable(15, 17, '-')

  updateAcceptableStates(17)

  updateStatesInfo({
    state: 17,
    classOfToken: 'ATR',
    description: '<-',
    typeOfToken: 'NULO'
  })
}

const createDetectOPABranch = (updateFunctions: {
  updateTransitionTable: UpdateTransitionTable
  updateAcceptableStates: UpdateAcceptableStates
  updateStatesInfo: UpdateStatesInfo
}) => {
  const { updateStatesInfo, updateAcceptableStates, updateTransitionTable } =
    updateFunctions

  updateTransitionTable(0, 19, '+-*/')

  updateAcceptableStates(19)

  updateStatesInfo({
    state: 19,
    classOfToken: 'OPA',
    description: 'Arithmetic Operator',
    typeOfToken: 'NULO'
  })
}

const createDetectAB_PBranch = (updateFunctions: {
  updateTransitionTable: UpdateTransitionTable
  updateAcceptableStates: UpdateAcceptableStates
  updateStatesInfo: UpdateStatesInfo
}) => {
  const { updateStatesInfo, updateAcceptableStates, updateTransitionTable } =
    updateFunctions

  updateTransitionTable(0, 20, '(')

  updateAcceptableStates(20)

  updateStatesInfo({
    state: 20,
    classOfToken: 'AB_P',
    description: '(',
    typeOfToken: 'NULO'
  })
}

const createDetectFC_PBranch = (updateFunctions: {
  updateTransitionTable: UpdateTransitionTable
  updateAcceptableStates: UpdateAcceptableStates
  updateStatesInfo: UpdateStatesInfo
}) => {
  const { updateStatesInfo, updateAcceptableStates, updateTransitionTable } =
    updateFunctions

  updateTransitionTable(0, 21, ')')

  updateAcceptableStates(21)

  updateStatesInfo({
    state: 21,
    classOfToken: 'FC_P',
    description: ')',
    typeOfToken: 'NULO'
  })
}

const createDetectPT_VBranch = (updateFunctions: {
  updateTransitionTable: UpdateTransitionTable
  updateAcceptableStates: UpdateAcceptableStates
  updateStatesInfo: UpdateStatesInfo
}) => {
  const { updateStatesInfo, updateAcceptableStates, updateTransitionTable } =
    updateFunctions

  updateTransitionTable(0, 22, ';')

  updateAcceptableStates(22)

  updateStatesInfo({
    state: 22,
    classOfToken: 'PT_V',
    description: ';',
    typeOfToken: 'NULO'
  })
}

const createDetectVIRBranch = (updateFunctions: {
  updateTransitionTable: UpdateTransitionTable
  updateAcceptableStates: UpdateAcceptableStates
  updateStatesInfo: UpdateStatesInfo
}) => {
  const { updateStatesInfo, updateAcceptableStates, updateTransitionTable } =
    updateFunctions

  updateTransitionTable(0, 23, ',')

  updateAcceptableStates(23)

  updateStatesInfo({
    state: 23,
    classOfToken: 'VIR',
    description: ',',
    typeOfToken: 'NULO'
  })
}

const createDetectEOFBranch = (updateFunctions: {
  updateTransitionTable: UpdateTransitionTable
  updateAcceptableStates: UpdateAcceptableStates
  updateStatesInfo: UpdateStatesInfo
}) => {
  const { updateStatesInfo, updateAcceptableStates, updateTransitionTable } =
    updateFunctions

  updateTransitionTable(0, 12, 'EOF')

  updateAcceptableStates(12)

  updateStatesInfo({
    state: 12,
    classOfToken: 'EOF',
    description: 'End of file',
    typeOfToken: 'NULO'
  })
}

const {
  transitionTable: TRANSITION_TABLE,
  acceptableStates: ACCEPTABLE_STATES,
  statesInfo: STATES_INFO
} = createTransitionTable()

const SPLITED_ALPHABET = ALPHABET.split('')
SPLITED_ALPHABET.push('EOF')

const Automata: Automata = {
  nextState(char, actualState) {
    const stateTransitionTable = TRANSITION_TABLE.get(actualState)

    if (!stateTransitionTable) {
      return -1
    }

    const { includeTransitions, outOfAlphabetTransitions, defaultTransition } =
      stateTransitionTable

    if (!SPLITED_ALPHABET.includes(char)) return outOfAlphabetTransitions

    const nextState = includeTransitions.get(char)

    return nextState ?? defaultTransition
  },
  acceptState(state) {
    const accepted = ACCEPTABLE_STATES.has(state)
    const stateInfo = STATES_INFO.get(state) as StateInfo

    return { accepted, stateInfo }
  }
}

export default Automata
