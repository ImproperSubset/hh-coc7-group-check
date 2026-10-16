import { CHECK_TYPE, GROUP } from '../constants.js'

const CHARACTERISTICS = {
  str: ['CHARAC.Strength', 'CHARAC.STR'],
  con: ['CHARAC.Constitution', 'CHARAC.CON'],
  siz: ['CHARAC.Size', 'CHARAC.SIZ'],
  dex: ['CHARAC.Dexterity', 'CHARAC.DEX'],
  app: ['CHARAC.Appearance', 'CHARAC.APP'],
  int: ['CHARAC.Intelligence', 'CHARAC.INT'],
  pow: ['CHARAC.Power', 'CHARAC.POW'],
  edu: ['CHARAC.Education', 'CHARAC.EDU']
}

/**
 * Lower-case a check name and strip its accents, for matching
 * @param {string} text
 * @returns {string}
 */
export function normalize (text) {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase()
}

/**
 * Split the comma-separated frequent checks setting
 * @param {string} text
 * @returns {Array<string>}
 */
export function parseFrequent (text) {
  return (text ?? '').split(',').map(t => t.trim()).filter(t => t.length > 0)
}

/**
 * One entry per distinct skill, merging skills that share a CoC ID or a name
 * @param {Array<object>} skills {name, cocid} for every skill item of every actor
 * @returns {Array<object>}
 */
export function skillEntries (skills) {
  const entries = []
  const byCocid = new Map()
  const byName = new Map()
  for (const { name, cocid } of skills) {
    let entry = (cocid && byCocid.get(cocid)) || byName.get(normalize(name))
    if (!entry) {
      entry = {
        type: CHECK_TYPE.SKILL,
        value: CHECK_TYPE.SKILL + ':' + (cocid || name),
        label: name,
        group: GROUP.SKILL,
        cocid: '',
        aliases: []
      }
      entries.push(entry)
    }
    if (cocid && !entry.cocid) {
      entry.cocid = cocid
    }
    for (const alias of [name, cocid]) {
      if (alias && !entry.aliases.includes(alias)) {
        entry.aliases.push(alias)
      }
    }
    if (cocid) {
      byCocid.set(cocid, entry)
    }
    byName.set(normalize(name), entry)
  }
  return entries
}

/**
 * The eight characteristics, then Luck and Sanity
 * @param {Function} localize turns a translation key into text
 * @returns {Array<object>}
 */
export function characteristicEntries (localize) {
  const entries = Object.entries(CHARACTERISTICS).map(([key, [name, short]]) => ({
    type: CHECK_TYPE.CHARACTERISTIC,
    value: CHECK_TYPE.CHARACTERISTIC + ':' + key,
    label: localize(name),
    group: GROUP.CHARACTERISTIC,
    key,
    aliases: [localize(name), localize(short), key]
  }))
  entries.push({
    type: CHECK_TYPE.ATTRIBUTE,
    value: CHECK_TYPE.ATTRIBUTE + ':lck',
    label: localize('CoC7.Luck'),
    group: GROUP.CHARACTERISTIC,
    key: 'lck',
    aliases: [localize('CoC7.Luck'), 'Luck', 'lck']
  })
  entries.push({
    type: CHECK_TYPE.SANITY,
    value: CHECK_TYPE.SANITY + ':san',
    label: localize('CoC7.Sanity'),
    group: GROUP.CHARACTERISTIC,
    key: 'san',
    aliases: [localize('CoC7.Sanity'), 'Sanity', 'san']
  })
  return entries
}

/**
 * Build the dropdown options, with frequent checks first in setting order
 * @param {Array<object>} entries from skillEntries and characteristicEntries
 * @param {Array<string>} frequentNames
 * @param {object} groupLabels display label for each GROUP value
 * @returns {object} {choices, groups, selected}
 */
export function buildChoices (entries, frequentNames, groupLabels) {
  const used = new Set()
  const frequent = []
  for (const name of frequentNames) {
    const wanted = normalize(name)
    const entry = entries.find(e => !used.has(e.value) && e.aliases.some(a => normalize(a) === wanted))
    if (entry) {
      used.add(entry.value)
      frequent.push(entry)
    }
  }
  const skills = entries
    .filter(e => e.group === GROUP.SKILL && !used.has(e.value))
    .sort((a, b) => a.label.localeCompare(b.label))
  const characteristics = entries.filter(e => e.group === GROUP.CHARACTERISTIC && !used.has(e.value))
  // Only non-empty groups are listed: Foundry renders an empty optgroup for any group named here
  const grouped = [
    [groupLabels[GROUP.FREQUENT], frequent],
    [groupLabels[GROUP.SKILL], skills],
    [groupLabels[GROUP.CHARACTERISTIC], characteristics]
  ].filter(([, list]) => list.length > 0)
  return {
    choices: grouped.flatMap(([group, list]) => list.map(e => ({ value: e.value, label: e.label, group }))),
    groups: grouped.map(([group]) => group),
    selected: grouped[0]?.[1][0].value
  }
}
