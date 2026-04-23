import { CaseType, convertCase } from "@/lib/utils";

type PluralType = 'cardinal' | 'ordinal';

/**
 * Simplified version of Intl.PluralRules that handles cardinal and ordinal pluralization
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules
 */
class PluralRules {
  private type: PluralType;
  private rule: Intl.PluralRules;
  private options: { case: CaseType };
  private suffixes = new Map([
    ['one', 'st'],
    ['two', 'nd'],
    ['few', 'rd'],
    ['other', 'th'],
  ]);

  /**
   * Creates a new PluralRules instance
   * @param type "cardinal" | "ordinal"
   */
  constructor(type: PluralType, options?: { case: CaseType }) {
    this.type = type;
    this.options = options || { case: 'lower' };
    if (type === 'cardinal') {
      this.rule = new Intl.PluralRules('ar-EG');
    } else if (type === 'ordinal') {
      this.rule = new Intl.PluralRules('en-US', { type: 'ordinal' });
    } else {
      throw new Error('Invalid type for PluralRules');
    }
  }

  /**
   * Get the string indicating which plural rule to use for the number
   *
   * @param n The number to base the pluralization on
   * @returns The plural category as a string
   *
   * @example
   * const pr = new PluralRules("cardinal");
   * pr.select(0) // returns "zero"
   * pr.select(1) // returns "one"
   * pr.select(3) // returns "few"
   * pr.select(11) // returns "many"
   *
   * const or = new PluralRules("ordinal");
   * or.select(1) // returns "1st"
   * or.select(2) // returns "2nd"
   * or.select(3) // returns "3rd"
   */
  select(n: number): string {
    if (this.type === 'cardinal') {
      const tag = this.rule.select(n);
      return convertCase(((tag === 'other') ? 'many' : tag), this.options.case);
    } else {
      const rule = this.rule.select(n);
      const suffix = this.suffixes.get(rule);
      return `${n}${suffix}`;
    }
  }

  /**
   * Format a number with the appropriate pluralization
   * @param n The number to base the pluralization on
   * @param word The singular form of the word
   * @param plural The plural form of the word (defaults to word + "s")
   * @paramoptions - Optional case transformation ("upper", "lower", "capitalized", "sentence"). Defaults to "lower".
   * @returns The formatted string
   * @example
   * const pr = new PluralRules("cardinal");
   * pr.format(0, "person", "people") // returns "zero people"
   * pr.format(1, "person", "people") // returns "one person"
   * pr.format(3, "car") // returns "few cars"
   * pr.format(11, "bus") // returns "many buses"
   *
   * const or = new PluralRules("ordinal");
   * or.format(1, "place") // returns "1st place"
   * or.format(2, "place") // returns "2nd place"
   */
  format(
    n: number,
    word: string,
    plural = word + 's',
  ): string {
    if (this.type === 'cardinal') {
      const tag = this.rule.select(n);
      const ret = (tag === 'one') ? `${n} ${word}` : `${n} ${plural}`;
      return convertCase(ret, this.options.case);
    } else {
      const rule = this.rule.select(n);
      const suffix = this.suffixes.get(rule);
      const ret = `${n}${suffix} ${word}`;
      return convertCase(ret, this.options.case);
    }
  }
}


export default PluralRules;