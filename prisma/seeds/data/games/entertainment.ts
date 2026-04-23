import { CategoryNameEnum } from '@/lib/definitions/constants';
import type { GameSeedTemplate } from '@/lib/definitions/types';
import { GameStatus, GameVisibility, QuestionType } from '@prisma/client';

/***************************************************************
                     Games: Entertainment
***************************************************************/

const finish_the_lyics: GameSeedTemplate = {
  name: 'Finish the Lyrics',
  description:
    'Test your musical memory by completing the missing lyrics from iconic and popular songs.',
  status: GameStatus.PUBLISHED,
  visibility: GameVisibility.PUBLIC,
  categories: [CategoryNameEnum.ENTERTAINMENT],
  tags: ['music', 'lyrics'],
  questions: [
    {
      title:
        "Finish the lyrics: 'Cause baby you're a firework, come on show 'em what you're...'",
      type: QuestionType.SINGLE,
      hint: "This line is from Katy Perry's empowering hit (Firework).",
      answers: [
        { title: 'worth', correct: true },
        { title: 'made of', correct: false },
        { title: 'doing', correct: false },
        { title: 'feeling', correct: false },
      ],
    },
    {
      title:
        "Finish the lyrics: 'Cause you know I'd walk a thousand miles if I could just...'",
      type: QuestionType.SINGLE,
      hint: "This line is from Vanessa Carlton's hit song (A Thousand Miles).",
      answers: [
        { title: 'see you', correct: true },
        { title: 'hold you', correct: false },
        { title: 'find you', correct: false },
        { title: 'be with you', correct: false },
      ],
    },
    {
      title:
        "Finish the lyrics: 'Hello from the other side, I must have called a thousand...'",
      type: QuestionType.TYPE_ANSWER,
      hint: "This line is from Adele's chart-topping song (Hello).",
      answers: [{ title: 'times', correct: true }],
    },
    {
      title:
        "Finish the lyrics: 'I got a feeling that tonight's gonna be a good...'",
      type: QuestionType.TYPE_ANSWER,
      hint: "This line is from The Black Eyed Peas' party anthem (I Gotta Feeling).",
      answers: [{ title: 'night', correct: true }],
    },
    {
      title: "Finish the lyrics: 'We don't talk anymore, like we used to...'",
      type: QuestionType.TYPE_ANSWER,
      hint: "This line is from a duet by Charlie Puth and Selena Gomez (We Don't Talk Anymore).",
      answers: [{ title: 'do', correct: true }],
    },
    {
      title:
        "Finish the lyrics: 'Cause if you liked it then you shoulda put a...'",
      type: QuestionType.SINGLE,
      hint: "This line is from Beyoncé's hit song (Single Ladies).",
      answers: [
        { title: 'ring on it', correct: true },
        { title: 'lock on it', correct: false },
        { title: 'tag on it', correct: false },
        { title: 'bow on it', correct: false },
      ],
    },
    {
      title: "Finish the lyrics: 'Is it too late now to say...'",
      type: QuestionType.SINGLE,
      hint: "This line is from Justin Bieber's hit song (Sorry).",
      answers: [
        { title: 'sorry', correct: true },
        { title: 'hello', correct: false },
        { title: 'goodbye', correct: false },
        { title: 'thank you', correct: false },
      ],
    },
    {
      title:
        "Finish the lyrics: 'Cause you make me feel like I've been locked out of...'",
      type: QuestionType.SINGLE,
      hint: "This line is from Katy Perry's hit song (Teenage Dream).",
      answers: [
        { title: 'heaven', correct: true },
        { title: 'paradise', correct: false },
        { title: 'hell', correct: false },
        { title: 'love', correct: false },
      ],
    },
    {
      title:
        "Finish the lyrics: 'Shine bright like a diamond, find light in the beautiful...'",
      type: QuestionType.SINGLE,
      hint: "This line is from Rihanna's hit song (Diamonds).",
      answers: [
        { title: 'sea', correct: true },
        { title: 'sky', correct: false },
        { title: 'night', correct: false },
        { title: 'world', correct: false },
      ],
    },
  ],
};

