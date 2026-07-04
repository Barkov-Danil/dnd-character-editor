import type { Character, StatKey } from '../types';
import { STAT_LABELS } from '../types';
import { calculateModifier, proficiencyBonusFor } from './rulesEngine';

export type RollBreakdownPart =
  | { kind: 'dice'; rolls: number[]; sum: number; notation: string }
  | { kind: 'modifier'; source: string; value: number }
  | { kind: 'literal'; value: number };

export interface RollResult {
  total: number;
  parts: RollBreakdownPart[];
  formula: string;
}

export interface DiceFormulaEntry {
  id: string;
  name: string;
  formula: string;
  category: 'attack' | 'save' | 'damage' | 'skill' | 'other';
  createdAt: number;
}

const STAT_ALIASES: Record<string, StatKey> = {
  'сил': 'STR', 'сила': 'STR', 'str': 'STR',
  'лов': 'DEX', 'ловкость': 'DEX', 'dex': 'DEX',
  'тел': 'CON', 'телосложение': 'CON', 'con': 'CON',
  'инт': 'INT', 'интеллект': 'INT', 'int': 'INT',
  'муд': 'WIS', 'мудрость': 'WIS', 'wis': 'WIS',
  'хар': 'CHA', 'харизма': 'CHA', 'cha': 'CHA',
};

const PROFICIENCY_ALIASES = ['бм', 'проф', 'профессия', 'prof', 'proficiency'];

const DICE_LETTERS = /[dкk]/i;
const WORD_LETTERS = /[a-zа-яё]/i;
const DIGITS = /[0-9]/;

export class FormulaError extends Error {
  constructor(message: string, public position?: number) {
    super(message);
    this.name = 'FormulaError';
  }
}

export const DICE_CATEGORIES = [
  { value: 'attack', label: 'Атака' },
  { value: 'save', label: 'Спас-бросок' },
  { value: 'damage', label: 'Урон' },
  { value: 'skill', label: 'Навык' },
  { value: 'other', label: 'Другое' },
] as const;

function rollDie(sides: number): number {
  return Math.floor(Math.random() * sides) + 1;
}

interface Token {
  type: 'dice' | 'mod' | 'number' | 'op';
  value: string;
  diceData?: { count: number; sides: number };
  modData?: { source: string };
  numData?: number;
}

export function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  const normalized = input.replace(/\s+/g, ' ').trim();
  if (!normalized) throw new FormulaError('Пустая формула');

  let i = 0;
  while (i < normalized.length) {
    const ch = normalized[i];
    if (ch === ' ') { i++; continue; }

    if (ch === '+' || ch === '-') {
      tokens.push({ type: 'op', value: ch });
      i++;
      continue;
    }

    if (DIGITS.test(ch)) {
      let numStr = '';
      while (i < normalized.length && DIGITS.test(normalized[i])) {
        numStr += normalized[i];
        i++;
      }
      if (i < normalized.length && DICE_LETTERS.test(normalized[i])) {
        const diceSymbol = normalized[i];
        i++;
        let sidesStr = '';
        while (i < normalized.length && DIGITS.test(normalized[i])) {
          sidesStr += normalized[i];
          i++;
        }
        if (!sidesStr) {
          throw new FormulaError(`Ожидается число граней после «${numStr}${diceSymbol}»`, i);
        }
        const count = parseInt(numStr, 10);
        const sides = parseInt(sidesStr, 10);
        if (sides < 2 || count < 1) {
          throw new FormulaError(`Некорректный кубик «${count}${diceSymbol}${sides}» (граней ≥ 2, кубиков ≥ 1)`, i);
        }
        tokens.push({ type: 'dice', value: `${count}${diceSymbol}${sides}`, diceData: { count, sides } });
        continue;
      }
      tokens.push({ type: 'number', value: numStr, numData: parseInt(numStr, 10) });
      continue;
    }

    if (DICE_LETTERS.test(ch) && i + 1 < normalized.length && DIGITS.test(normalized[i + 1])) {
      const diceSymbol = ch;
      i++;
      let sidesStr = '';
      while (i < normalized.length && DIGITS.test(normalized[i])) {
        sidesStr += normalized[i];
        i++;
      }
      if (!sidesStr) throw new FormulaError(`Ожидается число граней после «${diceSymbol}»`, i);
      const sides = parseInt(sidesStr, 10);
      if (sides < 2) throw new FormulaError(`Некорректный кубик «${diceSymbol}${sides}» (граней ≥ 2)`, i);
      tokens.push({ type: 'dice', value: `1${diceSymbol}${sides}`, diceData: { count: 1, sides } });
      continue;
    }

    if (WORD_LETTERS.test(ch)) {
      let word = '';
      while (i < normalized.length && WORD_LETTERS.test(normalized[i])) {
        word += normalized[i];
        i++;
      }
      const lower = word.toLowerCase();
      if (PROFICIENCY_ALIASES.includes(lower)) {
        tokens.push({ type: 'mod', value: lower, modData: { source: lower } });
        continue;
      }
      if (STAT_ALIASES[lower]) {
        tokens.push({ type: 'mod', value: lower, modData: { source: lower } });
        continue;
      }
      throw new FormulaError(`Неизвестная переменная «${word}» (сил, лов, тел, инт, муд, хар, бм)`, i - word.length);
    }

    throw new FormulaError(`Неожиданный символ «${ch}»`, i);
  }

  return tokens;
}

