import { applyLuckImprovement } from '../apps/luck-improvement.js'

/**
 * Create Chat Message Hook, applies a Luck improvement card that was rolled when created, as when the system's standby Keeper rolls are off
 * @param {Document} message
 */
export default function (message) {
  applyLuckImprovement(message)
}
