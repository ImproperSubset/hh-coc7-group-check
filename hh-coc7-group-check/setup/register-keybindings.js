import { FOLDER_ID } from '../constants.js'
import HHGroupCheckDialog from '../apps/group-check-dialog.js'

/**
 * Register module key bindings
 */
export default function () {
  game.keybindings.register(FOLDER_ID, 'openGroupCheck', {
    name: 'HHGROUPCHECK.Title',
    editable: [
      {
        key: 'KeyG',
        modifiers: ['Shift']
      }
    ],
    restricted: true,
    onDown: () => {
      HHGroupCheckDialog.create()
      return true
    }
  })
}
