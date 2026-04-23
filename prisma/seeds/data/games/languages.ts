import { QuestionType, GameStatus, GameVisibility } from '@prisma/client';
import { CategoryNameEnum } from '@/lib/definitions/constants';
import type { GameSeedTemplate, QuestionSeedTemplate } from '@/lib/definitions/types';

/***************************************************************
                     Helper Functions
***************************************************************/

const toTypeCorrectSpellingQuestion = (
  title: string,
  correctSpelling: string
): QuestionSeedTemplate => {
  return {
    title: title,
    type: QuestionType.TYPE_ANSWER,
    answers: [{ title: correctSpelling, correct: true }],
  };
};

const spelling: GameSeedTemplate[] = [
  {
    name: 'Spot the Misspelled Word',
    description:
      'Test your spelling skills with this 10-question quiz. Each question has a sentence with one word that is spelled incorrectly. Write the correct spelling of the word.',
    status: GameStatus.PUBLISHED,
    visibility: GameVisibility.PUBLIC,
    categories: [CategoryNameEnum.LANGUAGES],
    questions: [
      toTypeCorrectSpellingQuestion(
        'Ben was impressed by the combonation of colour and sound effects in the movie.',
        'combination'
      ),
      toTypeCorrectSpellingQuestion(
        'When the teacher told Sam his work was exceptional, he accepted the compliment greatfully.',
        'gratefully'
      ),
      toTypeCorrectSpellingQuestion(
        'The tencion in the belaying rope must be enough so you do not fall if you slip when you are abseiling.',
        'tension'
      ),
      toTypeCorrectSpellingQuestion(
        'The sunlight made the tiny particals of dust sparkle as they floated through the air.',
        'particles'
      ),
      toTypeCorrectSpellingQuestion(
        'When Sera went on the excursion, she was astounded by the agracultural facilities on the farm.',
        'agricultural'
      ),
      toTypeCorrectSpellingQuestion(
        'If you catch the train each day, you are commutting to school.',
        'commuting'
      ),
      toTypeCorrectSpellingQuestion(
        'Mia was reluctent to begin the assignment because she knew it required considerable research.',
        'reluctant'
      ),
      toTypeCorrectSpellingQuestion(
        'When we travelled to Indonesia, we visited the ancient tempal at one of the archaeological sites.',
        'temple'
      ),
      toTypeCorrectSpellingQuestion(
        'He held the tiny piece of metal in the parm of his hand.',
        'palm'
      ),
      toTypeCorrectSpellingQuestion(
        'The painter has almost completed painting the seiling.',
        'ceiling'
      ),
    ],
  },
  {
    name: 'Commonly Misspelled English Words',
    description:
      'Are you a spelling whiz? Test your skills with this list of commonly misspelled English words, sourced from Wikipedia.',
    status: GameStatus.PUBLISHED,
    visibility: GameVisibility.PUBLIC,
    categories: [CategoryNameEnum.LANGUAGES],
    questions: [
      {
        title: 'Which of these words is spelled correctly?',
        type: QuestionType.SINGLE,
        answers: [
          { title: 'absence', correct: true },
          { title: 'absense', correct: false },
          { title: 'abcense', correct: false },
          { title: 'absance', correct: false },
        ],
      },
      {
        title: 'Which of these words is spelled correctly?',
        type: QuestionType.SINGLE,
        answers: [
          { title: 'accidentally', correct: true },
          { title: 'accidently', correct: false },
          { title: 'accidentaly', correct: false },
          { title: 'accidantally', correct: false },
        ],
      },
      {
        title: 'Which of these words is spelled correctly?',
        type: QuestionType.SINGLE,
        answers: [
          { title: 'accommodate', correct: true },
          { title: 'acommodate', correct: false },
          { title: 'accomodate', correct: false },
          { title: 'acomodate', correct: false },
        ],
      },
      {
        title: 'Which of these words is spelled correctly?',
        type: QuestionType.SINGLE,
        answers: [
          { title: 'acquaintance', correct: true },
          { title: 'acquaintence', correct: false },
          { title: 'aquaintance', correct: false },
          { title: 'aquaintence', correct: false },
        ],
      },
      {
        title: 'Which of these words is spelled correctly?',
        type: QuestionType.SINGLE,
        funfact: 'Acquit means to free someone from a criminal charge.',
        answers: [
          { title: 'acquit', correct: true },
          { title: 'aquit', correct: false },
          { title: 'acquit', correct: false },
          { title: 'aquitt', correct: false },
        ],
      },
      {
        title: 'Which of these words is spelled correctly?',
        type: QuestionType.SINGLE,
        answers: [
          { title: 'acacia', correct: true },
          { title: 'acaciaa', correct: false },
          { title: 'acaciae', correct: false },
          { title: 'acaciaa', correct: false },
        ],
      },
      {
        title: 'Which of these words is spelled correctly?',
        type: QuestionType.SINGLE,
        answers: [
          { title: 'adultery', correct: true },
          { title: 'adultary', correct: false },
        ],
      },
      {
        title: 'Which of these words is spelled correctly?',
        type: QuestionType.SINGLE,
        answers: [
          { title: 'occurrence', correct: true },
          { title: 'occurence', correct: false },
          { title: 'ocurrence', correct: false },
          { title: 'occurance', correct: false },
        ],
      },
      {
        title: 'Which of these words is spelled correctly?',
        type: QuestionType.SINGLE,
        answers: [
          { title: 'allegiance', correct: true },
          { title: 'allegience', correct: false },
          { title: 'alegiance', correct: false },
          { title: 'allegaince', correct: false },
        ],
      },
      {
        title: 'Which of these words is spelled correctly?',
        type: QuestionType.SINGLE,
        answers: [
          { title: 'amateur', correct: true },
          { title: 'amatuer', correct: false },
          { title: 'amature', correct: false },
          { title: 'ameteur', correct: false },
        ],
      },
      {
        title: 'Which of these words is spelled correctly?',
        type: QuestionType.SINGLE,
        answers: [
          { title: 'apparent', correct: true },
          { title: 'apparant', correct: false },
          { title: 'aparent', correct: false },
          { title: 'apparrent', correct: false },
          { title: 'aparrent', correct: false },
        ],
      },
      {
        title: 'Which of these words is spelled correctly?',
        funfact:
          'This word is pronounced "boo-ee". It refers to a floating device used in water.',
        type: QuestionType.SINGLE,
        answers: [
          { title: 'buoy', correct: true },
          { title: 'bouy', correct: false },
          { title: 'buoyee', correct: false },
        ],
      },
      {
        title: 'Which of these words is spelled correctly?',
        type: QuestionType.SINGLE,
        answers: [
          { title: 'camouflage', correct: true },
          { title: 'camoflage', correct: false },
          { title: 'camoflague', correct: false },
        ],
      },
      {
        title: 'Which of these words is spelled correctly?',
        type: QuestionType.SINGLE,
        answers: [
          { title: 'conscientious', correct: true },
          { title: 'consciencious', correct: false },
          { title: 'consciencious', correct: false },
          { title: 'conscientous', correct: false },
        ],
      },
      {
        title: 'Which of these words is spelled correctly?',
        funfact: 'Daiquiri is a cocktail made with rum, lime juice, and sugar.',
        type: QuestionType.SINGLE,
        answers: [
          { title: 'daiquiri', correct: true },
          { title: 'dacquiri', correct: false },
          { title: 'daquiri', correct: false },
        ],
      },
      {
        title: 'Which of these words is spelled correctly?',
        type: QuestionType.SINGLE,
        answers: [
          { title: 'disastrous', correct: true },
          { title: 'disasterous', correct: false },
          { title: 'disastrus', correct: false },
          { title: 'disastorous', correct: false },
        ],
      },

      {
        title: 'Which of these words is spelled correctly?',
        type: QuestionType.SINGLE,
        answers: [
          { title: 'embarrass', correct: true },
          { title: 'embarass', correct: false },
          { title: 'embarras', correct: false },
        ],
      },
      {
        title: 'Which of these words is spelled correctly?',
        type: QuestionType.SINGLE,
        funfact: 'i before e, except after c.',
        answers: [
          { title: 'hygiene', correct: true },
          { title: 'hygeine', correct: false },
          { title: 'hygene', correct: false },
          { title: 'hygine', correct: false },
        ],
      },
      {
        title: 'Which of these words is spelled correctly?',
        type: QuestionType.SINGLE,
        answers: [
          { title: 'independent', correct: true },
          { title: 'independant', correct: false },
          { title: 'independant', correct: false },
          { title: 'independant', correct: false },
        ],
      },
      {
        title: 'Which of these words is spelled correctly?',
        type: QuestionType.SINGLE,
        answers: [
          { title: 'mischievous', correct: true },
          { title: 'mischievious', correct: false },
          { title: 'mischevious', correct: false },
          { title: 'mischevous', correct: false },
        ],
      },
      {
        title: 'Which of these words is spelled correctly?',
        type: QuestionType.SINGLE,
        hint: 'Did you remember the title of this game?',
        answers: [
          { title: 'misspell', correct: true },
          { title: 'mispell', correct: false },
          { title: 'misspel', correct: false },
        ],
      },
      {
        title: 'Which of these words is spelled correctly?',
        funfact: 'This word refers to a period of 1,000 years.',
        type: QuestionType.SINGLE,
        answers: [
          { title: 'millennium', correct: true },
          { title: 'millenium', correct: false },
          { title: 'milennium', correct: false },
        ],
      },
      {
        title: 'Which of these words is spelled correctly?',
        type: QuestionType.SINGLE,
        answers: [
          { title: 'occurrence', correct: true },
          { title: 'occurrance', correct: false },
          { title: 'occurence', correct: false },
          { title: 'occurance', correct: false },
        ],
      },
      {
        title: 'Which of these words is spelled correctly?',
        type: QuestionType.SINGLE,
        funfact:
          'This word refers to a person who is not a member of the clergy.',
        answers: [
          { title: 'playwright', correct: true },
          { title: 'playright', correct: false },
          { title: 'playwrite', correct: false },
          { title: 'playrite', correct: false },
        ],
      },
    ],
  },
];

