import { Character } from '../../shared/types/character.types';
import { RACES } from '../../shared/constants/races';
import { CLASSES } from '../../shared/constants/classes';

export interface BackgroundTemplate {
  origin: string[];
  talent: string[];
  goal: string[];
  personality: string[];
  flaw: string[];
  bond: string[];
}

export class BackgroundGenerator {
  private templates: BackgroundTemplate;

  constructor() {
    this.templates = this.initializeTemplates();
  }

  private initializeTemplates(): BackgroundTemplate {
    return {
      origin: [
        'Родился в {settlement}, где с детства привык к {environment}',
        'Вырос в {settlement}, среди {people}, где {childhood}',
        'Происходит из {settlement}, где {family}',
        'Его история начинается в {settlement}, где {event}',
        'Родом из {settlement}, где {trait}',
        'Детство прошло в {settlement}, среди {surroundings}',
        'Путь начался в {settlement}, где {circumstance}',
      ],

      talent: [
        'С юных лет проявлял {talent}, что {impact}',
        'Обладает уникальным {talent}, который {effect}',
        'Известен своим {talent}, благодаря которому {result}',
        'Природа наделила его {talent}, что {consequence}',
        'Среди {group} выделяется {talent}, что {outcome}',
        'Его главное достоинство — {talent}, позволяющее {action}',
        'Благодаря {talent} он {achievement}',
      ],

      goal: [
        'Стремится {goal}, чтобы {reason}',
        'Его главная цель — {goal}, ведь {motivation}',
        'Мечтает {goal}, потому что {dream}',
        'Путь приведёт его к {goal}, если {condition}',
        'Он ищет {goal}, чтобы {purpose}',
        'Его судьба — {goal}, и он {action}',
        'Ради {goal} он готов {sacrifice}',
      ],

      personality: [
        'Всегда {trait}, особенно в {situation}',
        'Известен своей {trait}, что {effect}',
        'Слывёт {trait} человеком, который {behavior}',
        'Его {trait} помогает ему {advantage}',
        'Характер отличается {trait}, поэтому {consequence}',
      ],

      flaw: [
        'Его главный недостаток — {flaw}, что {problem}',
        'Страдает от {flaw}, что {hindrance}',
        'Из-за своей {flaw} он {consequence}',
        'Не может совладать с {flaw}, поэтому {result}',
        'Его {flaw} часто приводит к {situation}',
      ],

      bond: [
        'Хранит верность {bond}, ради которых {action}',
        'В памяти всегда {bond}, что {feeling}',
        'Его связывает {bond}, и он {commitment}',
        'Готов защищать {bond}, даже ценой {cost}',
        'Помнит {bond}, что {meaning}',
      ],
    };
  }

  private getSettlement(race: string): string {
    const settlements: Record<string, string[]> = {
      human: ['городе', 'деревне', 'крепости', 'портовом городе', 'столице'],
      elf: ['лесной чаще', 'эльфийском королевстве', 'золотом лесу', 'седых землях'],
      dwarf: ['подземных чертогах', 'горной крепости', 'каменных залах', 'глубинах гор'],
      halfling: ['уютной деревне', 'зелёных холмах', 'мирной общине', 'тихом посёлке'],
      dragonborn: ['драконьих землях', 'огненной пустыне', 'старой империи', 'кровавых землях'],
      gnome: ['лесном поселении', 'скалистых холмах', 'подземной мастерской', 'волшебном саду'],
    };
    const list = settlements[race] || ['мире'];
    return this.random(list);
  }

  private getEnvironment(race: string): string {
    const environments: Record<string, string[]> = {
      human: ['суете городов', 'тишине полей', 'морским ветрам', 'рыночной площади'],
      elf: ['песне ветра', 'шелесту листьев', 'лунному свету', 'древним магиям'],
      dwarf: ['стуку молота', 'отблескам руды', 'подземным рекам', 'горному эху'],
      halfling: ['уюту дома', 'садовым тропам', 'дружеским беседам', 'праздничным пирам'],
      dragonborn: ['огненному дыханию', 'чести предков', 'военному маршу', 'пустынному ветру'],
      gnome: ['хитроумным механизмам', 'алхимическим опытам', 'волшебным огням', 'мастерским хитростям'],
    };
    const list = environments[race] || ['миру'];
    return this.random(list);
  }

