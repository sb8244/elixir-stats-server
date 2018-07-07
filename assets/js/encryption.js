import aesjs from 'aes-js'
import { sha256 } from 'js-sha256'

function convertPayloadToString(base64Iv, base64Encrypted) {
  const hash = sha256.array('secret')
  const iv = stringToAsciiByteArray(atob(base64Iv))
  const encryptedBytes = stringToAsciiByteArray(atob(base64Encrypted))
  const aesCbc = new aesjs.ModeOfOperation.cbc(hash, iv)
  const decryptedBytes = aesCbc.decrypt(encryptedBytes)
  const decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes)

  return decryptedText
}

function stringToAsciiByteArray(str) {
  var bytes = []
  for (var i = 0; i < str.length; i++) {
    bytes.push(str.charCodeAt(i))
  }
  return bytes
}

[
  ["cHvxhUgY3E5io6J5VJD6Tg==", "l+ejr1hNt6E7v7g5PTDzfg=="]
].forEach((data) => {
  console.log(convertPayloadToString.apply(window, data))
})
