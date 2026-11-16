import '../styles/hh-coc7-group-check.less'
import HHCreateChatMessage from './hooks/create-chat-message.js'
import HHGetSceneControlButtons from './hooks/get-scene-control-buttons.js'
import HHInit from './hooks/init.js'
import HHPreCreateChatMessage from './hooks/pre-create-chat-message.js'
import HHUpdateChatMessage from './hooks/update-chat-message.js'

Hooks.once('init', HHInit)
Hooks.on('getSceneControlButtons', HHGetSceneControlButtons)
Hooks.on('createChatMessage', HHCreateChatMessage)
Hooks.on('preCreateChatMessage', HHPreCreateChatMessage)
Hooks.on('updateChatMessage', HHUpdateChatMessage)
