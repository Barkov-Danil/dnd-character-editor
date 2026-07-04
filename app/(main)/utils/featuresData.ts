export interface FeatureInfo {
  id: string;
  name: string;
  description: string;
  source: 'fighter' | 'wizard' | 'rogue' | 'cleric' | 'shared';
}

export const FEATURES_DATA: Record<string, FeatureInfo> = {
  second_wind: {
    id: 'second_wind', name: 'Второе дыхание', source: 'fighter',
    description: 'Бонусным действием вы восстанавливаете HP, равное 1d10 + уровень воина. Можно использовать 1 раз между длинными отдыхами.',
  },
  fighting_style: {
    id: 'fighting_style', name: 'Боевой стиль', source: 'fighter',
    description: 'Выберите боевой стиль: Стрельба, Защита, Дуэлянт, Великое оружие, Двуручное оружие или Защитник. Даёт постоянный бонус в соответствующих условиях.',
  },
  action_surge: {
    id: 'action_surge', name: 'Действие рывком', source: 'fighter',
    description: 'Начиная с 2 уровня вы получаете одно дополнительное действие в свой ход. Используется 1 раз между короткими/длинными отдыхами, с 17 ур. — 2 раза.',
  },
  martial_archetype: {
    id: 'martial_archetype', name: 'Архетип бойца', source: 'fighter',
    description: 'На 3 уровне выбираете архетип (Чемпион, Боевой мастер, Мистический рыцарь и др.), дающий особые способности и определяющий стиль игры.',
  },
  ability_score_improvement: {
    id: 'ability_score_improvement', name: 'Улучшение характеристики', source: 'shared',
    description: 'Вы можете повысить одну характеристику на 2 (или две на 1), но не выше 20. Альтернативно — взять черту.',
  },
  extra_attack: {
    id: 'extra_attack', name: 'Дополнительная атака', source: 'fighter',
    description: 'С 5 уровня вы можете атаковать дважды (с 11 ур. — трижды, с 15 ур. — четырежды) при действии «Атака».',
  },
  indomitable: {
    id: 'indomitable', name: 'Несокрушимость', source: 'fighter',
    description: 'С 9 уровня можно перебросить проваленный спасбросок, используя результат второго броска. 1 раз между длинными отдыхами.',
  },
  additional_fighting_style: {
    id: 'additional_fighting_style', name: 'Дополнительный боевой стиль', source: 'fighter',
    description: 'Начиная с 10 уровня берёте ещё один боевой стиль (кроме того, что уже имеете).',
  },
  remarkable_athlete: {
    id: 'remarkable_athlete', name: 'Удивительный атлет', source: 'fighter',
    description: 'Прибавка +1 к проверкам Силы (Атлетика, атаки в ближнем бою вне боезапаса); часы работы без утомления.',
  },
  relentless: {
    id: 'relentless', name: 'Действие буйство', source: 'fighter',
    description: 'С 17 уровня, когда вы начинаете ход без Второго дыхания, вы восстановите его, если завершите ход без действия.',
  },

  spellcasting: {
    id: 'spellcasting', name: 'Наложение заклинаний', source: 'wizard',
    description: 'Как действие вы накладываете известное заклинание, использовав ячейку соответствующего уровня. Интеллект — заклинательная характеристика.',
  },
  arcane_recovery: {
    id: 'arcane_recovery', name: 'Арканное восстановление', source: 'wizard',
    description: 'Раз в день во время короткого отдыха восстановите часть ячеек заклинаний (уровень ≤ ваш ур./2).',
  },
  arcane_tradition: {
    id: 'arcane_tradition', name: 'Тайная традиция', source: 'wizard',
    description: 'Выбор школы магии на 2 уровне даёт специализированные способности: Прорицание, Преобразование и т.д.',
  },
  wizard_signature_spells: {
    id: 'wizard_signature_spells', name: 'Подписание чар', source: 'wizard',
    description: 'На 20 уровне выберите 2 заклинания 1-го и 2-го уровней — можете накладывать их без ячеек с минимальной интенсивностью.',
  },

  sneak_attack: {
    id: 'sneak_attack', name: 'Коварная атака', source: 'rogue',
    description: 'Раз за ход, при преимуществе на атаку или союзник рядом с целью, добавляете доп. урон 1d6 (растёт с уровнем: ур.2 — 1d6, ур.5 — 3d6 и т.д.).',
  },
  thieves_cant: {
    id: 'thieves_cant', name: 'Воровской жаргон', source: 'rogue',
    description: 'Скрытый язык воров: слова и символы в обычной речи, передающие сообщения среди своих. Понимание тайных знаков.',
  },
  cunning_action: {
    id: 'cunning_action', name: 'Хитрое действие', source: 'rogue',
    description: 'С 2 уровня бонусным действием можно Сделать рывок, Отойти или Спрятаться. С 14 ур. +IBLE подвеситься скрытно.',
  },
  uncanny_dodge: {
    id: 'uncanny_dodge', name: 'Ускользание', source: 'rogue',
    description: 'Когда по вам попадает атака, реакцией получаете только половину урона. Используется, если видно атакующего.',
  },
  roguish_archetype: {
    id: 'roguish_archetype', name: 'Архетип плута', source: 'rogue',
    description: 'Выбор подкласса на 3 уровне: Вор, Убийца, Арканный фокусник и др. Каждая специализация даёт уникальные фокусы.',
  },
  evasion: {
    id: 'evasion', name: 'Уклонение', source: 'rogue',
    description: 'Провалив спасбросок Лов от эффекта, дающего половинный урон, вы получаете 0; при успехе — половина. Нужна лёгкая/без брони.',
  },
  reliable_talent: {
    id: 'reliable_talent', name: 'Надёжный талант', source: 'rogue',
    description: 'Начиная с 11 уровня на проверках навыков, где вы владеете, выпав 9 или меньше считайте как 10.',
  },
  blind_sense: {
    id: 'blind_sense', name: 'Проницательность противника', source: 'rogue',
    description: 'С 9 уровня, если в 10 футах есть скрытое существо, причём вы его не видите — вы всё равно знаете, где оно.',
  },
  stroke_of_luck: {
    id: 'stroke_of_luck', name: 'Поражающий удар', source: 'rogue',
    description: 'С 20 уровня раз между длинными отдыхами можно превратить промах в попадание, либо провал в успех.',
  },
  elusive: {
    id: 'elusive', name: 'Невидимость', source: 'rogue',
    description: 'Начиная с 18 ур. атаки против вас не получают преимущества, а ваши проверки скрытности не дают другим преимущества.',
  },

  divine_domain: {
    id: 'divine_domain', name: 'Божественный дом', source: 'cleric',
    description: 'На 2 уровне выбираете домен бога (Жизнь, Война, Знание и т.д.), дающий владение, заклинания домена и.Channel Divinity.',
  },
  channel_divinity: {
    id: 'channel_divinity', name: 'Божественная воля', source: 'cleric',
    description: 'Канал божества: используете связь с богом для особых эффектов — Изгнание нежити, Преобразование стихий и др. Восстановление на коротком/длинном отдыхе.',
  },
  turn_undead: {
    id: 'turn_undead', name: 'Изгнание нежити', source: 'cleric',
    description: 'Каналом божества нежить в 30 футов должна убежать, если провалит спасбросок Мудрости. С ростом уровня уничтожаются всё более сильные.',
  },
  destroy_undead_half: { id: 'destroy_undead_half', name: 'Уничтожение нежити (CR 1/2)', source: 'cleric', description: 'Нежить CR 1/2 в радиусе изгнания уничтожается, а не прогоняется.' },
  destroy_undead_1: { id: 'destroy_undead_1', name: 'Уничтожение нежити (CR 1)', source: 'cleric', description: 'Нежить CR 1 и ниже при провале отпр. в мир иной.' },
  destroy_undead_2: { id: 'destroy_undead_2', name: 'Уничтожение нежити (CR 2)', source: 'cleric', description: 'Уничтожается нежить CR 2 и ниже.' },
  destroy_undead_3: { id: 'destroy_undead_3', name: 'Уничтожение нежити (CR 3)', source: 'cleric', description: 'Уничтожается нежить CR 3 и ниже.' },
  destroy_undead_4: { id: 'destroy_undead_4', name: 'Уничтожение нежити (CR 4)', source: 'cleric', description: 'Уничтожается нежить CR 4 и ниже.' },
  destroy_undead_5: { id: 'destroy_undead_5', name: 'Уничтожение нежити (CR 5)', source: 'cleric', description: 'Уничтожается нежить CR 5 и ниже.' },
  destroy_undead_6: { id: 'destroy_undead_6', name: 'Уничтожение нежити (CR 6)', source: 'cleric', description: 'Уничтожается нежить CR 6 и ниже.' },
  divine_intervention: {
    id: 'divine_intervention', name: 'Божественное вмешательство', source: 'cleric',
    description: 'С 10 уровня, призывая божество, можете добиться чудесного эффекта. Шанс ур.%. С 20 ур. срабатывает всегда.',
  },
  divine_strike: {
    id: 'divine_strike', name: 'Божественный аналог', source: 'cleric',
    description: 'С 8 уровня один раз за ход добавляете 1d8 (затем 2d8) к урону оружия — урон типа вашего домена.',
  },
  improved_divine_intervention: {
    id: 'improved_divine_intervention', name: 'Улучшенное божественное вмешательство', source: 'cleric',
    description: 'На 20 уровне вмешательство срабатывает всегда, а не по шкале успеха.',
  },
};

export function getFeatureInfo(name: string): FeatureInfo | undefined {
  const candidates = Object.values(FEATURES_DATA);
  const norm = (s: string) => s.toLowerCase().replace(/[^а-яa-z0-9]/gi, '');
  const target = norm(name);
  return candidates.find((f) => norm(f.name) === target || target.includes(norm(f.name)) || norm(f.name).includes(target));
}
