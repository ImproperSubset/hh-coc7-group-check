import { FOLDER_ID } from '../constants.js'

/**
 * Apply a rolled Luck improvement card through the system, which refuses a card not yet rolled or already applied.
 * Every client sees the card change; one GM applies it.
 * @param {Document} message
 */
export async function applyLuckImprovement (message) {
  if (!message.flags?.[FOLDER_ID]?.luckImprovement || !game.users.activeGM?.isSelf || typeof game.CoC7?.developLuck !== 'function') {
    return
  }
  await game.CoC7.developLuck(message)
}
