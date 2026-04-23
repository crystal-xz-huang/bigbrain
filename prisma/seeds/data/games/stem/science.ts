
import { CategoryNameEnum } from '@/lib/definitions/constants';
import type {
  GameSeedTemplate,
  QuestionSeedTemplate,
} from '@/lib/definitions/types';
import { formatOrdinals } from '@/lib/utils';
import { GameStatus, GameVisibility, QuestionType } from '@prisma/client';

/***************************************************************
                     Periodic Table
***************************************************************/

import {
  periodicTableElements,
  type PeriodicTableElement,
} from '@prisma/seeds/definitions/science';

const SYMBOLS = periodicTableElements.map((e) => e.symbol);
const TOTAL_ELEMENTS = periodicTableElements.length;

// Helper functions to create questions
function toGuessSymbolOfElement(
  el: PeriodicTableElement
): QuestionSeedTemplate {
  const hint =
    Math.random() < 0.5
      ? `It's the ${el.atomicNumber}${formatOrdinals(
          el.atomicNumber
        )} element in the periodic table.`
      : `It's a ${el.category} element.`;

  const options = [{ title: el.symbol, correct: true }];
  const similar = SYMBOLS.filter(
    (s) => s !== el.symbol && s[0] === el.symbol[0]
  );
  if (similar.length > 1)
    options.push(...similar.map((s) => ({ title: s, correct: false })));

  return {
    title: `What is the chemical symbol for ${el.name}?`,
    type: options.length > 1 ? QuestionType.SINGLE : QuestionType.TYPE_ANSWER,
    hint: hint,
    answers: options,
  };
}

function toGuessNameOfElement(el: PeriodicTableElement): QuestionSeedTemplate {
  const hint =
    Math.random() < 0.5
      ? `It's the ${el.atomicNumber}${formatOrdinals(
          el.atomicNumber
        )} element in the periodic table.`
      : `It's a ${el.category} element.`;

  const options = [{ title: el.name, correct: true }];
  const similar = periodicTableElements.filter(
    (e) => e.name !== el.name && e.name[0] === el.name[0]
  );
  if (similar.length > 1)
    options.push(...similar.map((e) => ({ title: e.name, correct: false })));

  return {
    title: `What is the chemical element for the symbol ${el.symbol}?`,
    type: options.length > 1 ? QuestionType.SINGLE : QuestionType.TYPE_ANSWER,
    hint: hint,
    answers: options,
  };
}

const periodic_table: GameSeedTemplate = {
  name: 'Periodic Table Quiz',
  description: `Test your knowledge of the ${TOTAL_ELEMENTS} elements in the periodic table!`,
  status: GameStatus.PUBLISHED,
  visibility: GameVisibility.PUBLIC,
  categories: [CategoryNameEnum.STEM],
  tags: ['science', 'chemistry', 'periodic table'],
  questions: [
    ...periodicTableElements.slice(0, Math.floor(TOTAL_ELEMENTS / 2)).map(
      toGuessSymbolOfElement
    ),
    ...periodicTableElements.slice(Math.floor(TOTAL_ELEMENTS / 2)).map(
      toGuessNameOfElement
    ),
  ],
};