  private getPeople(race: string): string {
    const peoples: Record<string, string[]> = {
      human: ['людей', 'странников', 'торговцев', 'воинов', 'земледельцев'],
      elf: ['эльфов', 'древних', 'лесных жителей', 'звёздных певцов'],
      dwarf: ['дварфов', 'горных мастеров', 'каменных стражей', 'глубинных кузнецов'],
      halfling: ['полуросликов', 'малых народов', 'путешественников', 'искателей приключений'],
      dragonborn: ['драконорождённых', 'чешуйчатых воинов', 'огненных наследников'],
      gnome: ['гномов', 'лесных хитрецов', 'подземных мастеров', 'волшебных инженеров'],
    };
    const list = peoples[race] || ['людей'];
    return this.random(list);
  }

  private getTalent(character: Character): string {
    const stats = character.stats;
    const talents: Record<string, string[]> = {
      high_strength: ['невероятной силой', 'богатырской мощью', 'стальной хваткой', 'сокрушительным ударом'],
      high_dexterity: ['молниеносной реакцией', 'кошачьей грацией', 'меткостью стрелка', 'ловкостью акробата'],
      high_constitution: ['железным здоровьем', 'выносливостью горца', 'живучестью зверя', 'стойкостью воина'],
      high_intelligence: ['острым умом', 'энциклопедическими знаниями', 'математическим складом ума', 'аналитическим мышлением'],
      high_wisdom: ['мудростью старца', 'проницательностью следопыта', 'глубиной духа', 'ясновидением'],
      high_charisma: ['обаянием лидера', 'красноречием оратора', 'внушающей уверенностью', 'магнетической личностью'],
    };

    const highestStat = Object.entries(stats).reduce((a, b) => a[1] > b[1] ? a : b);
    const statMap: Record<string, string[]> = {
      STR: talents.high_strength,
      DEX: talents.high_dexterity,
      CON: talents.high_constitution,
      INT: talents.high_intelligence,
      WIS: talents.high_wisdom,
      CHA: talents.high_charisma,
    };

    const talentList = statMap[highestStat[0]] || talents.high_strength;
    return this.random(talentList);
  }

  generateBackground(character: Character): string {
    if (!character.name) throw new Error('У персонажа нет имени');
    if (!character.race) throw new Error('У персонажа нет расы');
    if (!character.class) throw new Error('У персонажа нет класса');
    if (!character.stats) throw new Error('У персонажа нет характеристик');

    const race = RACES[character.race];
    const classInfo = CLASSES[character.class];
    const raceName = race?.name || character.race;
    const className = classInfo?.name || character.class;

    const settlement = this.getSettlement(character.race);
    const environment = this.getEnvironment(character.race);
    const people = this.getPeople(character.race);
    const talent = this.getTalent(character);

    const origin = this.renderTemplate(
      this.random(this.templates.origin),
      {
        settlement,
        environment,
        people,
        childhood: this.random(['игре', 'учёбе', 'тренировках', 'приключениях']),
        family: this.random(['семья была известна', 'род славился', 'предки оставили след']),
        event: this.random(['произошло нечто важное', 'случилось событие', 'начался его путь']),
        trait: this.random(['ценили ум', 'уважали силу', 'знали за храбрость']),
        surroundings: this.random(['друзей', 'врагов', 'наставников', 'соперников']),
        circumstance: this.random(['судьба свела', 'жизнь научила', 'обстоятельства заставили']),
      }
    );

    const talentPart = this.renderTemplate(
      this.random(this.templates.talent),
      {
        talent,
        impact: this.random(['выделяло его среди сверстников', 'определило его путь', 'дало преимущество']),
        effect: this.random(['притягивает внимание', 'заставляет уважать', 'даёт преимущество']),
        result: this.random(['добивается успеха', 'достигает целей', 'преодолевает трудности']),
        consequence: this.random(['всегда находит выход', 'помогает другим', 'служит примером']),
        group: this.random(['соратников', 'воинов', 'учёных', 'искателей']),
        outcome: this.random(['заслуживает уважение', 'становится легендой', 'обретает славу']),
        action: this.random(['достигать невозможного', 'преодолевать преграды', 'вдохновлять других']),
        achievement: this.random(['одержал победу', 'нашёл решение', 'совершил подвиг']),
      }
    );

    const goalPart = this.renderTemplate(
      this.random(this.templates.goal),
      {
        goal: this.random([
          'обрести силу, чтобы защитить близких',
          `стать величайшим ${className}`,
          'найти древнее знание',
          'заслужить место в легендах',
          'освободить свой народ',
          'завершить начатое предками',
          'доказать свою ценность',
          'найти ответы на вопросы',
        ]),
        reason: this.random([
          'так велит его долг',
          'это единственный путь',
          'иначе всё было зря',
          'так суждено судьбой',
        ]),
        motivation: this.random([
          'в этом его призвание',
          'иначе он не сможет жить спокойно',
          'это смысл его существования',
        ]),
        dream: this.random([
          'с детства мечтал об этом',
          'это его главная мечта',
          'ради этого он готов на всё',
        ]),
        condition: this.random([
          'если он не свернёт с пути',
          'пройдя все испытания',
          'преодолев все преграды',
        ]),
        purpose: this.random([
          'обрести мир', 'восстановить справедливость',
          'защитить слабых', 'принести свет',
        ]),
        sacrifice: this.random([
          'на всё', 'на риск', 'на одиночество', 'на потери',
        ]),
      }
    );

    const fullBackground = [
      origin,
      talentPart,
      goalPart,
      this.generatePersonality(character),
      this.generateFlaw(character),
      this.generateBond(character),
    ].filter(Boolean).join(' ');

    return fullBackground;
  }

