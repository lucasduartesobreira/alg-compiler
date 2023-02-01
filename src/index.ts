/* eslint-disable no-constant-condition */
import { Reader } from './lexer/file'
import { Lexer } from './lexer/lexer'
import { Parser } from './parser/parser'

const args = process.argv

try {
  if (args.length <= 2) {
    throw 'Erro: É necessário o endereço do arquivo para realizar a compilação'
  }

  const slicedArgs = args.slice(2)

  for (const path of slicedArgs) {
    const reader = Reader(path)

    const lexer = Lexer(reader)

    console.log('-------------------------------------')
    console.log(`Reduções feitas no arquivo: ${path}`)

    Parser.parse(lexer)
    console.log('Leitura de tokens finalizada')
    console.log('-------------------------------------')
  }
} catch (error) {
  console.error(error)
}
