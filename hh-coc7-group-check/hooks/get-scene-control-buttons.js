import HHGroupCheckDialog from '../apps/group-check-dialog.js'

/**
 * Get Scene Control Buttons, adds the group check tool to the system's Keeper's tools
 * @param {SceneControl} controls
 */
export default function (controls) {
  if (!game.user.isGM) {
    return
  }
  const tool = {
    button: true,
    icon: 'fa-solid fa-users',
    name: 'hh-group-check',
    title: 'HHGROUPCHECK.Title',
    onChange: () => HHGroupCheckDialog.create()
  }
  if (Array.isArray(controls)) {
    /* // FoundryVTT v12 */
    const menu = controls.find(c => c.name === 'coc7menu')
    if (Array.isArray(menu?.tools)) {
      tool.onClick = tool.onChange
      menu.tools.push(tool)
    }
  } else if (typeof controls.coc7menu?.tools !== 'undefined') {
    controls.coc7menu.tools['hh-group-check'] = tool
  }
}