  private generatePersonality(character: Character): string {
    const traits = ['добрый', 'суровый', 'весёлый', 'серьёзный', 'хитрый', 'благородный', 'скромный', 'гордый'];
    const situations = ['опасности', 'беде', 'радости', 'споре', 'битве', 'мире'];
    const effects = ['все уважают', 'ему доверяют', 'его боятся', 'им восхищаются', 'его любят'];
    const behaviors = ['никогда не сдаётся', 'всегда помогает', 'не боится трудностей', 'ценит друзей'];
    const advantages = ['находить общий язык', 'принимать верные решения', 'выходить из сложных ситуаций'];

    return this.renderTemplate(
      this.random(this.templates.personality),
      {
        trait: this.random(traits),
        situation: this.random(situations),
        effect: this.random(effects),
        behavior: this.random(behaviors),
        advantage: this.random(advantages),
        consequence: this.random(['вызывает уважение', 'становится лидером', 'обретает верных друзей']),
      }
    );
  }

  private generateFlaw(character: Character): string {
    const flaws = ['гордыню', 'самоуверенность', 'недоверие', 'безрассудство', 'упрямство', 'жестокость', 'лень', 'зависть'];
    const problems = ['мешает в работе с командой', 'приводит к конфликтам', 'создаёт проблемы'];
    const hindrances = ['он слишком самоуверен', 'не может контролировать себя', 'часто ошибается'];
    const situations = ['серьёзным последствиям', 'потерям', 'разочарованиям'];

    return this.renderTemplate(
      this.random(this.templates.flaw),
      {
        flaw: this.random(flaws),
        problem: this.random(problems),
        hindrance: this.random(hindrances),
        consequence: this.random(['страдает из-за этого', 'теряет близких', 'совершает ошибки']),
        result: this.random(['приходится расплачиваться', 'нужно бороться с собой', 'учиться на ошибках']),
        situation: this.random(situations),
      }
    );
  }

  private generateBond(character: Character): string {
    const bonds = ['друзья', 'семья', 'наставник', 'брат по оружию', 'любимый человек', 'народ'];
    const feelings = ['вдохновляет', 'заставляет двигаться вперёд', 'даёт силы', 'напоминает о цели'];
    const commitments = ['будет защищать до конца', 'предан им безгранично', 'отдаст за них жизнь'];
    const costs = ['собственной жизни', 'всего, что имеет', 'своего счастья'];
    const meanings = ['не даёт ему остановиться', 'придаёт смысл его пути', 'напоминает о человечности'];

    return this.renderTemplate(
      this.random(this.templates.bond),
      {
        bond: this.random(bonds),
        action: this.random(['готов на всё', 'предан до гроба', 'не предаст никогда']),
        feeling: this.random(feelings),
        commitment: this.random(commitments),
        cost: this.random(costs),
        meaning: this.random(meanings),
      }
    );
  }

  private renderTemplate(template: string, variables: Record<string, string>): string {
    let result = template;
    for (const [key, value] of Object.entries(variables)) {
      result = result.replace(new RegExp(`{${key}}`, 'g'), value);
    }
    return result.charAt(0).toUpperCase() + result.slice(1);
  }

  private random<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  generateAndAttach(character: Character): Character {
    const background = this.generateBackground(character);
    return {
      ...character,
      characterSheet: background,
      updatedAt: Date.now(),
    };
  }

  generateOnly(character: Character): string {
    return this.generateBackground(character);
  }
}