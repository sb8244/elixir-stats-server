require('jasmine-check').install();

import { decryptPayload, encryptPayload } from './encryption'

check.it('encrypts and decrypts any string', { times: 100 }, gen.string, (str) => {
  const encrypted = encryptPayload(str)
  expect(encrypted.split('--').length).toEqual(2)
  expect(decryptPayload(encrypted)).toEqual(str)
});

describe('encryptPayload', () => {
  it('encrypts simple strings, separating an IV from the payload with --', () => {
    expect(encryptPayload('').split('--').length).toEqual(2)
    expect(encryptPayload('1').split('--').length).toEqual(2)
    expect(encryptPayload('abc').split('--').length).toEqual(2)
  });
});

describe('decryptPayload', () => {
  it('cannot decrypt an empty string', () => {
    expect(() => {
      decryptPayload('')
    }).toThrow('Invalid encrypted payload provided')
  });

  it('cannot decrypt a string with extra --', () => {
    expect(() => {
      decryptPayload('--x--')
    }).toThrow('Invalid encrypted payload provided')
  });

  it('cannot decrypt an invalid string that has --', () => {
    expect(() => {
      decryptPayload('no--still-no')
    }).toThrow('The string to be decoded contains invalid characters.')
  });
});
