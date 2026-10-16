import { DEFAULT_FREQUENT_CHECKS, FOLDER_ID } from '../constants.js'

/**
 * Register module settings
 */
export default function () {
  game.settings.register(FOLDER_ID, 'frequentChecks', {
    name: 'SETTINGS.HHGroupCheckFrequent',
    hint: 'SETTINGS.HHGroupCheckFrequentHint',
    scope: 'world',
    config: true,
    default: DEFAULT_FREQUENT_CHECKS,
    type: String
  })
  game.settings.register(FOLDER_ID, 'whisperRequests', {
    name: 'SETTINGS.HHGroupCheckWhisper',
    hint: 'SETTINGS.HHGroupCheckWhisperHint',
    scope: 'world',
    config: true,
    default: true,
    type: Boolean
  })
}
