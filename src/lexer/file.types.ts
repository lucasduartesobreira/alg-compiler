type Reader = {
  nextChar(): { char: string; charNumber: number; line: number; column: number }
}

type ReaderConstructor = (path: string) => Reader

export { Reader, ReaderConstructor }
