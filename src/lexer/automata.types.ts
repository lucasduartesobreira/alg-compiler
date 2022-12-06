import { Either } from "@/utils/types"

type State = number

type Automata = {
  nextState(char: string, actualState: number): Either<Token, State>
}

type Token = {
  type: 'NUM' | 'LIT' | 'ID' | 'COMMENT' | 'EOF' | 'OPR' | 'ATR' | 'OPA' | 'AB_P' | 'FC_P' | 'PT_V' | 'VIR' | 'ERROR',
  details: string,
  start: number,
  end: number
}

export {
  Automata,
  Token
}