const harry_potter: GameSeedTemplate = {
  name: 'The Ultimate Harry Potter Quiz',
  description:
    'Are you ready to put your Harry Potter knowledge to the test? Step into the magical world of wizards, witches, and muggles with this ultimate Harry Potter quiz! From Platform 9 3/4 to the seven Horcruxes, see if you have what it takes to ace this spellbinding challenge!',
  status: GameStatus.PUBLISHED,
  visibility: GameVisibility.PUBLIC,
  categories: [CategoryNameEnum.ENTERTAINMENT],
  tags: ['harry potter'],
  questions: [
    {
      title: 'What is the name of Harry Potter’s pet owl?',
      type: QuestionType.SINGLE,
      answers: [
        { title: 'Hedwig', correct: true },
        { title: 'Crookshanks', correct: false },
        { title: 'Fawkes', correct: false },
        { title: 'Scabbers', correct: false },
      ],
    },
    {
      title: 'Who guards the Gryffindor common room?',
      type: QuestionType.SINGLE,
      answers: [
        { title: 'The Fat Lady', correct: true },
        { title: 'Sir Cadogan', correct: false },
        { title: 'The Bloody Baron', correct: false },
        { title: 'The Fat Friar', correct: false },
      ],
    },
    {
      title: 'Name the four Hogwarts houses.',
      type: QuestionType.TYPE_ANSWER,
      answers: [
        { title: 'Gryffindor', correct: true },
        { title: 'Hufflepuff', correct: true },
        { title: 'Ravenclaw', correct: true },
        { title: 'Slytherin', correct: true },
      ],
    },
    {
      title: "What is the name of Voldemort's snake?",
      type: QuestionType.SINGLE,
      funfact:
        'Nagini was originally a female human Maledictus, with the ability to transform into a snake.',
      answers: [
        { title: 'Nagini', correct: true },
        { title: 'Kingsley', correct: false },
        { title: 'Fang', correct: false },
        { title: 'Scabbers', correct: false },
      ],
    },
    {
      title: 'Which Harry Potter word is now in the Oxford English Dictionary?',
      type: QuestionType.SINGLE,
      funfact:
        'In 2003, the OED added "muggle," which the dictionary defines as, "a person who possesses no magical powers ... a person who lacks a particular skill or skills, or who is regarded as inferior in some way."',
      answers: [
        { title: 'Muggle', correct: true },
        { title: 'Quidditch', correct: false },
        { title: 'Hogwarts', correct: false },
        { title: 'Voldemort', correct: false },
      ],
    },
    {
      title: 'Who is the Half-Blood Prince?',
      type: QuestionType.SINGLE,
      funfact:
        'He adopted this moniker because he is a half-blood wizard, meaning his mother was a witch and his father was a Muggle. His mother\'s maiden name was Prince, hence the "Prince" part of the nickname.',
      answers: [
        { title: 'Severus Snape', correct: true },
        { title: 'Tom Riddle', correct: false },
        { title: 'Albus Dumbledore', correct: false },
        { title: 'Sirius Black', correct: false },
      ],
    },
    {
      title: 'What are the three Unforgivable Curses?',
      type: QuestionType.SINGLE,
      funfact:
        'The use of Avada Kedavra (the killing curse), Crucio (excruciating pain) and Imperio (which causes the victim to obey the spell-caster) are punishable by life in Azkaban.',
      answers: [
        { title: 'Avada Kedavra, Crucio and Imperio', correct: true },
        { title: 'Avada Kedavra, Imperius, Sectumsempra', correct: false },
        {
          title: 'Expelliarmus, Expecto Patronum and Diffindo',
          correct: false,
        },
        { title: 'Impedimenta, Incarcerous and Incendio', correct: false },
      ],
    },
    {
      title:
        "What is the only book in the Harry Potter series that doesn't feature Lord Voldemort?",
      type: QuestionType.SINGLE,
      funfact:
        '"Harry Potter and the Prisoner of Azkaban" is the only book without He-Who-Must-Not-Be-Named. He\'s mentioned, of course, but he never actually shows up.',
      answers: [
        { title: 'The Prisoner of Azkaban', correct: true },
        { title: 'The Goblet of Fire', correct: false },
        { title: 'The Half-Blood Prince', correct: false },
        { title: 'The Deathly Hallows', correct: false },
      ],
    },
    {
      title: 'Who is the Prisoner of Azkaban?',
      type: QuestionType.SINGLE,
      funfact:
        'Sirius Black was wrongfully convicted of killing 13 people with a single curse.',
      answers: [
        { title: 'Sirius Black', correct: true },
        { title: 'Mad-Eye Moody', correct: false },
        { title: 'Peter Pettigrew', correct: false },
        { title: 'Barty Crouch Jr.', correct: false },
      ],
    },
    {
      title: 'Who was NOT a member of the Order of the Phoenix?',
      type: QuestionType.SINGLE,
      funfact:
        'The Order of the Phoenix was a secret society founded by Albus Dumbledore to fight against Voldemort and his Death Eaters.',
      answers: [
        { title: 'Bellatrix Lestrange', correct: true },
        { title: 'Sirius Black', correct: false },
        { title: 'Remus Lupin', correct: false },
        { title: 'Mad-Eye Moody', correct: false },
      ],
    },
    {
      title:
        'Who kills Albus Dumbledore at the end of "The Half-Blood Prince"?',
      type: QuestionType.SINGLE,
      answers: [
        { title: 'Professor Snape', correct: true },
        { title: 'Draco Malfoy', correct: false },
        { title: 'Bellatrix Lestrange', correct: false },
        { title: 'Voldemort', correct: false },
      ],
    },
    {
      title: 'What did Voldemort use to resurrect himself?',
      type: QuestionType.SINGLE,
      funfact:
        '"Bone of the father, unknowingly given, you will renew your son! Flesh of the servant, willingly sacrificed, you will revive your master. Blood of the enemy, forcibly taken, you will resurrect your foe." - Peter Pettigrew reciting the incantation for the potion\'s creation.',
      answers: [
        { title: 'A Regeneration Potion', correct: true },
        { title: 'The Resurrection Stone', correct: true },
        { title: 'The Elder Wand', correct: false },
        { title: 'A Horcrux', correct: false },
      ],
    },
    {
      title:
        'How old was Moaning Myrtle when she became a ghost, and what was her Hogwarts house?',
      type: QuestionType.SINGLE,
      funfact: 'And her surname was Warren.',
      answers: [
        { title: 'She was 14 and a Ravenclaw!', correct: true },
        { title: 'She was 15 and a Slytherin!', correct: false },
        { title: 'She was 14 and a Gryffindor!', correct: false },
        { title: 'She was 15 and a Hu fflepuff!', correct: false },
      ],
    },
    {
      title: 'Which object allows its user to see into the past?',
      hint: 'Dumbledore used it to show Harry memories during The Half-Blood Prince.',
      type: QuestionType.SINGLE,
      funfact:
        'The time turner helps you move in time, the portkey apparates you, and the deluminator manipulates light.',
      answers: [
        { title: 'The Pensieve', correct: true },
        { title: 'The Time-Turner', correct: false },
        { title: 'The Portkey', correct: false },
        { title: 'The Deluminator', correct: false },
      ],
    },
    {
      title:
        'What is the name of the three-headed dog that guards the trapdoor?',
      type: QuestionType.SINGLE,
      funfact:
        "Fluffy is a giant three-headed dog that guards the trapdoor leading to the Philosopher's Stone in the first book.",
      answers: [
        { title: 'Fluffy', correct: true },
        { title: 'Fang', correct: false },
        { title: 'Cyrus', correct: false },
        { title: 'Buckbeak', correct: false },
      ],
    },
    {
      title: "Which of the following is NOT one of Albus Dumbledore's names?",
      funfact: 'His full name was Albus Percival Wulfric Brian Dumbledore.',
      type: QuestionType.SINGLE,
      answers: [
        { title: 'Gideon', correct: true },
        { title: 'Percival', correct: false },
        { title: 'Brian', correct: false },
        { title: 'Wulfric', correct: false },
      ],
    },
    {
      title:
        'Who told Harry "The Tale of the Three Brothers," a fairy tale that explains the origins of the Deathly Hallows?',
      type: QuestionType.SINGLE,
      funfact:
        "Luna's dad told the golden trio about the three brothers when they visited him in Deathly Hallows.",
      answers: [
        { title: 'Xenophilius Lovegood', correct: true },
        { title: 'Remus Lupin', correct: false },
        { title: 'Albus Dumbledore', correct: false },
        { title: 'Minerva McGonagall', correct: false },
      ],
    },
    {
      title: 'What are the three objects in the Deathly Hallows?',
      type: QuestionType.SINGLE,
      funfact:
        'The Deathly Hallows are three artefacts supposedly created by Death that would make their possessor the "Master of Death".',
      answers: [
        {
          title: 'The Elder Wand, Resurrection Stone, and Invisibility Cloak',
          correct: true,
        },
        {
          title: 'The Sorting Hat, The Golden Snitch, and The Maradures Map',
          correct: false,
        },
        {
          title:
            "The Marauder's Map, The Sorting Hat, and The Sword of Gryffindor",
          correct: false,
        },
        {
          title:
            "The Mirror of Erised, The Philosopher's Stone, and The Goblet of Fire",
          correct: false,
        },
      ],
    },
  ],
};

export default [finish_the_lyics, harry_potter] satisfies GameSeedTemplate[];
