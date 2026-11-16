import { FOLDER_ID, SYSTEM_ID } from '../constants.js'
import { applyLuckImprovement } from '../apps/luck-improvement.js'

/**
 * Update Chat Message Hook, applies a rolled Luck improvement card and makes a whispered group check sanity card public once its SAN roll is made
 * @param {Document} message
 */
export default function (message) {
  applyLuckImprovement(message)
  if (!message.flags?.[FOLDER_ID]?.revealOnRoll || !message.flags?.[SYSTEM_ID]?.load?.sanRolled) {
    return
  }
  // Every client sees the update; one GM makes the change
  if (game.users.activeGM?.isSelf) {
    message.update({ whisper: [], ['flags.' + FOLDER_ID + '.revealOnRoll']: false })
  }
}
