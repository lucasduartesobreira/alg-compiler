import { State, TypeofToken } from '@/lexer/automata.types'
import { Lexer, ReservedWords } from '@/lexer/lexer.types'

interface Parser {
  parse(lexer: Lexer): {
    rulesPrinted: string[]
    object: { textObject: string; shouldCreateOBJ: boolean }
  } //Possibly return a AST
}

type Action = {
  action: 'SHIFT' | 'REDUCE' | 'ACCEPT' | 'ERROR'
  identifier: number
}
type NonTerminals =
  | "P'"
  | 'P'
  | 'V'
  | 'LV'
  | 'D'
  | 'L'
  | 'TIPO'
  | 'A'
  | 'ES'
  | 'ARG'
  | 'CMD'
  | 'LD'
  | 'OPRD'
  | 'COND'
  | 'CAB'
  | 'EXP_R'
  | 'CP'

type ActionTable = Map<State, Map<TypeofToken | ReservedWords, Action>>
type GotoTable = Map<State, Map<NonTerminals, State>>
type FollowTable = Map<NonTerminals, Map<TypeofToken | ReservedWords, null>>

export { ActionTable, GotoTable, NonTerminals, Parser, FollowTable, Action }
