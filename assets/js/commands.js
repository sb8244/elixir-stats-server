import { encryptPayload } from './encryption'

export function allSystemStats() {
  return {
    command_id: randomCommandId(),
    encrypted_command: encryptPayload('all_system_stats')
  }
}

export function processCountStats() {
  return {
    command_id: randomCommandId(),
    encrypted_command: encryptPayload('process_count_stats')
  }
}

function randomCommandId() {
  return Math.random().toString(36).substring(2)
}
