import { Either } from '@/utils/types'

type State = number
type Char = string

type Automata = {
  nextState(char: string, actualState: number): State
  acceptState(state: number): { accepted: boolean; stateInfo: StateInfo }
}

type TypeofToken =
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

type StateInfo = {
  state: State
  description: string
  typeofToken: TypeofToken
  canReadWhiteSpace: boolean
}

type StateTransitions = Map<Char, number>
type TransitionTable = Map<State, StateTransitions>
type UpdateTransitionTable = (
  actualState: State,
  nextState: State,
  charOrString: string
) => void

type AcceptableStates = Map<State, void>
type UpdateAcceptableStates = (state: State) => void

type StatesInfo = Map<State, StateInfo>
type UpdateStatesInfo = (info: StateInfo) => void

export {
  Automata,
  TypeofToken,
  TransitionTable,
  AcceptableStates,
  StateInfo,
  StatesInfo,
  UpdateTransitionTable,
  UpdateAcceptableStates,
  UpdateStatesInfo
}
