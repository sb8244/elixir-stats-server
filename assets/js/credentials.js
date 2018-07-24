export function fetchCredentials() {
  return {
    encryptionSecret: localStorage.encryptionSecret,
    socketConnectSecret: localStorage.socketConnectSecret
  }
}

export function hasFullCredentials() {
  const credentials = fetchCredentials()

  return credentials.encryptionSecret && credentials.socketConnectSecret
}

export function clearCredentials() {
  delete localStorage.encryptionSecret
  delete localStorage.socketConnectSecret
}

export function setCredentials({ encryptionSecret, socketConnectSecret }) {
  localStorage.encryptionSecret = encryptionSecret
  localStorage.socketConnectSecret = socketConnectSecret
}
