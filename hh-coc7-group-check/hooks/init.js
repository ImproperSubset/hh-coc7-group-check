import { FOLDER_ID } from '../constants.js'
import HHGroupCheckDialog from '../apps/group-check-dialog.js'
import HHRegisterKeybindings from '../setup/register-keybindings.js'
import HHRegisterSettings from '../setup/register-settings.js'

/**
 * Init Hook
 */
export default function () {
  HHRegisterSettings()
  HHRegisterKeybindings()
  game.modules.get(FOLDER_ID).api = {
    groupCheck: () => HHGroupCheckDialog.create()
  }
}
