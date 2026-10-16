// The system creates its cards after the call that asks for them returns, so each entry waits for that card.
// Entries expire so a later card for the same actor is not whispered.
const LIFETIME = 10000

const pending = new Map()

/**
 * Whisper the next card of this kind created for this actor to these users
 * @param {string} as the card's flags.CoC7.load.as, such as CoC7Check or CoC7SanCheckCard
 * @param {string} actorUuid
 * @param {Array<string>} userIds
 */
export function expectCard (as, actorUuid, userIds) {
  pending.set(as + ':' + actorUuid, { userIds, expires: Date.now() + LIFETIME })
}

/**
 * The users to whisper this actor's card to, if one is expected
 * @param {string} as
 * @param {string} actorUuid
 * @returns {Array<string>|undefined}
 */
export function takeCardWhisper (as, actorUuid) {
  const key = as + ':' + actorUuid
  const entry = pending.get(key)
  pending.delete(key)
  return entry && entry.expires > Date.now() ? entry.userIds : undefined
}
