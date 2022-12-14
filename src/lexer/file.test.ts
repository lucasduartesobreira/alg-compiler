import mock from 'mock-fs'
import { Reader } from './file'

const content = 'content'
const contentWithBreak = 'content\nwith line break'

beforeEach(function () {
  mock({
    'path/with/content': {
      'file.txt': 'wrong extension',
      'content.alg': content,
      'content_with_break_line.alg': contentWithBreak
    }
  })
})
afterEach(mock.restore)

describe('Testing Reader', () => {
  test('wrong file extension', () => {
    const wrongPathString = 'path/with/content/file.txt'
    const reader = () => Reader(wrongPathString)

    expect(reader).toThrowError('Arquivo de extensão não reconhecido: .txt')
  })

  test('read content', () => {
    const reader = Reader('path/with/content/content.alg')
    const response = { char: 'c', charNumber: 0, column: 1, line: 1 }

    expect(reader.nextChar()).toEqual(response)
  })

  test('read sequential nextChar', () => {
    const reader = Reader('path/with/content/content.alg')
    const response = { char: 'c', charNumber: 0, column: 1, line: 1 }
    const secondResponse = { char: 'o', charNumber: 1, column: 2, line: 1 }
    const thirdResponse = { char: 'n', charNumber: 2, column: 3, line: 1 }

    expect(reader.nextChar()).toEqual(response)
    expect(reader.nextChar()).toEqual(secondResponse)
    expect(reader.nextChar()).toEqual(thirdResponse)
  })

  test('should return EOF', () => {
    const reader = Reader('path/with/content/content.alg')
    const response = { char: 'EOF', charNumber: 6, column: 7, line: 1 }

    for (let i = 0; i < content.length; i++) {
      reader.nextChar()
    }

    expect(reader.nextChar()).toEqual(response)
  })

  test('should return break line and column', () => {
    const reader = Reader('path/with/content/content_with_break_line.alg')
    const response = { char: '\n', charNumber: 7, column: 8, line: 1 }

    for (let i = 0; i < content.length; i++) {
      reader.nextChar()
    }

    expect(reader.nextChar()).toEqual(response)
  })
})
