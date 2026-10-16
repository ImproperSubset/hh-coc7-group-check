// The system creates its standby card after actor.skillCheck() returns, so each entry waits for that card.
// Entries expire so a later roll for the same actor is not whispered.
const LIFETIME = 10000

const pending = new Map()

/**
 * Whisper the next standby card created for this actor to these users
 * @param {string} actorUuid
 * @param {Array<string>} userIds
 */
export function expectStandbyCard (actorUuid, userIds) {
  pending.set(actorUuid, { userIds, expires: Date.now() + LIFETIME })
}

/**
 * The users to whisper this actor's standby card to, if one is expected
 * @param {string} actorUuid
 * @returns {Array<string>|undefined}
 */
export function takeStandbyWhisper (actorUuid) {
  const entry = pending.get(actorUuid)
  pending.delete(actorUuid)
  return entry && entry.expires > Date.now() ? entry.userIds : undefined
}
