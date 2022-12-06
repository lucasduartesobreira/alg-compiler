type Reader = {
  nextChar(): { char: string; charNumber: number }
}

type ReaderConstructor = (path: string) => Reader

export { Reader, ReaderConstructor }
