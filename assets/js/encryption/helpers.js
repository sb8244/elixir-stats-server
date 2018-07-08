export function stringToAsciiByteArray(str) {
  var bytes = []
  for (var i = 0; i < str.length; i++) {
    bytes.push(str.charCodeAt(i))
  }
  return bytes
}

export function asciiByteArrayToString(arr) {
  var str = ''
  for (var i = 0; i < arr.length; i++) {
    str += String.fromCharCode(arr[i])
  }
  return str
}

function randomByte() {
  return Math.floor(Math.random() * (255 + 1))
}

export function randomBytes(size) {
  const arr = new Array(16)
  for (let i = 0; i < arr.length; i++) {
    arr[i] = randomByte()
  }
  return arr
}
