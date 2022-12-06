import { Either } from '@/utils/types'

type State = number

type Automata = {
  nextState(char: string, actualState: number): Either<TypeofToken, State>
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

export { Automata, TypeofToken }
