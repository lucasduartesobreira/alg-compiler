import path from 'path'
import { readFileSync } from 'fs'
import { Reader, ReaderConstructor } from './file.types'

const readFile = (path: string) => readFileSync(path, 'utf-8').split('')

const Reader: ReaderConstructor = (pathString: string) => {
  if (path.extname(pathString) != '.alg') {
    throw new Error(
      `Arquivo de extensão não reconhecido: ${path.extname(pathString)}`
    )
  }
  const file = readFile(pathString)
  let iterator = -1
  let line = 1
  let column = 0

  const nextChar = () => {
    if (iterator + 1 === file.length)
      return { char: 'EOF', charNumber: iterator, line: line, column: column }

    iterator++
    column++
    if (file[iterator - 1] === '\n') {
      line++
      column = 0
    }

    return {
      char: file[iterator],
      charNumber: iterator,
      line: line,
      column: column
    }
  }

  return { nextChar: nextChar }
}

export { Reader }