const chemistry: GameSeedTemplate = {
  name: 'Chemistry: Acids and Bases',
  description:
    'Test your knowledge of Acids and Bases plus Metals and Non-Metals.',
  status: GameStatus.PUBLISHED,
  visibility: GameVisibility.PUBLIC,
  categories: [CategoryNameEnum.STEM],
  tags: ['science', 'chemistry'],
  questions: [
    {
      title: 'When a metal reacts with a dilute acid, what might you observe?',
      type: QuestionType.SINGLE,
      funfact:
        'Although hydrogen is evolved in this reaction, you cannot observe hydrogen (a colourless gas). The test tube gets hotter as the reaction is exothermic (gives out heat).',
      answers: [
        { title: 'a temperature change', correct: true },
        { title: 'a colour change', correct: false },
        { title: 'a precipitate forming', correct: false },
        { title: 'a gas being produced', correct: false },
      ],
    },
    {
      title:
        'What is the hydronium concentration of a 0.20 Mol L-1 solution of hydrochloric acid?',
      type: QuestionType.SINGLE,
      hint: 'Hydrochloric acid is a strong acid, which means it completely dissociates in water.',
      answers: [
        { title: '0.20 Mol L-1', correct: true },
        { title: '0.10 Mol L-1', correct: false },
        { title: '0.40 Mol L-1', correct: false },
        { title: '0.50 Mol L-1', correct: false },
      ],
    },
    {
      title: 'A base would best be described as:',
      type: QuestionType.SINGLE,
      funfact:
        'In a reaction, the acid donates a proton, and the proton is accepted by the base.',
      answers: [
        { title: 'a proton acceptor', correct: true },
        { title: 'a proton donor', correct: false },
        { title: 'an electron donor', correct: false },
        { title: 'an electron acceptor', correct: false },
      ],
    },
    {
      title:
        'Four elements, with atomic numbers 1, 8, 9 and 12, form chlorides. Which atomic number represents the element which forms the most ionic bond with chlorine?',
      type: QuestionType.SINGLE,
      hint: 'Consider what is required for an ionic bond to form.',
      funfact:
        'Ionic bonds form between metals and non-metals, where the metal donates electrons to the non-metal. Chlorine is a non-metal, so it needs to bond with a metal in order to form an ionic bond. Of the above elements, only magnesium is a metal.',
      answers: [
        { title: '12', correct: true },
        { title: '1', correct: false },
        { title: '8', correct: false },
        { title: '9', correct: false },
      ],
    },
    {
      title:
        'Solid metals are good conductors of electricity because of the mobility of their:',
      type: QuestionType.SINGLE,
      answers: [
        { title: 'electrons', correct: true },
        { title: 'positive charge', correct: false },
        { title: 'neutrons', correct: false },
        { title: 'protons', correct: false },
      ],
    },
    {
      title: 'Which statement about metals is correct?',
      type: QuestionType.SINGLE,
      funfact:
        'Generally, metals have a low electronegativity, which means they do not attract electrons strongly. This allows them to lose electrons easily and form positive ions.',
      answers: [
        {
          title: 'They can bond with non-metals to form ionic compounds.',
          correct: true,
        },
        {
          title: 'They can bond with non-metals to form covalent compounds.',
          correct: false,
        },
        {
          title: 'They can bond with metals to form ionic compounds.',
          correct: false,
        },
        {
          title: 'They can bond with metals to form covalent compounds.',
          correct: false,
        },
      ],
    },
    {
      title: 'Which property of iron is due to metallic bonding?',
      type: QuestionType.SINGLE,
      answers: [
        { title: 'electrical conductivity', correct: true },
        { title: 'magnetic properties', correct: false },
        { title: 'high melting point', correct: false },
        { title: 'high density', correct: false },
      ],
    },
    {
      title: 'A mercury atom has:',
      hint: 'The chemical symbol of mercury is Hg. Consider the position of this element on the periodic table.',
      type: QuestionType.SINGLE,
      answers: [
        { title: 'more protons than a mercury ion', correct: false },
        { title: 'fewer protons than a mercury ion', correct: false },
        { title: 'more electrons than a mercury ion', correct: true },
        { title: 'fewer electrons than a mercury ion', correct: false },
      ],
    },
    {
      title:
        'Which statement about metals and non-metals is true? In a chemical reaction ....',
      hint: 'Compare the electronegativity of metals and non-metals.',
      type: QuestionType.SINGLE,
      answers: [
        {
          title: 'metal atoms neither gain nor lose electrons',
          correct: false,
        },
        { title: 'metal atoms gain electrons', correct: false },
        { title: 'non-metal atoms lose electrons', correct: false },
        { title: 'non-metal atoms gain electrons', correct: true },
      ],
      funfact:
        'We can determine this by considering the electronegativities of metals and non-metals. Generally, metals have lower electronegativities than non-metals. Hence in a reaction, the metal will lose its electrons to the non-metal.',
    },
    {
      title:
        'Which statement is true about the size of atoms compared to their ions?',
      type: QuestionType.SINGLE,
      hint: 'Metals generally lose electrons to become ions, while non-metals generally gain electrons to become ions.',
      answers: [
        { title: 'Metal ions are smaller than their atoms.', correct: true },
        {
          title: 'Non-metal ions are smaller than their atoms.',
          correct: false,
        },
        { title: 'Metal ions are larger than their atoms.', correct: false },
        {
          title: 'Non-metal ions are larger than their atoms.',
          correct: false,
        },
      ],
      funfact:
        'A metal ion is smaller than its atom because the ion has one less electron shell than the atom has.',
    },
    {
      title:
        'In which pair does the first particle have a smaller radius than the second?',
      type: QuestionType.SINGLE,
      hint: 'Consider the electron configuration of each pair.',
      answers: [
        { title: 'Cl- and Br-', correct: true },
        { title: 'Ca and Ca2+', correct: false },
        { title: 'K+ and Na+', correct: false },
        { title: 'Mg2+ and Al3+', correct: false },
      ],
      funfact:
        'Chlorine has 17 protons, while bromine (Br) has 35 protons. They have 17 and 35 electrons, respectively.',
    },
    {
      title:
        'Most metals react with dilute hydrochloric acid. Give the chemical symbol of a metal that does not react with this acid.',
      type: QuestionType.TYPE_ANSWER,
      hint: "Consider the position of hydrogen in the reactivity series, and the position of the metals in relation to it. This is mostly indepedent of the metal's position on the periodic table.",
      answers: [
        { title: 'Cu', correct: true },
        { title: 'Ag', correct: true },
        { title: 'Hg', correct: true },
        { title: 'Au', correct: true },
        { title: 'Pt', correct: true },
        { title: 'Ge', correct: false },
        { title: 'Pd', correct: false },
      ],
      funfact:
        "Any metal below hydrogen in the reactivity series will not displace the hydrogen in the HCl (this means they won't react). Some metals which are below hydrogen in the reactivity series include: Pd, Ge, Pt, Au, Hg, Ag, Cu.",
    },
    {
      title: 'Complete the word equation: sodium + water --> hydrogen + ...',
      type: QuestionType.TYPE_ANSWER,
      hint: 'Write the word equation as the equivalent chemical equation.',
      answers: [
        { title: 'sodium hydroxide', correct: true },
        { title: 'sodium oxide', correct: false },
        { title: 'sodium chloride', correct: false },
        { title: 'sodium bicarbonate', correct: false },
      ],
    },
    {
      title:
        'An example of a metal which produces bubbles with cold water is potassium.  Which of the following is another metal that does this?',
      type: QuestionType.SINGLE,
      hint: 'Consider the reactivity series.',
      answers: [
        { title: 'fluorine', correct: false },
        { title: 'cesium', correct: true },
        { title: 'copper', correct: false },
        { title: 'aluminium', correct: false },
      ],
      funfact:
        'How well a metal reacts in water depends on its reactivity. To react in water, the metal should be above hydrogen in the reactivity series. In this way, the metal will displace the hydrogen in H2O.',
    },
    {
      title: 'Most reactions which involve metal elements are ...',
      type: QuestionType.SINGLE,
      hint: 'Consider common, simple reactions that involve metals. What is the most common mechanism involved in these reactions?',
      answers: [
        { title: 'displacement reactions', correct: true },
        { title: 'combination reactions', correct: false },
        { title: 'decomposition reactions', correct: false },
        { title: 'precipitation reactions', correct: false },
      ],
      funfact:
        'Metals will displace less reactive metals in a metal salt solution.',
    },
    {
      title: 'When metals form compounds, their atoms ...',
      type: QuestionType.SINGLE,
      hint: 'Consider the bonding types in pure metallic compounds and in metal-non-metal compounds.',
      answers: [
        { title: 'lose electron(s) to become anions', correct: false },
        { title: 'gain electron(s) to become cations', correct: false },
        { title: 'lose electron(s) to become cations', correct: true },
        { title: 'gain electron(s) to become anions', correct: false },
      ],
    },
    {
      title: 'The first ionisation energy of an element is the energy ...',
      type: QuestionType.SINGLE,
      hint: 'Ionization is where an atom is dissociated into an ion.',
      answers: [
        { title: 'required to remove an electron from an atom', correct: true },
        { title: 'required to add an electron to an atom', correct: false },
        {
          title: 'released when an electron is added to an atom',
          correct: false,
        },
        {
          title: 'released when an electron is removed from an atom',
          correct: false,
        },
      ],
    },
    {
      title:
        'Which of the four metals, with atomic numbers 11, 12, 19 and 20, has the highest first ionisation energy?',
      type: QuestionType.SINGLE,
      hint: 'Consider the trend in ionisation energy as you move up, and also across, the periodic table.',
      answers: [
        { title: '12', correct: true },
        { title: '11', correct: false },
        { title: '19', correct: false },
        { title: '20', correct: false },
      ],
      funfact:
        'Ionisation energy increases as you move up the periodic table, and also as you move across it from left to right.',
    },
    {
      title:
        'Which of the following statements about the reactivity of metals is true?',
      type: QuestionType.SINGLE,
      hint: 'Consider what the definition of ionisation energy actually is, and how this might relate to reactivity.',
      answers: [
        {
          title:
            'The most reactive metal is the one with the lowest first ionisation energy.',
          correct: true,
        },
        {
          title:
            'The most reactive metal is the one with the highest first ionisation energy.',
          correct: false,
        },
        {
          title:
            'The most reactive metal is the one with the lowest electronegativity.',
          correct: false,
        },
        {
          title:
            'The most reactive metal is the one with the highest electronegativity.',
          correct: false,
        },
      ],
      funfact:
        'The first ionisation energy is a measure of the energy required to remove the first electron from the atom, and make it into an ion. It is therefore easiest to remove an electron from the atom with the lowest first ionisation energy.',
    },
    {
      title:
        'When a freshly scrubbed, shiny aluminium saucepan is left unused in clean air for a few days, it becomes dull due to the formation of a coating on the surface. Name the compound that forms the coating.',
      type: QuestionType.TYPE_ANSWER,
      hint: 'Consider the elements and compounds present in the situation.',
      answers: [
        { title: 'aluminium oxide', correct: true },
        { title: 'aluminium hydroxide', correct: false },
        { title: 'aluminium chloride', correct: false },
        { title: 'aluminium carbonate', correct: false },
      ],
      funfact:
        'Aluminium oxide is a good protective coating for protecting the aluminium from rusting. It is a very thin, yet tough, coating.',
    },
    {
      title:
        'Some metals can react with water.  Name the gas that is formed in this reaction.',
      type: QuestionType.TYPE_ANSWER,
      hint: 'Consider an example, such as the reaction of sodium with water. This sort of reaction is known as a displacement reaction.',
      answers: [
        { title: 'hydrogen', correct: true },
        { title: 'H2', correct: true },
      ],
    },
    {
      title:
        'Which is the the metal with the lowest ionisation energy in Group 13 of the periodic table?',
      type: QuestionType.TYPE_ANSWER,
      answers: [
        { title: 'aluminium', correct: true },
        { title: 'Al', correct: true },
      ],
      funfact:
        'Ionisation energy increases as we go up the periodic table, and also as we move across it from left to right.',
    },
  ],
};

