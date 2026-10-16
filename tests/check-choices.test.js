import { test } from 'node:test'
import assert from 'node:assert/strict'
import HHCheckChoices from '../hh-coc7-group-check/apps/check-choices.js'

const entries = [
  { value: 'skill:i.skill.spot-hidden', label: 'Spot Hidden', group: 'skill', aliases: ['Spot Hidden', 'i.skill.spot-hidden'] },
  { value: 'skill:i.skill.listen', label: 'Écouter', group: 'skill', aliases: ['Écouter', 'i.skill.listen'] },
  { value: 'skill:Accounting', label: 'Accounting', group: 'skill', aliases: ['Accounting'] },
  { value: 'skill:Bricolage', label: 'Bricolage', group: 'skill', aliases: ['Bricolage', 'Bricolage'] },
  { value: 'characteristic:pow', label: 'Power', group: 'characteristic', aliases: ['Power', 'POW', 'pow'] },
  { value: 'attribute:lck', label: 'Luck', group: 'characteristic', aliases: ['Luck', 'lck'] }
]

test('frequent checks come first in setting order and leave their groups', () => {
  const { groups, selected } = HHCheckChoices.build(entries, ['Luck', 'spot hidden', 'POW'])
  assert.deepEqual(groups.map(g => g.key), ['frequent', 'skill'])
  assert.deepEqual(groups[0].choices.map(c => c.value), ['attribute:lck', 'skill:i.skill.spot-hidden', 'characteristic:pow'])
  assert.deepEqual(groups[1].choices.map(c => c.value), ['skill:Accounting', 'skill:Bricolage', 'skill:i.skill.listen'])
  assert.equal(selected, 'attribute:lck')
})

test('empty groups are dropped and unknown frequent names are ignored', () => {
  const { groups } = HHCheckChoices.build(entries, ['Luck', 'Power', 'Cthulhu Mythos'])
  assert.deepEqual(groups.map(g => g.key), ['frequent', 'skill'])
})

test('no frequent checks selects the first skill', () => {
  const { groups, selected } = HHCheckChoices.build(entries, [])
  assert.equal(groups[0].key, 'skill')
  assert.equal(selected, 'skill:Accounting')
})

test('accents and case are ignored when matching', () => {
  const { groups } = HHCheckChoices.build(entries, ['ecouter'])
  assert.deepEqual(groups[0].choices.map(c => c.value), ['skill:i.skill.listen'])
})

test('a frequent name listed twice is used once', () => {
  const { groups } = HHCheckChoices.build(entries, ['Écouter', 'i.skill.listen'])
  assert.deepEqual(groups[0].choices.map(c => c.value), ['skill:i.skill.listen'])
})

test('the default frequent checks match by CoC ID whatever the skill is called', () => {
  const { groups } = HHCheckChoices.build(entries, HHCheckChoices.parseFrequent('i.skill.spot-hidden, i.skill.listen, i.skill.library-use, i.skill.psychology, lck'))
  assert.deepEqual(groups[0].choices.map(c => c.label), ['Spot Hidden', 'Écouter', 'Luck'])
})

test('setting text is split on commas and trimmed', () => {
  assert.deepEqual(HHCheckChoices.parseFrequent(' Spot Hidden,Listen , ,Luck '), ['Spot Hidden', 'Listen', 'Luck'])
  assert.deepEqual(HHCheckChoices.parseFrequent(''), [])
})

test('values with colons in the key keep the whole key', () => {
  assert.deepEqual(HHCheckChoices.parseValue('skill:Science: Biology'), { type: 'skill', key: 'Science: Biology' })
})
