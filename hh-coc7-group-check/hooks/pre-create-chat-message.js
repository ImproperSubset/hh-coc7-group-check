import { FOLDER_ID, SYSTEM_ID } from '../constants.js'
import { takeExpectedCard } from '../apps/expected-cards.js'

/**
 * Pre Create Chat Message Hook, whispers a group check's standby and sanity cards to the actor's players and marks Luck improvement cards
 * @param {Document} document
 * @param {object} data
 */
export default function (document, data) {
  const load = data.flags?.[SYSTEM_ID]?.load
  if (load?.as !== 'CoC7Check' && load?.as !== 'CoC7SanCheckCard') {
    return
  }
  const expected = takeExpectedCard(load.as, load.actorUuid)
  if (!expected) {
    return
  }
  if (expected.luckImprovement) {
    // A closed card offers no buttons that change the roll after it is made
    document.updateSource({ ['flags.' + FOLDER_ID + '.luckImprovement']: true, ['flags.' + SYSTEM_ID + '.load.cardOpen']: false })
  }
  // A card the Keeper's roll mode already made private stays as it is
  if (!expected.whisper || data.whisper?.length > 0 || (load.as === 'CoC7Check' && !load.isStandby)) {
    return
  }
  if (load.as === 'CoC7Check') {
    // A public roll resets whisper to everyone, so the standby card turns public once the player rolls it
    document.updateSource({ whisper: expected.whisper })
  } else {
    // A sanity card keeps its whisper when rolled, so the update hook makes it public
    document.updateSource({ whisper: expected.whisper, ['flags.' + FOLDER_ID + '.revealOnRoll']: true })
  }
}
