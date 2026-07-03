export class DiceRoller {
  roll(dice: string): { rolls: number[]; total: number } {
    const match = dice.match(/^(\d+)d(\d+)([+-]\d+)?$/i);
    if (!match) throw new Error(`Invalid dice format: ${dice}`);
    
    const count = parseInt(match[1]);
    const sides = parseInt(match[2]);
    const modifier = match[3] ? parseInt(match[3]) : 0;
    
    const rolls: number[] = [];
    for (let i = 0; i < count; i++) {
      rolls.push(Math.floor(Math.random() * sides) + 1);
    }
    const sum = rolls.reduce((a, b) => a + b, 0) + modifier;
    
    return { rolls, total: sum };
  }

  roll4d6DropLowest(): number {
    const rolls = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1);
    rolls.sort((a, b) => a - b);
    return rolls.slice(1).reduce((a, b) => a + b, 0);
  }
}