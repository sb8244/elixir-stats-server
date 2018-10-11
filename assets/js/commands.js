import { encryptPayload } from './encryption'

export function allSystemStats(argList) {
  return {
    command_id: randomCommandId(),
    encrypted_command: encryptPayload(getPayload('all_system_stats', argList))
  }
}

export function processList(argList) {
  return {
    command_id: randomCommandId(),
    encrypted_command: encryptPayload(getPayload('process_list', argList))
  }
}

function getPayload(name, argList) {
  const args = argList
    .filter(({ key, value }) => key && value)
    .map(({ key, value }) => `${key}=${value}`)
    .join("&")

  if (args) {
    return `${name}|${args}`
  } else {
    return name
  }
}

function randomCommandId() {
  return Math.random().toString(36).substring(2)
}
