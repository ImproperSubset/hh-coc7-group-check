import { SYSTEM_ID } from '../constants.js'
import { takeStandbyWhisper } from '../apps/standby-whispers.js'

/**
 * Pre Create Chat Message Hook, whispers a group check's standby card to the actor's players
 * @param {Document} document
 * @param {object} data
 */
export default function (document, data) {
  const load = data.flags?.[SYSTEM_ID]?.load
  if (load?.as !== 'CoC7Check' || !load.isStandby) {
    return
  }
  const whisper = takeStandbyWhisper(load.actorUuid)
  if (whisper) {
    // A public roll resets whisper to everyone, so the card turns public once the player rolls it
    document.updateSource({ whisper })
  }
}
