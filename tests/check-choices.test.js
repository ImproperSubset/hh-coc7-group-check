import { test } from 'node:test'
import assert from 'node:assert/strict'
import * as fs from 'fs'
import { buildChoices, characteristicEntries, linkSafeReason, parseFrequent, sanLossLink, skillEntries } from '../hh-coc7-group-check/apps/check-choices.js'
import { DEFAULT_FREQUENT_CHECKS } from '../hh-coc7-group-check/constants.js'

const labels = { frequent: 'Frequent', skill: 'Skills', characteristic: 'Characteristics' }
const french = { 'CHARAC.Strength': 'Force', 'CHARAC.STR': 'FOR', 'CoC7.Luck': 'Chance', 'CoC7.Sanity': 'Santé Mentale' }

const entries = [
  ...skillEntries([
    { name: 'Spot Hidden', cocid: 'i.skill.spot-hidden' },
    { name: 'Écouter', cocid: 'i.skill.listen' },
    { name: 'Accounting', cocid: '' },
    { name: 'Bricolage', cocid: '' }
  ]),
  ...characteristicEntries(key => french[key] ?? key)
]

const values = (result, group) => result.choices.filter(c => c.group === group).map(c => c.value)

test('skills sharing a CoC ID merge, whatever they are called', () => {
  const skills = skillEntries([
    { name: 'Spot Hidden', cocid: 'i.skill.spot-hidden' },
    { name: 'Trouver Objet Caché', cocid: 'i.skill.spot-hidden' }
  ])
  assert.equal(skills.length, 1)
  assert.equal(skills[0].label, 'Spot Hidden')
  assert.deepEqual(skills[0].aliases, ['Spot Hidden', 'i.skill.spot-hidden', 'Trouver Objet Caché'])
})

test('a skill with no CoC ID merges with a same-named skill that has one, in either order', () => {
  for (const order of [[0, 1], [1, 0]]) {
    const both = [{ name: 'Spot Hidden', cocid: 'i.skill.spot-hidden' }, { name: 'Spot Hidden', cocid: '' }]
    const skills = skillEntries(order.map(i => both[i]))
    assert.equal(skills.length, 1)
    assert.equal(skills[0].cocid, 'i.skill.spot-hidden')
    assert.deepEqual([...skills[0].aliases].sort(), ['Spot Hidden', 'i.skill.spot-hidden'])
  }
})

test('skill names merge ignoring case and accents, and different names stay apart', () => {
  const skills = skillEntries([
    { name: 'Écouter', cocid: '' },
    { name: 'ecouter', cocid: '' },
    { name: 'Language (Latin)', cocid: 'i.skill.language-latin' },
    { name: 'Language (Greek)', cocid: 'i.skill.language-greek' }
  ])
  assert.deepEqual(skills.map(s => s.label), ['Écouter', 'Language (Latin)', 'Language (Greek)'])
})

test('frequent checks come first in setting order and leave their groups', () => {
  const result = buildChoices(entries, ['Chance', 'spot hidden', 'FOR'], labels)
  assert.deepEqual(result.groups, ['Frequent', 'Skills', 'Characteristics'])
  assert.deepEqual(values(result, 'Frequent'), ['attribute:lck', 'skill:i.skill.spot-hidden', 'characteristic:str'])
  assert.deepEqual(values(result, 'Skills'), ['skill:Accounting', 'skill:Bricolage', 'skill:i.skill.listen'])
  assert.ok(!values(result, 'Characteristics').includes('characteristic:str'))
  assert.equal(result.selected, 'attribute:lck')
})

test('Luck matches its English name and key in any language', () => {
  const result = buildChoices(entries, ['Luck', 'lck'], labels)
  assert.deepEqual(values(result, 'Frequent'), ['attribute:lck'])
})

test('empty groups are left out and unknown frequent names are ignored', () => {
  const skillsOnly = skillEntries([{ name: 'Spot Hidden', cocid: 'i.skill.spot-hidden' }])
  const result = buildChoices(skillsOnly, ['Spot Hidden', 'Cthulhu Mythos'], labels)
  assert.deepEqual(result.groups, ['Frequent'])
  assert.deepEqual(result.choices, [{ value: 'skill:i.skill.spot-hidden', label: 'Spot Hidden', group: 'Frequent' }])
})

