import { QuestionType, GameStatus, GameVisibility } from '@prisma/client';
import { CategoryNameEnum } from '@/lib/definitions/constants';
import type { GameSeedTemplate } from '@/lib/definitions/types';

const olympics = {
  name: 'The Olympics Quiz',
  description:
    'Test your knowledge of the Olympic Games, from the ancient origins to modern events.',
  status: GameStatus.PUBLISHED,
  visibility: GameVisibility.PUBLIC,
  categories: [CategoryNameEnum.SPORTS],
  questions: [
    {
      title:
        'Which Olympian has won 28 medals, more than any other person in the Games history?',
      type: QuestionType.SINGLE,
      answers: [
        { title: 'Michael Phelps', correct: true },
        { title: 'Larisa Latynina', correct: false },
        { title: 'Paavo Nurmi', correct: false },
        { title: 'Bjørn Dæhlie', correct: false },
      ],
    },
    {
      title: 'In which year did the modern Olympic Games first take place?',
      type: QuestionType.SINGLE,
      funfact:
        'The modern Olympic Games started in 1896 with the first Games held in Athens, Greece.',
      answers: [
        { title: '1896', correct: true },
        { title: '1900', correct: false },
        { title: '1924', correct: false },
        { title: '1936', correct: false },
      ],
    },
    {
      title: 'How many rings are on the Olympic flag?',
      type: QuestionType.SINGLE,
      funfact:
        'The five rings on the Olympic flag represent the five continents of Africa, the Americas, Asia, Europe, and Oceania.',
      answers: [
        { title: 'Five', correct: true },
        { title: 'Four', correct: false },
        { title: 'Six', correct: false },
        { title: 'Seven', correct: false },
      ],
    },
    {
      title: 'Which country has hosted the Summer Olympics the most times?',
      type: QuestionType.SINGLE,
      funfact:
        'The United States has hosted the Summer Olympics four times: in 1904 (St. Louis), 1932 (Los Angeles), 1984 (Los Angeles), and 1996 (Atlanta).',
      answers: [
        { title: 'United States', correct: true },
        { title: 'Greece', correct: false },
        { title: 'France', correct: false },
        { title: 'China', correct: false },
      ],
    },
    {
      title: 'What is the official motto of the Olympic Games?',
      type: QuestionType.SINGLE,
      funfact:
        'The Olympic motto "Citius, Altius, Fortius" means "Faster, Higher, Stronger" in Latin.',
      answers: [
        { title: 'Citius, Altius, Fortius', correct: true },
        { title: 'Faster, Higher, Stronger', correct: false },
        { title: 'Unity in Diversity', correct: false },
        { title: 'Stronger Together', correct: false },
      ],
    },
    {
      title: 'The Olympic Games are held every how many years?',
      type: QuestionType.SINGLE,
      funfact:
        'The Summer and Winter Olympic Games are held every four years, alternating every two years. The four-year interval is to respect the ancient origins of the Olympic Games, which were helf every four years at Olympia, Greece.',
      answers: [
        { title: 'Four', correct: true },
        { title: 'Two', correct: false },
        { title: 'Six', correct: false },
        { title: 'Eight', correct: false },
      ],
    },
    {
      title: 'Who is the founder of the modern Olympic Games?',
      type: QuestionType.SINGLE,
      answers: [
        { title: 'Pierre de Coubertin', correct: true },
        { title: 'Baron de Coubertin', correct: false },
        { title: 'Thomas Bach', correct: false },
        { title: 'Juan Antonio Samaranch', correct: false },
      ],
    },
    {
      title: 'When did women first compete in the Olympic Games?',
      type: QuestionType.SINGLE,
      funfact:
        'Women competed for the first time at the 1900 Games in Paris. Of a total of 997 athletes, 22 women competed in five sports: tennis, sailing, croquet, equestrianism and golf.',
      answers: [
        { title: '1900', correct: true },
        { title: '1924', correct: false },
        { title: '1936', correct: false },
        { title: '1948', correct: false },
      ],
    },
    {
      title:
        'Which of these sports has taken place during each modern Summer Olympics?',
      type: QuestionType.SINGLE,
      funfact:
        'Fencing was one of the nine sports at the first modern Olympics in 1896 and has been part of the Games ever since. The first women’s fencing Olympic event took place in 1924.',
      answers: [
        { title: 'Fencing', correct: true },
        { title: 'Basketball', correct: false },
        { title: 'Archery', correct: false },
        { title: 'Judo', correct: false },
      ],
    },
    {
      title:
        'In 393 ce the Roman emperor Theodosius I discontinued the ancient Olympics because...',
      type: QuestionType.SINGLE,
      funfact:
        'The Olympic Games originated as a tribute to Zeus, the chief Greek god. The Romans carried on the Greek tradition; but by the 4th century, the emperors of Rome had converted to Christianity. Theodosius banned pagan festivals, including the Olympics.',
      answers: [
        {
          title: 'He was a Christian and saw it as a pagan festival',
          correct: true,
        },
        { title: 'He was too busy with other matters', correct: false },
        { title: 'He wanted to start his own games', correct: false },
        { title: 'Too many people were getting hurt', correct: false },
      ],
    },
    {
      title:
        'Gymnast Simone Biles withdrew from the 2020 Tokyo Games because she was experiencing a mental block called what?',
      type: QuestionType.SINGLE,
      funfact:
        'The term "the twisties" refers to a mental block that gymnasts can experience, where they lose their sense of spatial awareness during aerial maneuvers.',
      answers: [
        { title: 'The twisties', correct: true },
        { title: 'The flips', correct: false },
        { title: 'The turns', correct: false },
        { title: 'The spins', correct: false },
      ],
    },
  ],
} satisfies GameSeedTemplate;

export default [olympics] satisfies GameSeedTemplate[];