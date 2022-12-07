// This is the API to the automata so that the syntax analyzer can use it
import { Token, TypeofToken } from './lexer.types'

export function tokeniser(input: string): Token[] {
  function lookaheadString(str: string): boolean {
    const parts = str.split('')

    for (let i = 0; i < parts.length; i++) {
      if (input[currentPosition + i] !== parts[i]) {
        return false
      }
    }

    return true
  }

  function lookahead(match: RegExp, matchNext?: RegExp): string[] {
    const bucket: string[] = []

    while (true) {
      const nextIndex = currentPosition + bucket.length
      const nextToken = input[nextIndex]
      if (!nextToken) {
        break
      }
      let m: string | RegExp = match
      if (matchNext && bucket.length) {
        m = matchNext
      }
      if (m && !m.test(nextToken)) {
        break
      }
      bucket.push(nextToken)
    }

    return bucket
  }

  const out: Token[] = []
  let currentPosition = 0

  const tokenStringMap: Array<{
    key: string
    value: Token
  }> = [
    { key: '\n', value: { type: TypeofToken.IGNORAR } },
    { key: 'inicio', value: { type: TypeofToken.inicio } },
    { key: '\n', value: { type: TypeofToken.IGNORAR } },
    { key: 'varinicio', value: { type: TypeofToken.varinicio } },
    { key: '\n', value: { type: TypeofToken.IGNORAR } },
    { key: 'inteiro', value: { type: TypeofToken.inteiro } },
    { key: ';', value: { type: TypeofToken.PT_V } },
    { key: '\n', value: { type: TypeofToken.IGNORAR } },
    { key: 'varfim', value: { type: TypeofToken.varfim } },
    { key: ';', value: { type: TypeofToken.PT_V } },
    { key: '\n', value: { type: TypeofToken.IGNORAR } },
    { key: '<-', value: { type: TypeofToken.OPR } },
    { key: ';', value: { type: TypeofToken.PT_V } },
    { key: '\n', value: { type: TypeofToken.IGNORAR } },
    { key: 'escreva', value: { type: TypeofToken.escreva } },
    { key: ';', value: { type: TypeofToken.PT_V } },
    { key: 'fim', value: { type: TypeofToken.fim } }
  ]

  while (currentPosition < input.length) {
    const currentToken = input[currentPosition]

    if (currentToken === ' ') {
      currentPosition++
      continue
    }

    let didMatch = false

    for (const { key, value } of tokenStringMap) {
      if (!lookaheadString(key)) {
        continue
      }

      out.push(value)
      currentPosition += key.length
      didMatch = true
    }

    if (didMatch) continue

    if (currentToken === "'") {
      currentPosition++

      const bucket = lookahead(/[^']/)

      out.push({
        type: TypeofToken.ConstanteLiteral,
        value: bucket.join('')
      })

      currentPosition += bucket.length + 1

      continue
    }

    const literalRegex = /[a-zA-Z]/
    const literalRegexNext = /[a-zA-Z0-9]/

    if (literalRegex.test(currentToken)) {
      const bucket = lookahead(literalRegex, literalRegexNext)

      out.push({
        type: TypeofToken.Identificador,
        value: bucket.join('')
      })

      currentPosition += bucket.length

      continue
    }
    throw new Error(`Unknown input character: ${currentToken}`)
  }

  console.log(
    tokeniser(`
  inicio
  varinicio
  inteiro A;
  varfim;
  escreva A;
  fim
  `)
  )

  return out
}
