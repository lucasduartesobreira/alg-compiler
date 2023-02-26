import { TypeofToken } from '@/lexer/automata.types'
import { Lexema, ReservedWords, Token } from '@/lexer/lexer.types'
import { NonTerminals } from 'src/parser/parser.types'

type RuleIndex = number

type NodeStack = (Omit<Token, 'classe'> & {
  classe: ReservedWords | TypeofToken | NonTerminals
})[]

type SemanticContext = {
  ruleSymbol: NonTerminals
  amountToPopFromStack: number
  ruleIndex: RuleIndex
  textObject: string
  semanticStack: NodeStack
  lastX: number
  symbolTable: Map<Lexema, Token>
  temporaryVariables: Map<
    number,
    {
      identifier: string
      type: 'int' | 'double' | 'literal'
    }
  >
  shouldCreateOBJ: boolean
}
type Executioner = (context: SemanticContext) => SemanticContext
type SemanticRules = Map<RuleIndex, Executioner>

export { Executioner, SemanticRules, RuleIndex, SemanticContext, NodeStack }
