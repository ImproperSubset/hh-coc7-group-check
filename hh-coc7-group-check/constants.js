export const FOLDER_ID = 'hh-coc7-group-check'

export const SYSTEM_ID = 'CoC7'

export const DEFAULT_FREQUENT_CHECKS = 'i.skill.spot-hidden, i.skill.listen, i.skill.library-use, i.skill.psychology, lck, san'

export const CHECK_TYPE = {
  ATTRIBUTE: 'attribute',
  CHARACTERISTIC: 'characteristic',
  SANITY: 'sanity',
  SKILL: 'skill'
}

// Dropdown groups, in display order
export const GROUP = {
  FREQUENT: 'frequent',
  SKILL: 'skill',
  CHARACTERISTIC: 'characteristic'
}

// Keys match the system's defaultCheckDifficulty setting; values are what its checks accept
export const DIFFICULTY = {
  unknown: -1,
  regular: 1,
  hard: 2,
  extreme: 3
}
