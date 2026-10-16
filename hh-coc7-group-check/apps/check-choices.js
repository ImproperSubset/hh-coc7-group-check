export default class HHCheckChoices {
  /**
   * Group keys in display order
   * @returns {object}
   */
  static get GROUP () {
    return {
      FREQUENT: 'frequent',
      SKILL: 'skill',
      CHARACTERISTIC: 'characteristic'
    }
  }

  /**
   * Comparable form of a check name, matching how the system compares skill names
   * @param {string} text
   * @returns {string}
   */
  static normalize (text) {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase()
  }

  /**
   * Split the comma-separated frequent checks setting
   * @param {string} text
   * @returns {Array<string>}
   */
  static parseFrequent (text) {
    return (text ?? '').split(',').map(t => t.trim()).filter(t => t.length > 0)
  }

  /**
   * Build the grouped dropdown list, with frequent checks first in setting order
   * @param {Array<object>} entries {value, label, group, aliases}
   * @param {Array<string>} frequentNames
   * @returns {object} {groups, selected}
   */
  static build (entries, frequentNames) {
    const used = new Set()
    const frequent = []
    for (const name of frequentNames) {
      const wanted = HHCheckChoices.normalize(name)
      const entry = entries.find(e => !used.has(e.value) && e.aliases.some(a => HHCheckChoices.normalize(a) === wanted))
      if (entry) {
        used.add(entry.value)
        frequent.push(entry)
      }
    }
    const skills = entries
      .filter(e => e.group === HHCheckChoices.GROUP.SKILL && !used.has(e.value))
      .sort((a, b) => a.label.localeCompare(b.label))
    const characteristics = entries.filter(e => e.group === HHCheckChoices.GROUP.CHARACTERISTIC && !used.has(e.value))
    const groups = [
      { key: HHCheckChoices.GROUP.FREQUENT, label: 'HHGROUPCHECK.Frequent', choices: frequent },
      { key: HHCheckChoices.GROUP.SKILL, label: 'CoC7.Skills', choices: skills },
      { key: HHCheckChoices.GROUP.CHARACTERISTIC, label: 'CoC7.Characteristics', choices: characteristics }
    ].filter(g => g.choices.length > 0)
    return {
      groups,
      selected: groups[0]?.choices[0]?.value
    }
  }

  /**
   * Split a dropdown value into its check type and key
   * @param {string} value
   * @returns {object} {type, key}
   */
  static parseValue (value) {
    const offset = value.indexOf(':')
    return {
      type: value.substring(0, offset),
      key: value.substring(offset + 1)
    }
  }
}
