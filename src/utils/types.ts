type Either<A, B> = {left: A} | {right: B}

const left = <A, B>(a: A): Either<A, B> => {
  return {left: a}
}

const right = <A, B>(b: B): Either<A, B> => {
  return {right: b}
}

export {
  Either,
  left, right
}
