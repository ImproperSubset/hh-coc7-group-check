// The system creates its cards after the call that asks for them returns, so each entry waits for that card.
// Entries expire so a later card for the same actor is not changed.
const LIFETIME = 10000

const pending = new Map()

/**
 * Change the next card of this kind created for this actor
 * @param {string} as the card's flags.CoC7.load.as, such as CoC7Check or CoC7SanCheckCard
 * @param {string} actorUuid
 * @param {object} changes
 * @param {Array<string>} [changes.whisper] users to whisper the card to
 * @param {boolean} [changes.luckImprovement] the card is a Luck improvement roll
 */
export function expectCard (as, actorUuid, changes) {
  pending.set(as + ':' + actorUuid, { ...changes, expires: Date.now() + LIFETIME })
}

/**
 * The changes for this actor's card, if one is expected
 * @param {string} as
 * @param {string} actorUuid
 * @returns {object|undefined} {whisper, luckImprovement}
 */
export function takeExpectedCard (as, actorUuid) {
  const key = as + ':' + actorUuid
  const entry = pending.get(key)
  pending.delete(key)
  return entry && entry.expires > Date.now() ? entry : undefined
}