test('with no frequent checks the first skill is selected', () => {
  const result = buildChoices(entries, [], labels)
  assert.equal(result.groups[0], 'Skills')
  assert.equal(result.selected, 'skill:Accounting')
})

test('accents and case are ignored when matching frequent checks', () => {
  const result = buildChoices(entries, ['ecouter'], labels)
  assert.deepEqual(values(result, 'Frequent'), ['skill:i.skill.listen'])
})

test('a check listed twice in the setting is used once', () => {
  const result = buildChoices(entries, ['Écouter', 'i.skill.listen'], labels)
  assert.deepEqual(values(result, 'Frequent'), ['skill:i.skill.listen'])
})

test('the default frequent checks match by CoC ID whatever the skill is called', () => {
  const result = buildChoices(entries, parseFrequent(DEFAULT_FREQUENT_CHECKS), labels)
  assert.deepEqual(result.choices.filter(c => c.group === 'Frequent').map(c => c.label), ['Spot Hidden', 'Écouter', 'Chance', 'Santé Mentale'])
})

test('setting text is split on commas and trimmed', () => {
  assert.deepEqual(parseFrequent(' Spot Hidden,Listen , ,Luck '), ['Spot Hidden', 'Listen', 'Luck'])
  assert.deepEqual(parseFrequent(''), [])
  assert.deepEqual(parseFrequent(undefined), [])
})

test('Sanity matches its English name and key in any language', () => {
  const result = buildChoices(entries, ['Sanity', 'san', 'santé mentale'], labels)
  assert.deepEqual(values(result, 'Frequent'), ['sanity:san'])
})

test('the sanity loss link carries the loss, reason, difficulty and dice', () => {
  assert.equal(
    sanLossLink({ sanMin: '1', sanMax: '1D6', sanReason: 'Deep One', difficulty: 2, poolModifier: -1 }),
    '@coc7.sanloss[sanMin:1,sanMax:1D6,sanReason:Deep One,difficulty:2,poolModifier:-1]'
  )
})

test('the sanity loss link keeps the reason exactly and defaults the success loss to 0', () => {
  assert.equal(
    sanLossLink({ sanMin: ' ', sanMax: '1D10', sanReason: 'Deep  One ', difficulty: 1, poolModifier: 0 }),
    '@coc7.sanloss[sanMin:0,sanMax:1D10,sanReason:Deep  One ,difficulty:1,poolModifier:0]'
  )
  assert.equal(
    sanLossLink({ sanMin: '0', sanMax: '1D4', sanReason: '', difficulty: -1, poolModifier: 1 }),
    '@coc7.sanloss[sanMin:0,sanMax:1D4,difficulty:-1,poolModifier:1]'
  )
})

test('reasons with characters that break a roll link are not link-safe', () => {
  for (const reason of ['Deep One', 'Byakhee', 'Shoggoth (young)', '', undefined]) {
    assert.equal(linkSafeReason(reason), true, String(reason))
  }
  for (const reason of ['Shoggoth, Elder', 'Cult: Silver Twilight', 'Thing [unseen]', 'Star {spawn}']) {
    assert.equal(linkSafeReason(reason), false, reason)
  }
})

test("the dialog's reason field pattern accepts exactly the link-safe reasons", () => {
  const template = fs.readFileSync(new URL('../static/templates/group-check.hbs', import.meta.url), 'utf8')
  // Browsers compile an input pattern with the v flag, anchored to the whole value
  const pattern = new RegExp('^(?:' + template.match(/name="sanReason"[^>]*pattern="([^"]+)"/)[1] + ')$', 'v')
  for (const reason of ['Deep One', 'Shoggoth (young)', '', 'Shoggoth, Elder', 'Cult: Silver Twilight', 'Thing [unseen]', 'Star {spawn}']) {
    assert.equal(pattern.test(reason), linkSafeReason(reason), reason)
  }
})
