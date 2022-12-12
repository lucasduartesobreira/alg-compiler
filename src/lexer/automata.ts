import {
  AcceptableStates,
  Automata,
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
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRTUVWXYZ ?!;:,.<>=/*+-\\(){}_||\'[]"'

const ERRORS = {
  INTEGER_NUMBER: {
    STATE_INDEX: -2,
    DESCRIPTION: 'Erro token fora do padrão'
  },
  REAL_NUMBER: {
    STATE_INDEX: 2,
    DESCRIPTION: 'Erro número real incompleto'
  },
  EXPONENCIAL_NUMBER: {
    STATE_INDEX: 4,
    DESCRIPTION: 'Erro exponencial incompleto'
  },
  EXPONENCIAL_NUMBER_WITH_SIGN: {
    STATE_INDEX: 5,
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
    STATE_INDEX: -3,
    DESCRIPTION: 'Erro caractere inválido na linguágem'
  },
  INVALID_PATTERN: {
    STATE_INDEX: 0,
    DESCRIPTION: 'Erro token fora do padrão'
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

  createSkipWhiteSpaceOnStart(updateFunctions)

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
    actualState: number,
    nextState: number,
    charOrString: string
  ): TransitionTable => {
    const stateTransitionTable = transitionTable.get(actualState)

    if (!stateTransitionTable) {
      transitionTable.set(actualState, new Map())
      return addTransition(transitionTable)(
        actualState,
        nextState,
        charOrString
      )
    }

    if (stateTransitionTable.has(charOrString)) {
      throw new Error(
        `Error trying to overwrite a transition on state: ${actualState} with char: ${charOrString}`
      )
    }

    if (charOrString !== EOF) {
      for (const char of charOrString) {
        stateTransitionTable.set(char, nextState)
      }
    } else {
      stateTransitionTable.set(EOF, nextState)
    }

    transitionTable.set(actualState, stateTransitionTable)

    return transitionTable
  }

const addAcceptableState =
  (acceptableStates: AcceptableStates) => (state: number) => {
    if (acceptableStates.has(state)) {
      throw new Error(
        `Error trying to add the state: ${state} to acceptable state list`
      )
    }

    acceptableStates.set(state)
  }

const addStateInfo = (statesInfo: StatesInfo) => (info: StateInfo) => {
  if (statesInfo.has(info.state)) {
    throw new Error(`Error trying to register info to the state: ${info.state}`)
  }

  statesInfo.set(info.state, info)
}

const createSkipWhiteSpaceOnStart = (updateFunctions: {
  updateTransitionTable: UpdateTransitionTable
  updateAcceptableStates: UpdateAcceptableStates
  updateStatesInfo: UpdateStatesInfo
}) => {
  const { updateStatesInfo, updateTransitionTable } = updateFunctions

  updateTransitionTable(0, 0, ' \n\t')

  updateStatesInfo({
    state: ERRORS.INVALID_PATTERN.STATE_INDEX,
    typeofToken: 'ERROR',
    description: ERRORS.INVALID_PATTERN.DESCRIPTION,
    canReadWhiteSpace: false
  })
}

const createDetectNumberBranch = (updateFunctions: {
  updateTransitionTable: UpdateTransitionTable
  updateAcceptableStates: UpdateAcceptableStates
  updateStatesInfo: UpdateStatesInfo
}) => {
  const { updateStatesInfo, updateAcceptableStates, updateTransitionTable } =
    updateFunctions
  updateTransitionTable(0, 1, DIGITS)
  updateTransitionTable(1, 1, DIGITS)
  updateTransitionTable(1, 2, '.')
  updateTransitionTable(2, 3, DIGITS)
  updateTransitionTable(3, 3, DIGITS)
  updateTransitionTable(1, 4, 'Ee')
  updateTransitionTable(3, 4, 'Ee')
  updateTransitionTable(4, 5, '+-')
  updateTransitionTable(4, 6, DIGITS)
  updateTransitionTable(5, 6, DIGITS)
  updateTransitionTable(6, 6, DIGITS)

  const alphabetMinusDigitsEeAndDot = ALPHABET.replace(
    /[0123456789Ee. \n\t]*/gi,
    ''
  )
  console.log(alphabetMinusDigitsEeAndDot)
  updateTransitionTable(
    1,
    ERRORS.INTEGER_NUMBER.STATE_INDEX,
    alphabetMinusDigitsEeAndDot
  )

  updateAcceptableStates(1)
  updateAcceptableStates(3)
  updateAcceptableStates(6)

  updateStatesInfo({
    state: 1,
    description: 'Número inteiro',
    typeofToken: 'NUM',
    canReadWhiteSpace: false
  })
  updateStatesInfo({
    state: ERRORS.REAL_NUMBER.STATE_INDEX,
    description: ERRORS.REAL_NUMBER.DESCRIPTION,
    typeofToken: 'ERROR',
    canReadWhiteSpace: false
  })
  updateStatesInfo({
    state: 3,
    description: 'Número real',
    typeofToken: 'NUM',
    canReadWhiteSpace: false
  })
  updateStatesInfo({
    state: ERRORS.EXPONENCIAL_NUMBER.STATE_INDEX,
    description: ERRORS.EXPONENCIAL_NUMBER.DESCRIPTION,
    typeofToken: 'ERROR',
    canReadWhiteSpace: false
  })
  updateStatesInfo({
    state: ERRORS.EXPONENCIAL_NUMBER_WITH_SIGN.STATE_INDEX,
    description: ERRORS.EXPONENCIAL_NUMBER_WITH_SIGN.DESCRIPTION,
    typeofToken: 'ERROR',
    canReadWhiteSpace: false
  })
  updateStatesInfo({
    state: 6,
    description: 'Número exponencial',
    typeofToken: 'NUM',
    canReadWhiteSpace: false
  })
  updateStatesInfo({
    state: ERRORS.INTEGER_NUMBER.STATE_INDEX,
    description: ERRORS.INTEGER_NUMBER.DESCRIPTION,
    typeofToken: 'ERROR',
    canReadWhiteSpace: false
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
  updateTransitionTable(7, 7, alphabetWithoutQuotes)
  updateTransitionTable(7, 8, '"')

  updateAcceptableStates(8)

  updateStatesInfo({
    state: 7,
    typeofToken: 'ERROR',
    description: 'Erro literal incompleto',
    canReadWhiteSpace: true
  })

  updateStatesInfo({
    state: 8,
    typeofToken: 'LIT',
    description: 'Literal',
    canReadWhiteSpace: false
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
    typeofToken: 'ID',
    canReadWhiteSpace: false
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
  updateTransitionTable(10, 10, alphabetWithoutCurlyBrackets)
  updateTransitionTable(10, 11, '}')

  updateAcceptableStates(11)

  updateStatesInfo({
    state: 10,
    typeofToken: 'ERROR',
    description: 'Erro comentário incompleto',
    canReadWhiteSpace: true
  })
  updateStatesInfo({
    state: 11,
    description: 'Commentary',
    typeofToken: 'COMMENT',
    canReadWhiteSpace: false
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
    typeofToken: 'OPR',
    description: '>',
    canReadWhiteSpace: false
  })
  updateStatesInfo({
    state: 14,
    typeofToken: 'OPR',
    description: '>=',
    canReadWhiteSpace: false
  })
  updateStatesInfo({
    state: 15,
    typeofToken: 'OPR',
    description: '<',
    canReadWhiteSpace: false
  })
  updateStatesInfo({
    state: 16,
    typeofToken: 'OPR',
    description: '<=',
    canReadWhiteSpace: false
  })
  updateStatesInfo({
    state: 18,
    typeofToken: 'OPR',
    description: '<>',
    canReadWhiteSpace: false
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
    typeofToken: 'ATR',
    description: '<-',
    canReadWhiteSpace: false
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
    typeofToken: 'OPA',
    description: 'Arithmetic Operator',
    canReadWhiteSpace: false
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
    typeofToken: 'AB_P',
    description: '(',
    canReadWhiteSpace: false
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
    typeofToken: 'FC_P',
    description: ')',
    canReadWhiteSpace: false
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
    typeofToken: 'PT_V',
    description: ';',
    canReadWhiteSpace: false
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
    typeofToken: 'VIR',
    description: ',',
    canReadWhiteSpace: false
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
    typeofToken: 'EOF',
    description: 'End of file',
    canReadWhiteSpace: false
  })
}

const {
  transitionTable: TRANSITION_TABLE,
  acceptableStates: ACCEPTABLE_STATES,
  statesInfo: STATES_INFO
} = createTransitionTable()

const Automata: Automata = {
  nextState(char, actualState) {
    const stateTransitionTable = TRANSITION_TABLE.get(actualState)

    const nextState = stateTransitionTable?.get(char)

    return nextState ?? -1
  },
  acceptState(state) {
    const accepted = ACCEPTABLE_STATES.has(state)
    const stateInfo = STATES_INFO.get(state) as StateInfo

    return { accepted, stateInfo }
  }
}

export default Automata