const guess_the_language: GameSeedTemplate = {
  name: 'Guess the Language',
  description: 'Test your knowledge of different languages with this quiz.',
  status: GameStatus.PUBLISHED,
  visibility: GameVisibility.PUBLIC,
  categories: [CategoryNameEnum.LANGUAGES, CategoryNameEnum.GEOGRAPHY],
  questions: [
    {
      title: 'Hola',
      funfact:
        'The h is silent, so this word for “hello” is pronounced OH-lah.',
      type: QuestionType.SINGLE,
      answers: [
        { title: 'Spanish', correct: true },
        { title: 'Portuguese', correct: false },
        { title: 'Greek', correct: false },
        { title: 'Tamil', correct: false },
      ],
    },
    {
      title: 'Olá',
      funfact:
        'This Portuguese word for "hello" is similar to the Spanish word for "hello" (hola), except that the Portuguese puts the stress on the second syllable: oh-LAH instead of OH-lah.',
      type: QuestionType.SINGLE,
      answers: [
        { title: 'Portuguese', correct: true },
        { title: 'Spanish', correct: false },
        { title: 'Italian', correct: false },
        { title: 'French', correct: false },
      ],
    },
    {
      title: 'Guten Tag',
      funfact: 'Guten tag is literally translated as "good day."',
      type: QuestionType.SINGLE,
      answers: [
        { title: 'German', correct: true },
        { title: 'Dutch', correct: false },
        { title: 'Finnish', correct: false },
        { title: 'Danish', correct: false },
      ],
    },
    {
      title: 'Ciao',
      funfact: 'Ciao is used in Italy as an informal greeting and farewell.',
      type: QuestionType.SINGLE,
      answers: [
        { title: 'Italian', correct: true },
        { title: 'Russian', correct: false },
        { title: 'Spanish', correct: false },
        { title: 'French', correct: false },
      ],
    },
    {
      title: 'こんにちは',
      funfact:
        'This word is pronounced kohn-nee-chih-wah. It translates to "hello" in Japanese.',
      type: QuestionType.SINGLE,
      answers: [
        { title: 'Japanese', correct: true },
        { title: 'Chinese', correct: false },
        { title: 'Korean', correct: false },
        { title: 'Thai', correct: false },
      ],
    },
    {
      title: 'Привет',
      funfact:
        'This word is pronounced pree-VYET and means "hello" in Russian.',
      type: QuestionType.SINGLE,
      answers: [
        { title: 'Russian', correct: true },
        { title: 'Ukrainian', correct: false },
        { title: 'Bulgarian', correct: false },
        { title: 'Polish', correct: false },
      ],
    },
    {
      title: 'مرحبا',
      funfact:
        'This word is pronounced mar-HAH-bah and means "hello" in Arabic.',
      type: QuestionType.SINGLE,
      answers: [
        { title: 'Arabic', correct: true },
        { title: 'Persian', correct: false },
        { title: 'Swahili', correct: false },
        { title: 'Hebrew', correct: false },
      ],
    },
    {
      title: 'नमस्ते',
      funfact:
        'This word is pronounced nah-MAH-stay and means "hello" in Hindi.',
      type: QuestionType.SINGLE,
      answers: [
        { title: 'Hindi', correct: true },
        { title: 'Bengali', correct: false },
        { title: 'Punjabi', correct: false },
        { title: 'Tamil', correct: false },
      ],
    },
    {
      title: '안녕하세요',
      funfact:
        'This word is pronounced an-NYONG-ha-SAY-yo and means "hello" in Korean.',
      type: QuestionType.SINGLE,
      answers: [
        { title: 'Korean', correct: true },
        { title: 'Japanese', correct: false },
        { title: 'Chinese', correct: false },
        { title: 'Vietnamese', correct: false },
      ],
    },
    {
      title: '你好',
      funfact: 'This word is pronounced nee-HOW and means "hello" in Chinese.',
      type: QuestionType.SINGLE,
      answers: [
        { title: 'Chinese', correct: true },
        { title: 'Japanese', correct: false },
        { title: 'Korean', correct: false },
        { title: 'Thai', correct: false },
      ],
    },
    {
      title: 'Γεια',
      funfact:
        'This common Greek greeting is pronounced YAH. A more formal greeting is Γειά σας (YAH-sahs).',
      type: QuestionType.SINGLE,
      answers: [
        { title: 'Thai', correct: true },
        { title: 'Vietnamese', correct: false },
        { title: 'Malay', correct: false },
        { title: 'Indonesian', correct: false },
      ],
    },
    {
      title: 'Bonjour',
      funfact:
        'Literally meaning "good day," bonjour is the most common French greeting. However, when answering a phone, one usually uses allô.',
      type: QuestionType.SINGLE,
      answers: [
        { title: 'Korean', correct: true },
        { title: 'Japanese', correct: false },
        { title: 'Chinese', correct: false },
        { title: 'Vietnamese', correct: false },
      ],
    },
    {
      title: 'สวัสดี',
      funfact:
        'This Thai word for "hello" is pronounced sah-wah-dee and is finished with a gender-specific participle.',
      type: QuestionType.SINGLE,
      answers: [
        { title: 'Thai', correct: true },
        { title: 'Malay', correct: false },
        { title: 'Indonesian', correct: false },
        { title: 'Filipino', correct: false },
      ],
    },
    {
      title: 'Dia dhuit',
      funfact:
        'This Irish greeting is pronounced JEE-ah GHWIT and literally means "God be with you."',
      type: QuestionType.SINGLE,
      answers: [
        { title: 'Irish', correct: true },
        { title: 'Armernian', correct: false },
        { title: 'Welsh', correct: false },
        { title: 'Romanian', correct: false },
      ],
    },
    {
      title: 'שלום',
      funfact:
        'Shalom is a Hebrew word meaning "peace" and can be used in both greetings ("hello") and farewells ("goodbye").',
      type: QuestionType.SINGLE,
      answers: [
        { title: 'Hebrew', correct: true },
        { title: 'Arabic', correct: false },
        { title: 'Hungarian', correct: false },
        { title: 'Lao', correct: false },
      ],
    },
  ],
};

export default [...spelling, guess_the_language] satisfies GameSeedTemplate[];
