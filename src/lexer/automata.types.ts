type State = number
type Char = string

type Automata = {
  nextState(char: string, actualState: number): State
  acceptState(state: number): { accepted: boolean; stateInfo: StateInfo }
}

type ClassOfToken =
  | 'NUM'
  | 'LIT'
  | 'ID'
  | 'COMMENT'
  | 'EOF'
  | 'OPR'
  | 'ATR'
  | 'OPA'
  | 'AB_P'
  | 'FC_P'
  | 'PT_V'
  | 'VIR'
  | 'ERROR'

type TokenType = 'INTEIRO' | 'LITERAL' | 'REAL' | 'NULO'

type StateInfo = {
  state: State
  description: string
  typeOfToken: TokenType
  classOfToken: ClassOfToken
  canReadWhiteSpace: boolean
}

type StateTransitions = Map<Char, number>
type TransitionTable = Map<
  State,
  {
    includeTransitions: StateTransitions
    outOfAlphabetTransitions: State
    defaultTransition: State
  }
>
type UpdateTransitionTable = (
  actualState: State,
  nextState: State,
  charOrString: string,
  options?: { outOfAlphabetTransitions?: State; defaultTransition?: State }
) => void

type AcceptableStates = Map<State, void>
type UpdateAcceptableStates = (state: State) => void

type StatesInfo = Map<State, StateInfo>
type UpdateStatesInfo = (info: StateInfo) => void

export {
  Automata,
  ClassOfToken as TypeofToken,
  TransitionTable,
  AcceptableStates,
  StateInfo,
  StatesInfo,
  UpdateTransitionTable,
  UpdateAcceptableStates,
  UpdateStatesInfo,
  State,
  TokenType
}
