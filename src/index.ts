import { writeFileSync } from 'fs'
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
    console.log(`Logs do ${path}:`)

    const {
      object: { shouldCreateOBJ, textObject }
    } = Parser.parse(lexer)

    if (shouldCreateOBJ) {
      const newPath = path.replace('.alg', '.c')
      writeFileSync(newPath, textObject)
      console.log(`Arquivo ${newPath} criado`)
    }
    console.log('-------------------------------------')
  }
} catch (error) {
  console.error(error)
}
