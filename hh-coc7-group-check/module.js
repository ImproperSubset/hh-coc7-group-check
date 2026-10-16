import '../styles/hh-coc7-group-check.less'
import HHGetSceneControlButtons from './hooks/get-scene-control-buttons.js'
import HHInit from './hooks/init.js'

Hooks.once('init', HHInit)
Hooks.on('getSceneControlButtons', HHGetSceneControlButtons)
