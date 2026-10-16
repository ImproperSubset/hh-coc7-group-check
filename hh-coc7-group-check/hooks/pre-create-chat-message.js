import { FOLDER_ID, SYSTEM_ID } from '../constants.js'
import { takeCardWhisper } from '../apps/card-whispers.js'

/**
 * Pre Create Chat Message Hook, whispers a group check's standby and sanity cards to the actor's players
 * @param {Document} document
 * @param {object} data
 */
export default function (document, data) {
  const load = data.flags?.[SYSTEM_ID]?.load
  if (!(load?.as === 'CoC7Check' && load.isStandby) && load?.as !== 'CoC7SanCheckCard') {
    return
  }
  const whisper = takeCardWhisper(load.as, load.actorUuid)
  // A card the Keeper's roll mode already made private stays as it is
  if (!whisper || data.whisper?.length > 0) {
    return
  }
  if (load.as === 'CoC7Check') {
    // A public roll resets whisper to everyone, so the standby card turns public once the player rolls it
    document.updateSource({ whisper })
  } else {
    // A sanity card keeps its whisper when rolled, so the update hook makes it public
    document.updateSource({ whisper, ['flags.' + FOLDER_ID + '.revealOnRoll']: true })
  }
}
