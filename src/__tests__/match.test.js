import match from "../variable"

describe('variable Match with primitive values', () => {
  test('should return then Value when variables matches', () => {
    expect(match(10).by(10).then(100)).toEqual(100)
    expect(match(10.34).by(10.34).then(100)).toEqual(100)
    expect(match("Hello").by("Hello").then(100)).toEqual(100)
    expect(match("my name is Mai Nam").by("my name is Mai Nam").then(100)).toEqual(100)
    expect(match(true).by(true).then(100)).toEqual(100)
    expect(match(false).by(false).then(100)).toEqual(100)
    expect(match(null).by(null).then(100)).toEqual(100)
    expect(match(undefined).by(undefined).then(100)).toEqual(100)
  })
  test('should return false when variables does not matche', () => {
    expect(match(1).by(10).then(100)).toEqual(false)
    expect(match(10.23).by(10.32).then(100)).toEqual(false)
    expect(match("Hello").by("hello").then(100)).toEqual(false)
    expect(match(true).by(false).then(100)).toEqual(false)
    expect(match(false).by(true).then(100)).toEqual(false)
    expect(match(null).by(undefined).then(100)).toEqual(false)
    expect(match(undefined).by(null).then(100)).toEqual(false)
  })
});

describe('Mismatching types', () => {
  test('should fail with mismatching types', () => {
    expect(match(null).by(2).then(100)).toEqual(false)
    expect(match([10]).by(2).then(100)).toEqual(false)
    expect(match("100").by(2).then(100)).toEqual(false)
    expect(match(10.23).by().then("10.23")).toEqual(false)
    expect(match("hi").by(2).then(100)).toEqual(false)
  })
});

describe('Use functions for expression', () => {
  function trueIf10(x) {
    return match(x).by(10).then(true)
  }
  test('match with function', () => {
    expect(trueIf10(10)).toEqual(true)
    expect(trueIf10(100)).toEqual(false)
  })
});

describe('use comparision operators', () => {
  test('match with function', () => {
    expect(match(10 > 20).then(100)).toEqual(false)
    expect(match(10 < 20).then(100)).toEqual(100)
  })
});

describe('with arrays', () => {
  const x = 10;
  const arr = [10, 20, null, undefined, "Hello", x, 20, 30]
  test('exact array matches', () => {
    expect(match(arr).by([10, 20]).then(100)).toEqual(100)
    const y = 20;
    expect(match(arr).by([10, y, null, undefined, "Hello", 10]).then(100)).toEqual(100)
  })
  test('matches if elements in 2nd array matches but has less elements', () => {
    expect(match(arr).by([10]).then(100)).toEqual(100)
  })
  test('wrong elements fails to match', () => {
    expect(match(arr).by([11, 20]).then(100)).toEqual(false)
    expect(match(arr).by([11]).then(100)).toEqual(false)
  })
  test('fails if 2nd array has more elements', () => {
    expect(match([10, 20]).by([10, 20, 30]).then(100)).toEqual(false)
    expect(match([]).by([10, 20, 30]).then(100)).toEqual(false)
  })
  test('two empty array match', () => {
    expect(match([]).by([]).then(100)).toEqual(100)
  })
  test('fails if 2nd array is empty', () => {
    expect(match([10, 20]).by([]).then(100)).toEqual(false)
  })
});

describe('with object', () => {
  const obj = {x: 10, y: 10.23, z: "hello", u: null, v: undefined, w: 20}
  test('passes if values of 2nd object matches with 1st object', () => {
    expect(match(obj).by({x: 10}).then(100)).toEqual(100)
    expect(match(obj).by({u: null, v: undefined}).then(100)).toEqual(100)
  })
  test('wrong elements fails to match', () => {
    expect(match(obj).by({x: 10, y: 10.23, w: 30 }).then(100)).toEqual(false)
    expect(match(obj).by([11]).then(100)).toEqual(false)
  })
  test('two empty objects match', () => {
    expect(match({}).by({}).then(100)).toEqual(100)
  })
  test('fails if 2nd object is empty', () => {
    expect(match({x: 10}).by({}).then(100)).toEqual(false)
  })
});