function validateGrammar(tokens: Token[]) {
  if (tokens.length === 0) throw new FormulaError('Пустая формула');
  if (tokens[0].type === 'op') throw new FormulaError('Формула не может начинаться со знака «+»/«-»', 0);
  for (let i = 0; i < tokens.length - 1; i++) {
    const curr = tokens[i];
    const next = tokens[i + 1];
    if (curr.type === 'op' && next.type === 'op') {
      throw new FormulaError('Два знака подряд', i);
    }
    if (curr.type !== 'op' && next.type !== 'op') {
      throw new FormulaError('Между элементами нужен «+» или «-»', i);
    }
  }
  if (tokens[tokens.length - 1].type === 'op') {
    throw new FormulaError('Формула не может заканчиваться знаком', tokens.length - 1);
  }
}

export function validateFormula(input: string): void {
  const tokens = tokenize(input);
  validateGrammar(tokens);
}

export interface HighlightSegment {
  raw: string;
  kind: 'dice' | 'stat' | 'prof' | 'number' | 'op' | 'space' | 'unknown';
  valid: boolean;
  error?: string;
}

export function highlightFormula(input: string): HighlightSegment[] {
  const segments: HighlightSegment[] = [];
  if (!input) return segments;

  let i = 0;
  while (i < input.length) {
    const ch = input[i];

    if (ch === ' ' || ch === '\t') {
      let s = '';
      while (i < input.length && (input[i] === ' ' || input[i] === '\t')) { s += input[i]; i++; }
      segments.push({ raw: s, kind: 'space', valid: true });
      continue;
    }

    if (ch === '+' || ch === '-') {
      segments.push({ raw: ch, kind: 'op', valid: true });
      i++;
      continue;
    }

    if (DIGITS.test(ch)) {
      let numStr = '';
      while (i < input.length && DIGITS.test(input[i])) { numStr += input[i]; i++; }
      if (i < input.length && DICE_LETTERS.test(input[i])) {
        const diceSymbol = input[i];
        i++;
        let sidesStr = '';
        while (i < input.length && DIGITS.test(input[i])) { sidesStr += input[i]; i++; }
        if (!sidesStr) {
          segments.push({ raw: numStr + diceSymbol, kind: 'dice', valid: false, error: 'нет числа граней' });
          continue;
        }
        const sides = parseInt(sidesStr, 10);
        const count = parseInt(numStr, 10);
        if (sides < 2 || count < 1) {
          segments.push({ raw: numStr + diceSymbol + sidesStr, kind: 'dice', valid: false, error: 'граней ≥ 2, кубиков ≥ 1' });
          continue;
        }
        segments.push({ raw: numStr + diceSymbol + sidesStr, kind: 'dice', valid: true });
        continue;
      }
      segments.push({ raw: numStr, kind: 'number', valid: true });
      continue;
    }

    if (DICE_LETTERS.test(ch) && i + 1 < input.length && DIGITS.test(input[i + 1])) {
      const diceSymbol = ch;
      i++;
      let sidesStr = '';
      while (i < input.length && DIGITS.test(input[i])) { sidesStr += input[i]; i++; }
      const sides = parseInt(sidesStr, 10);
      if (sides < 2) {
        segments.push({ raw: diceSymbol + sidesStr, kind: 'dice', valid: false, error: 'граней ≥ 2' });
        continue;
      }
      segments.push({ raw: diceSymbol + sidesStr, kind: 'dice', valid: true });
      continue;
    }

    if (WORD_LETTERS.test(ch)) {
      let word = '';
      while (i < input.length && WORD_LETTERS.test(input[i])) { word += input[i]; i++; }
      const lower = word.toLowerCase();
      if (PROFICIENCY_ALIASES.includes(lower)) {
        segments.push({ raw: word, kind: 'prof', valid: true });
        continue;
      }
      if (STAT_ALIASES[lower]) {
        segments.push({ raw: word, kind: 'stat', valid: true });
        continue;
      }
      segments.push({ raw: word, kind: 'unknown', valid: false, error: 'неизвестная переменная' });
      continue;
    }

    segments.push({ raw: ch, kind: 'unknown', valid: false, error: 'неизвестный символ' });
    i++;
  }

  return applyGrammarToSegments(segments);
}

