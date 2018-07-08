import aesjs from 'aes-js'
import { sha256 } from 'js-sha256'

import { stringToAsciiByteArray, asciiByteArrayToString, randomBytes } from './encryption/helpers'

export function decryptPayload(encryptedPayload) {
  const split = encryptedPayload.split('--')

  if (split.length !== 2) { throw new Error('Invalid encrypted payload provided') }

  const base64Iv = split[0];
  const base64Encrypted = split[1];

  const hash = sha256.array('secret')
  const iv = stringToAsciiByteArray(atob(base64Iv))
  const encryptedBytes = stringToAsciiByteArray(atob(base64Encrypted))
  const aesCbc = new aesjs.ModeOfOperation.cbc(hash, iv)
  const decryptedBytes = aesCbc.decrypt(encryptedBytes)
  const unpaddedBytes = aesjs.padding.pkcs7.strip(decryptedBytes)
  const decryptedText = aesjs.utils.utf8.fromBytes(unpaddedBytes)

  return decryptedText
}

export function encryptPayload(payload) {
  const hash = sha256.array('secret')
  const iv = randomBytes(16);
  const textBytes = aesjs.utils.utf8.toBytes(payload);
  const paddedBytesTo16 = aesjs.padding.pkcs7.pad(textBytes);

  const aesCbc = new aesjs.ModeOfOperation.cbc(hash, iv);
  const encryptedBytes = aesCbc.encrypt(paddedBytesTo16);

  const base64Iv = btoa(asciiByteArrayToString(iv))
  const base64Text = btoa(asciiByteArrayToString(encryptedBytes))

  return [base64Iv, base64Text].join('--')
}
