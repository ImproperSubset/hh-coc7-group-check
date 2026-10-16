import { FOLDER_ID, SYSTEM_ID } from '../constants.js'
import HHCheckChoices from './check-choices.js'

export default class HHGroupCheckDialog extends foundry.applications.api.DialogV2 {
  /**
   * Values the system accepts as check difficulty
   * @returns {object}
   */
  static get difficultyLevel () {
    return {
      unknown: -1,
      regular: 1,
      hard: 2,
      extreme: 3
    }
  }

  /**
   * Check types the dropdown values encode
   * @returns {object}
   */
  static get CHECK_TYPE () {
    return {
      ATTRIBUTE: 'attribute',
      CHARACTERISTIC: 'characteristic',
      SKILL: 'skill'
    }
  }

  /**
   * Actors that can be offered: players' assigned characters plus the actors of selected tokens
   * @returns {object} {actors, selected}
   */
  static candidateActors () {
    const actors = new Map()
    for (const user of game.users.players) {
      if (user.character) {
        actors.set(user.character.uuid, user.character)
      }
    }
    const selected = new Set()
    if (canvas.ready) {
      for (const token of canvas.tokens.controlled) {
        if (token.actor) {
          actors.set(token.actor.uuid, token.actor)
          selected.add(token.actor.uuid)
        }
      }
    }
    return {
      actors: [...actors.values()].sort((a, b) => a.name.localeCompare(b.name)),
      selected
    }
  }

  /**
   * Every check the candidate actors could make
   * @param {Array<Document>} actors
   * @returns {Array<object>}
   */
  static checkEntries (actors) {
    const entries = []
    const skills = new Map()
    for (const actor of actors) {
      for (const item of actor.items) {
        if (item.type === 'skill') {
          // Skills are keyed by CoC ID, which is the same in every language, or by name when they have none
          const key = item.flags?.[SYSTEM_ID]?.cocidFlag?.id || item.name
          if (!skills.has(key)) {
            skills.set(key, item.name)
          }
        }
      }
    }
    for (const [key, name] of skills) {
      entries.push({
        value: HHGroupCheckDialog.CHECK_TYPE.SKILL + ':' + key,
        label: name,
        group: HHCheckChoices.GROUP.SKILL,
        aliases: [name, key]
      })
    }
    const characteristics = {
      str: ['CHARAC.Strength', 'CHARAC.STR'],
      con: ['CHARAC.Constitution', 'CHARAC.CON'],
      siz: ['CHARAC.Size', 'CHARAC.SIZ'],
      dex: ['CHARAC.Dexterity', 'CHARAC.DEX'],
      app: ['CHARAC.Appearance', 'CHARAC.APP'],
      int: ['CHARAC.Intelligence', 'CHARAC.INT'],
      pow: ['CHARAC.Power', 'CHARAC.POW'],
      edu: ['CHARAC.Education', 'CHARAC.EDU']
    }
    for (const [key, [name, short]] of Object.entries(characteristics)) {
      entries.push({
        value: HHGroupCheckDialog.CHECK_TYPE.CHARACTERISTIC + ':' + key,
        label: game.i18n.localize(name),
        group: HHCheckChoices.GROUP.CHARACTERISTIC,
        aliases: [game.i18n.localize(name), game.i18n.localize(short), key]
      })
    }
    entries.push({
      value: HHGroupCheckDialog.CHECK_TYPE.ATTRIBUTE + ':lck',
      label: game.i18n.localize('CoC7.Luck'),
      group: HHCheckChoices.GROUP.CHARACTERISTIC,
      aliases: [game.i18n.localize('CoC7.Luck'), 'Luck', 'lck']
    })
    return entries
  }