function applyGrammarToSegments(segments: HighlightSegment[]): HighlightSegment[] {
  const SIGNIFICANT: HighlightSegment['kind'][] = ['dice', 'stat', 'prof', 'number', 'unknown'];

  const significant = segments
    .map((s, idx) => ({ s, idx }))
    .filter((x) => SIGNIFICANT.includes(x.s.kind));

  if (significant.length === 0) {
    return segments.map((s) => (s.kind === 'op' ? { ...s, valid: false, error: 'нет элементов' } : s));
  }

  const result = segments.slice();
  const invalidate = (idx: number, msg: string) => {
    result[idx] = { ...result[idx], valid: false, error: msg };
  };

  const firstSig = significant[0];
  const lastSig = significant[significant.length - 1];

  if (segments[firstSig.idx].kind === 'op') {
    invalidate(firstSig.idx, 'формула не может начинаться со знака');
  }
  if (segments[lastSig.idx].kind === 'op') {
    invalidate(lastSig.idx, 'формула не может заканчиваться знаком');
  }

  for (let k = 0; k < significant.length - 1; k++) {
    const a = significant[k];
    const b = significant[k + 1];
    let sawOpBetween = false;
    for (let m = a.idx + 1; m < b.idx; m++) {
      if (segments[m].kind === 'op') { sawOpBetween = true; break; }
    }
    if (a.s.kind === 'op' && b.s.kind === 'op') {
      invalidate(b.idx, 'два знака подряд');
    } else if (a.s.kind !== 'op' && b.s.kind !== 'op' && !sawOpBetween) {
      invalidate(b.idx, 'нужен «+» или «-»');
    }
  }

  return result;
}

export function rollFormula(input: string, character?: Character | null): RollResult {
  const tokens = tokenize(input);
  validateGrammar(tokens);

  const parts: RollBreakdownPart[] = [];
  let total = 0;
  let sign = 1;

  for (const token of tokens) {
    if (token.type === 'op') {
      sign = token.value === '+' ? 1 : -1;
      continue;
    }

    let value = 0;

    if (token.type === 'dice' && token.diceData) {
      const { count, sides } = token.diceData;
      const rolls: number[] = [];
      for (let r = 0; r < count; r++) rolls.push(rollDie(sides));
      const sum = rolls.reduce((a, b) => a + b, 0);
      value = sum;
      parts.push({ kind: 'dice', rolls, sum, notation: token.value });
    } else if (token.type === 'mod' && token.modData) {
      const lexeme = token.modData.source;
      if (PROFICIENCY_ALIASES.includes(lexeme)) {
        const prof = character ? proficiencyBonusFor(character.level) : 0;
        value = prof;
        parts.push({ kind: 'modifier', source: 'бонус мастерства', value: prof });
      } else {
        const statKey = STAT_ALIASES[lexeme];
        if (!statKey) throw new FormulaError(`Неизвестная переменная «${lexeme}»`);
        const statValue = character?.stats[statKey] ?? 10;
        value = calculateModifier(statValue);
        parts.push({ kind: 'modifier', source: STAT_LABELS[statKey], value });
      }
    } else if (token.type === 'number' && token.numData !== undefined) {
      value = token.numData;
      parts.push({ kind: 'literal', value: token.numData });
    }

    total += sign * value;
  }

  return { total, parts, formula: input };
}

export const LEGEND_EXAMPLES = [
  '2d8 + сил + бм',
  'd20 + лов',
  '1d6 + 2',
  '3d6 + лов + бм',
  '1d4 + инт - 1',
];

export const LEGEND_KEYWORDS: Array<{ token: string; description: string }> = [
  { token: 'NdM (NdкM, NкM)', description: 'N кубиков с M гранями (2d8)' },
  { token: 'сил / str', description: 'модификатор силы персонажа' },
  { token: 'лов / dex', description: 'модификатор ловкости' },
  { token: 'тел / con', description: 'модификатор телосложения' },
  { token: 'инт / int', description: 'модификатор интеллекта' },
  { token: 'муд / wis', description: 'модификатор мудрости' },
  { token: 'хар / cha', description: 'модификатор харизмы' },
  { token: 'бм / proficiency', description: 'бонус мастерства персонажа' },
  { token: '+ / -', description: 'сложение или вычитание частей' },
];
