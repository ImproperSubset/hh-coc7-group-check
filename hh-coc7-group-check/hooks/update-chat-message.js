import { FOLDER_ID, SYSTEM_ID } from '../constants.js'

/**
 * Update Chat Message Hook, makes a whispered group check sanity card public once its SAN roll is made
 * @param {Document} message
 */
export default function (message) {
  if (!message.flags?.[FOLDER_ID]?.revealOnRoll || !message.flags?.[SYSTEM_ID]?.load?.sanRolled) {
    return
  }
  // Every client sees the update; one GM makes the change
  if (game.users.activeGM?.isSelf) {
    message.update({ whisper: [], ['flags.' + FOLDER_ID + '.revealOnRoll']: false })
  }
}
