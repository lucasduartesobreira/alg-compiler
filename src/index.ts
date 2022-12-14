import { Reader } from './lexer/file'
import { Lexer } from './lexer/lexer'

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
    console.log(`Tokens do arquivo de endereço: ${path}`)
    while (true) {
      const { classe, lexema, tipo, description } = lexer.scanner()
      if (description) {
        console.log(
          `Classe: '${classe}', Lexema: '${lexema}', Tipo: ${tipo}, Description: ${description}`
        )
      } else {
        console.log(`Classe: '${classe}', Lexema: '${lexema}', Tipo: ${tipo}`)
      }

      if (classe === 'EOF') break
    }

    console.log('Leitura de tokens finalizada')
    console.log('-------------------------------------')
  }
} catch (error) {
  console.error(error)
}