  /**
   * Show the Keeper the group check dialog and send the chosen check
   */
  static async create () {
    if (!game.user.isGM) {
      ui.notifications.warn('HHGROUPCHECK.ErrorNotKeeper', { localize: true })
      return
    }
    const candidates = HHGroupCheckDialog.candidateActors()
    if (candidates.actors.length === 0) {
      ui.notifications.warn('HHGROUPCHECK.ErrorNoActors', { localize: true })
      return
    }
    const entries = HHGroupCheckDialog.checkEntries(candidates.actors)
    const choices = HHCheckChoices.build(
      entries,
      HHCheckChoices.parseFrequent(game.settings.get(FOLDER_ID, 'frequentChecks'))
    )
    const data = {
      actors: candidates.actors.map(a => ({
        uuid: a.uuid,
        name: a.name,
        checked: candidates.selected.size === 0 || candidates.selected.has(a.uuid)
      })),
      difficulty: HHGroupCheckDialog.difficultyLevel[game.settings.get(SYSTEM_ID, 'defaultCheckDifficulty')] ?? HHGroupCheckDialog.difficultyLevel.regular,
      difficultyTypes: [
        {
          key: HHGroupCheckDialog.difficultyLevel.unknown,
          val: 'CoC7.RollDifficultyUnknownName'
        },
        {
          key: HHGroupCheckDialog.difficultyLevel.regular,
          val: 'CoC7.RollDifficultyRegular'
        },
        {
          key: HHGroupCheckDialog.difficultyLevel.hard,
          val: 'CoC7.RollDifficultyHard'
        },
        {
          key: HHGroupCheckDialog.difficultyLevel.extreme,
          val: 'CoC7.RollDifficultyExtreme'
        }
      ],
      groups: choices.groups,
      selected: choices.selected,
      options: false
    }
    await this.prompt({
      classes: ['coc7', 'dialog', 'bonus-selection', 'hh-group-check'],
      window: {
        title: game.i18n.localize('HHGROUPCHECK.Title')
      },
      position: {
        width: 480
      },
      rejectClose: false,
      content: await (foundry.applications.handlebars?.renderTemplate ?? renderTemplate)('modules/' + FOLDER_ID + '/templates/group-check.hbs', data),
      ok: {
        callback: (event, button, dialog) => {
          const check = button.form.elements.check.value
          data.options = {
            check,
            label: entries.find(e => e.value === check).label,
            difficulty: Number(button.form.elements.difficulty.value),
            poolModifier: button.form.elements.poolModifier.valueAsNumber,
            actorUuids: [...button.form.querySelectorAll('input[name=actors]:checked')].map(i => i.value)
          }
        }
      }
    })
    if (data.options && data.options.actorUuids.length > 0) {
      await HHGroupCheckDialog.send(data.options, candidates.actors)
    }
  }

  /**
   * Start the check for each chosen actor; player-owned actors get a standby Roll card
   * @param {object} options
   * @param {string} options.check
   * @param {string} options.label
   * @param {int} options.difficulty
   * @param {int} options.poolModifier
   * @param {Array<string>} options.actorUuids
   * @param {Array<Document>} actors
   */
  static async send ({ check, label, difficulty, poolModifier, actorUuids }, actors) {
    if (!game.settings.get(SYSTEM_ID, 'stanbyGMRolls')) {
      ui.notifications.warn(game.i18n.format('HHGROUPCHECK.StandbyOff', { setting: game.i18n.localize('SETTINGS.StandbyGMRolls') }))
    }
    const { type, key } = HHCheckChoices.parseValue(check)
    const rollOptions = { difficulty, poolModifier }
    const missing = []
    for (const actor of actors.filter(a => actorUuids.includes(a.uuid))) {
      switch (type) {
        case HHGroupCheckDialog.CHECK_TYPE.SKILL:
          {
            const skill = actor.getItemByName(key, 'skill')
            if (skill) {
              // skillCheck adds a missing skill to the actor when given a name; given a UUID it rolls that item
              await actor.skillCheck(skill.uuid, true, rollOptions)
            } else {
              missing.push(actor.name)
            }
          }
          break
        case HHGroupCheckDialog.CHECK_TYPE.CHARACTERISTIC:
          if (typeof actor.system.schema.getField('characteristics')?.getField(key) !== 'undefined') {
            await actor.characteristicCheck(key, true, rollOptions)
          } else {
            missing.push(actor.name)
          }
          break
        case HHGroupCheckDialog.CHECK_TYPE.ATTRIBUTE:
          if (typeof actor.system.schema.getField('attribs')?.getField(key) !== 'undefined') {
            await actor.attributeCheck(key, true, rollOptions)
          } else {
            missing.push(actor.name)
          }
          break
      }
    }
    if (missing.length > 0) {
      ui.notifications.info(game.i18n.format('HHGROUPCHECK.MissingCheck', { check: label, names: missing.join(', ') }))
    }
  }

  /**
   * Replace function to allow two icons, matching the system roll dialog
   * @returns {HTMLElement}
   */
  _renderButtons () {
    const button = document.createElement('button')
    button.setAttribute('type', 'submit')
    button.setAttribute('data-action', 'ok')
    button.toggleAttribute('autofocus', true)
    for (let dice = 2; dice > 0; dice--) {
      const i = document.createElement('i')
      i.className = 'fa-solid fa-dice-d10'
      button.appendChild(i)
    }
    const span = document.createElement('span')
    span.innerText = game.i18n.localize('HHGROUPCHECK.Send')
    button.appendChild(span)
    return button.outerHTML
  }
}
