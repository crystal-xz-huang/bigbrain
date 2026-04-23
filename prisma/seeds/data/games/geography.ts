import { CategoryNameEnum } from '@/lib/definitions/constants';
import type { GameSeedTemplate } from '@/lib/definitions/types';
import { GameStatus, GameVisibility, QuestionType } from '@prisma/client';
import {
  type Country,
  Continents,
  countries,
  Images,
} from '@prisma/seeds/definitions/countries';

/***************************************************************
                     Helper Functions
***************************************************************/

function toGuessCountryByFlagQuestion(c: Country) {
  // Alternate between TYPE_ANSWER and SINGLE question types
  const type =
    countries.indexOf(c) % 2 === 0
      ? QuestionType.TYPE_ANSWER
      : QuestionType.SINGLE;
  const options = [{ title: c.country, correct: true }];

  if (type === QuestionType.SINGLE) {
    // Randomly select 3 other countries
    options.push(
      ...countries
        .filter((other) => other.country !== c.country)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map((other) => ({ title: other.country, correct: false }))
    );
  }
  return {
    title: 'Guess the country:',
    image: c.flag,
    type: type,
    answers: options,
  };
}

function toGuessCapitalOfCountryQuestion(c: Country) {
  const multiple_capitals = c.capital.length > 1;
  const cities = c.cities.length;
  const options = c.capital.map((title) => ({ title, correct: true }));
  const type = multiple_capitals
    ? QuestionType.MULTIPLE
    : cities > 0
    ? QuestionType.SINGLE
    : QuestionType.TYPE_ANSWER;
  if (cities > 0) {
    options.push(...c.cities.map((title) => ({ title, correct: false })));
  }
  return {
    title: `What is the capital of ${c.country}?`,
    image: c.flag,
    type: type,
    answers: options,
  };
}

function toSelectContinentOfCountryQuestion(c: Country) {
  return {
    title: `What continent is ${c.country} on?`,
    image: c.flag,
    type: QuestionType.SINGLE,
    answers: Object.values(Continents).map((continent) => ({
      title: continent,
      correct: continent === c.continent,
    })),
  };
}

/***************************************************************
                     Geography Games
***************************************************************/

const COUNTRY_NAMES = countries.map((c) => c.country).sort();
const TOTAL_COUNTRIES = countries.length;

const guess_country_by_flag: GameSeedTemplate = {
  name: 'Flags of the World',
  image: Images.GUESS_COUNTRY_BY_FLAG,
  description: `Guess the flags of ${TOTAL_COUNTRIES} countries in the world: from ${
    COUNTRY_NAMES[0]
  } to ${COUNTRY_NAMES[TOTAL_COUNTRIES - 1]}`,
  status: GameStatus.PUBLISHED,
  visibility: GameVisibility.PUBLIC,
  categories: [CategoryNameEnum.GEOGRAPHY],
  tags: ['geography'],
  questions: countries.map(toGuessCountryByFlagQuestion),
};

const guess_capitals_of_country: GameSeedTemplate = {
  name: 'Capitals of the World',
  image: Images.GUESS_CAPITALS_OF_COUNTRY,
  description:
    'Test your knowledge of world capitals with this geography quiz.',
  status: GameStatus.PUBLISHED,
  visibility: GameVisibility.PUBLIC,
  categories: [CategoryNameEnum.GEOGRAPHY],
  tags: ['geography'],
  questions: countries.map(toGuessCapitalOfCountryQuestion),
};

const guess_continent_of_country: GameSeedTemplate = {
  name: 'What Continent is This Country On?',
  image: Images.GUESS_CONTINENT_OF_COUNTRY,
  description: "Here Are 196 Countries — Do You Know The Continent They're On?",
  status: GameStatus.PUBLISHED,
  visibility: GameVisibility.PUBLIC,
  categories: [CategoryNameEnum.GEOGRAPHY],
  tags: ['geography'],
  questions: countries.map(toSelectContinentOfCountryQuestion),
};

export default [
  guess_country_by_flag,
  guess_capitals_of_country,
  guess_continent_of_country,
] satisfies GameSeedTemplate[];
