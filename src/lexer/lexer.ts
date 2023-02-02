/* eslint-disable no-constant-condition */
import { Lexema, ReservedWords, Token } from '@/lexer/lexer.types'
import { State, StateInfo } from '@/lexer/automata.types'
import Automata from './automata'
import { Reader } from './file.types'
import { LexerConstructor } from './lexer.types'

const Lexer: LexerConstructor = (reader: Reader) => {
  const symbols = new Map<Lexema, Token>()
  addToSymbols(symbols, 'se')
  addToSymbols(symbols, 'fimse')
  addToSymbols(symbols, 'inicio')
  addToSymbols(symbols, 'varinicio')
  addToSymbols(symbols, 'varfim')
  addToSymbols(symbols, 'escreva')
  addToSymbols(symbols, 'leia')
  addToSymbols(symbols, 'entao')
  addToSymbols(symbols, 'fimse')
  addToSymbols(symbols, 'fim')
  addToSymbols(symbols, 'inteiro')
  addToSymbols(symbols, 'literal')
  addToSymbols(symbols, 'real')

  return {
    scanner: buildScanner(reader, symbols, {
      lexema: '',
      state: 0,
      start: { line: 0, column: 0 },
      end: { line: 0, column: 0 }
    })
  }
}

const addToSymbols = (symbols: Map<Lexema, Token>, word: ReservedWords) => {
  symbols.set(word, {
    classe: word,
    tipo: word,
    lexema: word,
    start: { line: -1, column: -1 },
    end: { line: -1, column: -1 }
  })
}

const isWhitespace = (char: string) =>
  char === ' ' || char === '\n' || char === '\t'

const buildScanner =
  (
    reader: Reader,
    symbols: Map<Lexema, Token>,
    context: {
      lexema: Lexema
      state: State
      start: { line: number; column: number }
      end: { line: number; column: number }
    }
  ) =>
  (): Token => {
    while (true) {
      const { char, line, column } = reader.nextChar()
      const { lexema, state } = context

      const nextState = Automata.nextState(char, state)
      if (nextState === -1) {
        const { accepted, stateInfo } = Automata.acceptState(state)
        const token = generateToken(
          accepted,
          stateInfo,
          lexema,
          symbols,
          context.start,
          context.end
        )

        const finalToken = postProcess(token)

        context.lexema = isWhitespace(char) ? '' : char
        context.state = isWhitespace(char) ? 0 : Automata.nextState(char, 0)
        context.start = { line, column }
        context.end = { line, column }

        if (finalToken) return token

        continue
      }

      if (state === 0 && nextState !== 0) {
        context.lexema = char
        context.state = nextState
        context.start = { line, column }
        context.end = { line, column }
        continue
      }

      context.state = nextState
      context.lexema += char
      context.end = { line, column }
    }
  }

const generateToken = (
  accepted: boolean,
  stateInfo: StateInfo,
  lexema: string,
  symbols: Map<Lexema, Token>,
  start: { line: number; column: number },
  end: { line: number; column: number }
): Token => {
  if (accepted) {
    const { typeOfToken, classOfToken } = stateInfo
    const newToken = {
      classe: classOfToken,
      tipo: typeOfToken,
      lexema: lexema,
      start,
      end
    }

    if (classOfToken === 'ID') {
      const savedIDToken = symbols.get(lexema)
      if (savedIDToken) {
        return { ...savedIDToken, start, end }
      }

      symbols.set(lexema, newToken)
    }

    return newToken
  } else {
    const { typeOfToken, classOfToken, description } = stateInfo

    const errorToken = {
      classe: classOfToken,
      tipo: typeOfToken,
      lexema: lexema,
      start,
      end,
      description
    }

    return errorToken
  }
}

const postProcess = (token: Token): Token | null => {
  if (token.classe === 'COMMENT') {
    return null
  } else if (token.classe === 'ERROR') {
    token.description += `, linha: ${token.start.line} e coluna: ${token.start.column}`
    return token
  }

  return token
}

export { Lexer }
