import { CHECK_TYPE, DIFFICULTY, FOLDER_ID, GROUP, SYSTEM_ID } from '../constants.js'
import { buildChoices, characteristicEntries, normalize, parseFrequent, skillEntries } from './check-choices.js'

const CHECK_METHOD = {
  [CHECK_TYPE.ATTRIBUTE]: 'attributeCheck',
  [CHECK_TYPE.CHARACTERISTIC]: 'characteristicCheck',
  [CHECK_TYPE.SKILL]: 'skillCheck'
}

export default class HHGroupCheckDialog extends foundry.applications.api.DialogV2 {
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
    const skills = candidates.actors.flatMap(actor => actor.items
      .filter(item => item.type === 'skill')
      .map(item => ({ name: item.name, cocid: item.flags?.[SYSTEM_ID]?.cocidFlag?.id ?? '' })))
    const entries = [
      ...skillEntries(skills),
      ...characteristicEntries(key => game.i18n.localize(key))
    ]
    const choices = buildChoices(entries, parseFrequent(game.settings.get(FOLDER_ID, 'frequentChecks')), {
      [GROUP.FREQUENT]: game.i18n.localize('HHGROUPCHECK.Frequent'),
      [GROUP.SKILL]: game.i18n.localize('CoC7.Skills'),
      [GROUP.CHARACTERISTIC]: game.i18n.localize('CoC7.Characteristics')
    })
    const data = {
      actors: candidates.actors.map(a => ({
        uuid: a.uuid,
        name: a.name,
        checked: candidates.selected.size === 0 || candidates.selected.has(a.uuid)
      })),
      choices: choices.choices,
      groups: choices.groups,
      selected: choices.selected,
      difficulty: DIFFICULTY[game.settings.get(SYSTEM_ID, 'defaultCheckDifficulty')] ?? DIFFICULTY.regular,
      difficultyTypes: [
        { key: DIFFICULTY.unknown, val: 'CoC7.RollDifficultyUnknownName' },
        { key: DIFFICULTY.regular, val: 'CoC7.RollDifficultyRegular' },
        { key: DIFFICULTY.hard, val: 'CoC7.RollDifficultyHard' },
        { key: DIFFICULTY.extreme, val: 'CoC7.RollDifficultyExtreme' }
      ]
    }
    const options = await this.prompt({
      classes: ['coc7', 'dialog', 'bonus-selection', 'hh-group-check'],
      window: {
        title: game.i18n.localize('HHGROUPCHECK.Title')
      },
      position: {
        width: 480
      },
      rejectClose: false,
      /* // FoundryVTT V12 */
      content: await (foundry.applications.handlebars?.renderTemplate ?? renderTemplate)('modules/' + FOLDER_ID + '/templates/group-check.hbs', data),
      ok: {
        callback: (event, button) => {
          const form = button.form.elements
          return {
            entry: entries.find(e => e.value === form.check.value),
            difficulty: Number(form.difficulty.value),
            poolModifier: form.poolModifier.valueAsNumber,
            actorUuids: [...button.form.querySelectorAll('input[name=actors]:checked')].map(i => i.value)
          }
        }
      }
    })
    if (options?.actorUuids.length > 0) {
      await HHGroupCheckDialog.send(options, candidates.actors)
    }
  }

  /**
   * The actor's skill for this entry, matched the way skillEntries merged them: CoC ID first, then item name
   * @param {Document} actor
   * @param {object} entry
   * @returns {Document|undefined}
   */
  static findSkill (actor, entry) {
    // Not actor.getItemByName: it compares system.skillName, which is empty on some hand-made skills
    const skills = actor.items.filter(item => item.type === 'skill')
    const names = entry.aliases.map(normalize)
    return skills.find(item => entry.cocid && item.flags?.[SYSTEM_ID]?.cocidFlag?.id === entry.cocid) ??
      skills.find(item => names.includes(normalize(item.name)))
  }

  /**
   * What the system's check method needs to roll this entry for this actor
   * @param {Document} actor
   * @param {object} entry
   * @returns {string|undefined} skill item UUID or characteristic/attribute key; undefined when the actor can't make the check
   */
  static checkTarget (actor, entry) {
    switch (entry.type) {
      case CHECK_TYPE.SKILL:
        // skillCheck adds a missing skill to the actor when given a name; given a UUID it rolls that item
        return HHGroupCheckDialog.findSkill(actor, entry)?.uuid
      case CHECK_TYPE.CHARACTERISTIC:
        return actor.system.schema.getField('characteristics')?.getField(entry.key) ? entry.key : undefined
      case CHECK_TYPE.ATTRIBUTE:
        return actor.system.schema.getField('attribs')?.getField(entry.key) ? entry.key : undefined
    }
  }

  /**
   * Start the check for each chosen actor that can make it; player-owned actors get a standby Roll card
   * @param {object} options
   * @param {object} options.entry
   * @param {int} options.difficulty
   * @param {int} options.poolModifier
   * @param {Array<string>} options.actorUuids
   * @param {Array<Document>} actors
   */
  static async send ({ entry, difficulty, poolModifier, actorUuids }, actors) {
    const rolls = []
    const missing = []
    for (const actor of actors.filter(a => actorUuids.includes(a.uuid))) {
      const target = HHGroupCheckDialog.checkTarget(actor, entry)
      if (typeof target === 'undefined') {
        missing.push(actor.name)
      } else {
        rolls.push({ actor, target })
      }
    }
    if (!game.settings.get(SYSTEM_ID, 'stanbyGMRolls') && rolls.some(r => r.actor.hasPlayerOwner)) {
      ui.notifications.warn(game.i18n.format('HHGROUPCHECK.StandbyOff', { setting: game.i18n.localize('SETTINGS.StandbyGMRolls') }))
    }
    for (const { actor, target } of rolls) {
      await actor[CHECK_METHOD[entry.type]](target, true, { difficulty, poolModifier })
    }
    if (missing.length > 0) {
      ui.notifications.info(game.i18n.format('HHGROUPCHECK.MissingCheck', { check: entry.label, names: missing.join(', ') }))
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