/***************************************************************
                     Animals
***************************************************************/

import {
  getCatBreedComparisonImages,
  getCatBreedImages,
  getDogBreedImages,
} from '@/lib/server';

const dogImagesByBreed = getDogBreedImages();
const catImagesByBreed = getCatBreedImages();
const catBreedComparisonImages = getCatBreedComparisonImages();

function generateGuessTheBreedQuestions(
  animal: string,
  imagesByBreed: Record<string, string[]>
): QuestionSeedTemplate[] {
  const breeds = Object.keys(imagesByBreed).sort();

  return breeds.map((breed) => {
    const answers = [{ title: breed, correct: true }];
    // randomly choose 3 other breeds for options
    const otherBreeds = breeds.filter((b) => b !== breed);
    while (answers.length < 4) {
      const randomBreed =
        otherBreeds[Math.floor(Math.random() * otherBreeds.length)];
      if (!answers.some((o) => o.title === randomBreed)) {
        answers.push({ title: randomBreed, correct: false });
      }
    }

    return {
      title: `What breed is this ${animal}?`,
      image: imagesByBreed[breed][0] || '',
      type: QuestionType.SINGLE,
      answers,
    } satisfies QuestionSeedTemplate;
  });
}

const animals: GameSeedTemplate = {
  name: 'All About Animals',
  description: 'Test your knowledge of animals from around the world.',
  status: GameStatus.PUBLISHED,
  visibility: GameVisibility.PUBLIC,
  categories: [CategoryNameEnum.STEM],
  tags: ['science', 'biology', 'animals'],
  questions: [
    {
      title:
        'Though they sound happy, what animal\'s "laugh" is a reaction to being threatened?',
      type: QuestionType.SINGLE,
      funfact:
        'Hyenas are known for their distinctive "laughing" vocalizations, which are actually a sign of stress or excitement rather than happiness.',
      answers: [
        { title: 'Hyena', correct: true },
        { title: 'Woodpecker', correct: false },
        { title: 'Baboon', correct: false },
        { title: 'Ox', correct: false },
      ],
    },
    {
      title: 'What animal causes the most human deaths each year?',
      type: QuestionType.SINGLE,
      funfact:
        'The deadliest animals are often the smallest, and cause death not through strength, but through disease and toxins.',
      answers: [
        { title: 'Mosquito', correct: true },
        { title: 'Shark', correct: false },
        { title: 'Scorpion', correct: false },
        { title: 'Crocodile', correct: false },
      ],
    },
    {
      title: 'What is the largest land animal?',
      type: QuestionType.SINGLE,
      funfact:
        'The African elephant is widely considered to be the largest land animal in the world, with Asian Elephant being regarded as the second largest land animal.',
      answers: [
        { title: 'Elephant', correct: true },
        { title: 'Giraffe', correct: false },
        { title: 'Hippopotamus', correct: false },
        { title: 'Polar Bear', correct: false },
      ],
    },
    {
      title: 'What is the largest species of bird?',
      type: QuestionType.SINGLE,
      funfact:
        'Ostriches cannot fly and is known for its long neck. They are considered the heaviest bird on earth and reach heights of 2-3 metres when fully grown.',
      answers: [
        { title: 'Ostrich', correct: true },
        { title: 'Emu', correct: false },
        { title: 'Cassowary', correct: false },
        { title: 'Penguin', correct: false },
      ],
    },
    {
      title: 'What is the largest species of rodent?',
      type: QuestionType.SINGLE,
      funfact:
        'The capybara is the largest rodent in the world, native to South America.',
      answers: [
        { title: 'Capybara', correct: true },
        { title: 'Beaver', correct: false },
        { title: 'Porcupine', correct: false },
        { title: 'Guinea Pig', correct: false },
      ],
    },
    {
      title: 'What is the largest creature in the animal kingdom?',
      type: QuestionType.SINGLE,
      funfact:
        'The blue whale is widely regarded as the largest animal in the world.',
      answers: [
        { title: 'Blue Whale', correct: true },
        { title: 'Elephant', correct: false },
        { title: 'Giraffe', correct: false },
        { title: 'Polar Bear', correct: false },
      ],
    },
    {
      title: 'What is the fastest land animal?',
      type: QuestionType.SINGLE,
      funfact:
        'Cheetahs can reach speeds of up to 75 mph (120 km/h) in less than three seconds, though they can only maintain this speed for short distances. Pronghorns, on the other hand, is the fastest long-distance runner that can maintain a speed of 35 mph (56 km/h) over several miles and is even faster over shorter distances.',
      answers: [
        { title: 'Cheetah', correct: true },
        { title: 'Lion', correct: false },
        { title: 'Pronghorn', correct: false },
        { title: 'Greyhound', correct: false },
      ],
    },
    {
      title: 'What is the fastest ocean animal?',
      funfact:
        'Black marlin are reported to reach speeds up to 82 mph (132 km/h). The sailfish is also a top contender, with an estimated speef of around 68 mph (109 km/h).',
      type: QuestionType.SINGLE,
      answers: [
        { title: 'Black Marlin', correct: true },
        { title: 'Sailfish', correct: false },
        { title: 'Swordfish', correct: false },
        { title: 'Mako Shark', correct: false },
      ],
    },
    {
      title: 'What is the fastest creature in the animal kingdom?',
      type: QuestionType.SINGLE,
      funfact:
        'Peregrine falcons are the fastest animal overall, with a diving speed of over 389 km/h (242 mph). Cheetahs, by comparison, can sprint about 71 miles per hour.',
      answers: [
        { title: 'Peregrine Falcon', correct: true },
        { title: 'Cheetah', correct: false },
        { title: 'Horsefly', correct: false },
        { title: 'Black Marlin', correct: false },
      ],
    },
    {
      title:
        'Which dog breed has been found capable of understanding more than a thousand words?',
      type: QuestionType.SINGLE,
      funfact:
        'A South Carolina Border Collie named Chaser earned worldwide fame for being able to recognize and react to 1,022 different nouns.',
      answers: [
        { title: 'Border Collie', correct: true },
        { title: 'German Shepherd', correct: false },
        { title: 'Dobermann', correct: false },
        { title: 'Poodle', correct: false },
      ],
    },
    {
      title:
        'A rattlesnake’s rattle is made of the same material as what human body part?',
      type: QuestionType.SINGLE,
      funfact:
        'Rattlesnake skin contains keratin, the same protein that makes human fingernails. Each time a rattlesnake sheds its skin, keratin collects at the tip of the tail, growing the rattle.',
      answers: [
        { title: 'Fingernail', correct: true },
        { title: 'Teeth', correct: false },
        { title: 'Bone', correct: false },
        { title: 'Earlobe', correct: false },
      ],
    },
    {
      title: 'What is the only mammal that lays eggs?',
      type: QuestionType.SINGLE,
      hint: 'This animal is native to Australia and has a duck-like bill.',
      answers: [
        { title: 'Platypus', correct: true },
        { title: 'Echidna', correct: false },
        { title: 'Kangaroo', correct: false },
        { title: 'Koala', correct: false },
      ],
    },
    {
      title: 'What gives flamingos their pink color?',
      type: QuestionType.SINGLE,
      funfact:
        'Flamingos get their pink (or red or orange) color from carotenoids, pigments found in the algae, larvae, and shrimp that they eat.',
      answers: [
        { title: 'Eating shrimp', correct: true },
        { title: 'Dominant genes', correct: false },
        { title: 'Reaction to sunlight', correct: false },
        { title: 'Mud captured in features', correct: false },
      ],
    },
    {
      title:
        'Which animal species can live in extremes of both heat and cold, from −20 °F to 120 °F?',
      type: QuestionType.SINGLE,
      funfact:
        'Camels have a reputation for being desert animals, and some are able to exist in both extremes of temperature. Bactrian camels (the two-humped variety) have adapted to the tremendous heat of China’s Gobi Desert as well as the bitter cold of the Mongolian steppes.',
      answers: [
        { title: 'Bactrian Camel', correct: true },
        { title: 'Emperor Penguin', correct: false },
        { title: 'Polar Bear', correct: false },
        { title: 'Snow Leopard', correct: false },
      ],
    },
    {
      title: 'The tiniest animal with a backbone is a what?',
      type: QuestionType.SINGLE,
      funfact:
        'On average, the tiny frog Paedophryne amauensis measures only 7.7 millimeters long.',
      answers: [
        { title: 'Frog', correct: true },
        { title: 'Fish', correct: false },
        { title: 'Lizard', correct: false },
        { title: 'Bird', correct: false },
      ],
    },
    {
      title:
        'Growing up to 59 feet (18 meters) long, which is the world’s largest living fish?',
      type: QuestionType.SINGLE,
      funfact:
        'The whale shark is the largest fish alive today. It can grow up to 18 meters long.',
      answers: [
        { title: 'Whale Shark', correct: true },
        { title: 'Great White Shark', correct: false },
        { title: 'Manta Ray', correct: false },
        { title: 'Sailfish', correct: false },
      ],
    },
    {
      title: 'Which of these “fish” is actually a fish?',
      type: QuestionType.SINGLE,
      funfact:
        'The term "fish" is often used to describe a variety of aquatic animals, but not all of them are true fish.',
      answers: [
        { title: 'Swordfish', correct: true },
        { title: 'Jellyfish', correct: false },
        { title: 'Starfish', correct: false },
        { title: 'Crayfish', correct: false },
      ],
    },
    {
      title:
        'An individual animal of which type was found to be at least 272 years old, suggesting that its type includes the world’s longest-living vertebrate?',
      type: QuestionType.SINGLE,
      funfact:
        'Thanks to a slow metabolism adapted to the cold deep waters it inhabits, the Greenland shark is thought to be able to live up to 500 years. ',
      answers: [
        { title: 'Greenland Shark', correct: true },
        { title: 'Bowhead Whale', correct: false },
        { title: 'Galápagos Tortoise', correct: false },
        { title: 'Indian Elephant', correct: false },
      ],
    },
  ],
};

const name_dog_breed: GameSeedTemplate = {
  name: 'Name That Dog!',
  description:
    "If you're reallyyyy a dog person, then you should be able to name at least 90% of these dog breeds. If you get all of these right, you deserve another dog.",
  status: GameStatus.PUBLISHED,
  visibility: GameVisibility.PUBLIC,
  categories: [CategoryNameEnum.STEM],
  tags: ['dogs'],
  questions: generateGuessTheBreedQuestions('dog', dogImagesByBreed),
};

const name_cat_breed: GameSeedTemplate = {
  name: 'Name That Cat!',
  description:
    "How much do you know about our four-legged pals? Test if you're a true cat expert.",
  status: GameStatus.PUBLISHED,
  visibility: GameVisibility.PUBLIC,
  categories: [CategoryNameEnum.STEM],
  tags: ['cats'],
  questions: generateGuessTheBreedQuestions('cat', catImagesByBreed),
};

const cat_breed_comparison: GameSeedTemplate = {
  name: 'Name That Cat! (Hard)',
  image: '/animals/cats/breed_comparison/cover.jpg',
  description:
    'Feline for a challenge? These cat breeds look so similar that you might need to take a closer look.',
  status: GameStatus.PUBLISHED,
  visibility: GameVisibility.PUBLIC,
  categories: [CategoryNameEnum.STEM],
  tags: ['cats'],
  questions: generateGuessTheBreedQuestions('cat', catBreedComparisonImages),
};

/***************************************************************
                     Biology
***************************************************************/

const nervous_system: GameSeedTemplate = {
  name: 'Biology: The Human Nervous System',
  description:
    'Nine questions on the human nervous system, designed for Science students in Year 9 of the Australian National Curriculum.',
  status: GameStatus.PUBLISHED,
  visibility: GameVisibility.PUBLIC,
  categories: [CategoryNameEnum.STEM],
  tags: ['biology', 'nervous system'],
  questions: [
    {
      title:
        'Identify the parts of the body that make up the central nervous system.',
      type: QuestionType.SINGLE,
      funfact:
        'The central nervous system is the brain and the spinal cord. The brain generates the primary control signals, and the spinal cord distributes them.',
      answers: [
        { title: 'Brain and spinal cord', correct: true },
        {
          title: 'Brain, spinal cord and nerve cells throughout the body',
          correct: false,
        },
        { title: 'Brain and peripheral nerves', correct: false },
        { title: 'Brain only', correct: false },
      ],
    },
    {
      title:
        'There are several types of neurons (nerve cells) in the body. Which of these is NOT a type of neuron?',
      type: QuestionType.SINGLE,
      funfact:
        'There is no such thing as a messenger neuron - there are only three types of neurons: motor neurons, sensory neurons, and interneurons.',
      answers: [
        { title: 'Motor neurons', correct: false },
        { title: 'Sensory neurons', correct: false },
        { title: 'Interneurons', correct: false },
        { title: 'Messenger neuron', correct: true },
      ],
    },
    {
      title:
        'Identify the part of the neuron (nerve cell) labelled A in the diagram?',
      image:
        'https://quiz-cdn-prd-01.studiosity.com/uploads/files/5852/larges.jpg?1365779925',
      type: QuestionType.SINGLE,
      answers: [
        { title: 'Dendrites', correct: true },
        { title: 'Axon', correct: false },
        { title: 'Synaptic Knob', correct: false },
        { title: 'Nucleus', correct: false },
      ],
    },
    {
      title:
        'Identify the part of the neuron (nerve cell) labelled B in the diagram?',
      image:
        'https://quiz-cdn-prd-01.studiosity.com/uploads/files/5852/larges.jpg?1365779925',
      type: QuestionType.SINGLE,
      answers: [
        { title: 'Nerve Cell Body', correct: true },
        { title: 'Axon', correct: false },
        { title: 'Synaptic Knob', correct: false },
        { title: 'Nucleus', correct: false },
      ],
    },
    {
      title:
        'Identify the part of the neuron (nerve cell) labelled C in the diagram?',
      image:
        'https://quiz-cdn-prd-01.studiosity.com/uploads/files/5852/larges.jpg?1365779925',
      type: QuestionType.SINGLE,
      answers: [
        { title: 'Nucleus', correct: true },
        { title: 'Synaptic Knob', correct: false },
        { title: 'Nerve Cell', correct: false },
        { title: 'Dendrites', correct: false },
      ],
    },
    {
      title:
        'Identify the part of the neuron (nerve cell) labelled D in the diagram?',
      image:
        'https://quiz-cdn-prd-01.studiosity.com/uploads/files/5852/larges.jpg?1365779925',
      type: QuestionType.SINGLE,
      answers: [
        { title: 'Axon', correct: true },
        { title: 'Synaptic Knob', correct: false },
        { title: 'Axon Branch', correct: false },
        { title: 'Dendrites', correct: false },
      ],
    },
    {
      title:
        'Identify the part of the neuron (nerve cell) labelled E in the diagram?',
      image:
        'https://quiz-cdn-prd-01.studiosity.com/uploads/files/5852/larges.jpg?1365779925',
      type: QuestionType.SINGLE,
      answers: [
        { title: 'Synaptic Knob', correct: true },
        { title: 'Axon Branch', correct: false },
        { title: 'Nerve Cell', correct: false },
        { title: 'Dendrites', correct: false },
      ],
    },
    {
      title:
        'Identify the part of the neuron (nerve cell) labelled F in the diagram?',
      image:
        'https://quiz-cdn-prd-01.studiosity.com/uploads/files/5852/larges.jpg?1365779925',
      type: QuestionType.SINGLE,
      answers: [
        { title: 'Axon Branch', correct: true },
        { title: 'Axon', correct: false },
        { title: 'Nerve Cell', correct: false },
        { title: 'Dendrites', correct: false },
      ],
    },
    {
      title:
        'The nervous system is made up of connecting neurons. Electrical signals pass from one neuron to the next. We call the meeting point between two neurons a ____.',
      type: QuestionType.TYPE_ANSWER,
      answers: [{ title: 'synapse', correct: true }],
      hint: 'It begins with S, and is the junction between two neurons.',
      funfact:
        'The point where electrical signals from one neuron pass to another neuron is called a synapse.',
    },
    {
      title:
        'Name the chemical that is released into the synaptic cleft, the gap between one nerve cell and the next.',
      type: QuestionType.TYPE_ANSWER,
      hint: 'It beings with N, and is responsible for sending the signal across the gap between nerves.',
      answers: [{ title: 'neurotransmitter', correct: true }],
      funfact:
        'The axons of one nerve cell pass the electrical signal across the synaptic gap, with the aid of chemical neurotransmitters, to the dendrites of the next neuron.',
    },
  ],
};

export default [
  periodic_table,
  chemistry,
  nervous_system,
  animals,
  name_dog_breed,
  name_cat_breed,
  cat_breed_comparison,
] satisfies GameSeedTemplate[];
