import { QuestionType, GameStatus, GameVisibility } from '@prisma/client';
import { CategoryNameEnum } from '@/lib/definitions/constants';
import type { GameSeedTemplate } from '@/lib/definitions/types';

const computer_science = {
  name: 'GCSE Computer Science: Quick Fire',
  description: 'There are 10 quick-fire questions that should take approximately 5-10 minutes to complete.',
  categories: [CategoryNameEnum.STEM],
  tags: ['computer science', 'coding', 'programming'],
  status: GameStatus.PUBLISHED,
  visibility: GameVisibility.PUBLIC,
  questions: [
    {
      title: 'Which is the least efficient of the sorting algorithms?',
      type: QuestionType.SINGLE,
      answers: [
        { title: 'Bubble Sort', correct: true },
        { title: 'Insertion Sort', correct: false },
        { title: 'Merge Sort', correct: false },
        { title: 'Linear Search', correct: false }
      ],
      funfact: 'The bubble sort is the least efficient of the sorting algorithms, both merge and insertion sorts are more efficient. Linear search is not a sorting algorithm, it is a searching algorithm.',
    },
    {
      title: 'Which of the following is a type of primary memory?',
      type: QuestionType.SINGLE,
      answers: [
        { title: 'Random Access Memory (RAM)', correct: true },
        { title: 'Hard Disk Drive (HDD)', correct: false },
        { title: 'Solid State Drive (SSD)', correct: false },
        { title: 'CD ROM', correct: false }
      ],
      funfact: 'Primary memory is a term that refers to different types of memory as it is directly accessible by the processor. hard disk drives, solid state drives and CD ROMs are types of secondary storage.',
    },
    {
      title: 'If we shift the binary number 00011101 three places to the left, what numerical operation is this equivalent to doing?',
      type: QuestionType.SINGLE,
      answers: [
        { title: 'Multiplying by 8', correct: true },
        { title: 'Dividing by 8', correct: false },
        { title: 'Multiplying by 4', correct: false },
        { title: 'Dividing by 4', correct: false }
      ],
      funfact: 'Shifting a binary number to the left is the equivalent of multiplying the number by 2 for each shift, so shifting 3 places is the same as doing 2x2x2 or multiplying by 8.',
    },
    {
      title: 'What type of programming language uses terms that are close to everyday written and spoken language?',
      type: QuestionType.SINGLE,
      answers: [
        { title: 'Assembly Language', correct: false },
        { title: 'High Level Language', correct: true },
        { title: 'Machine Code', correct: false },
        { title: 'Low Level Language', correct: false }
      ],
      funfact: 'High-level languages are ones that can be read similar to everyday languages. Low-level languages are very abstract when reading them and include assembly language and machine code.',
    },
    {
      title: 'Which of the following is a type of secondary storage?',
      type: QuestionType.MULTIPLE,
      answers: [
        { title: 'Hard Disk Drive (HDD)', correct: true },
        { title: 'Solid State Drive (SSD)', correct: true },
        { title: 'Random Access Memory (RAM)', correct: false },
        { title: 'Read Only Memory (ROM)', correct: false },
        { title: 'Cache Memory', correct: false },
      ]
    },
    {
      title: 'Which of these is not a type of logic gate?',
      type: QuestionType.SINGLE,
      answers: [
        { title: 'AND', correct: false },
        { title: 'OR', correct: false },
        { title: 'NOT', correct: false },
        { title: 'IF', correct: true }
      ],
      funfact: 'Logic gates are the building blocks of digital circuits. AND, OR, and NOT gates are fundamental logic gates, while IF is a conditional statement in programming, not a logic gate.',
    },
    {
      title: 'Which of the following devices is an example of an embedded system?',
      type: QuestionType.SINGLE,
      answers: [
        { title: 'Washing Machine', correct: true },
        { title: 'Smartphone', correct: false },
        { title: 'Laptop', correct: false },
        { title: 'Desktop Computer', correct: false }
      ],
      funfact: 'An embedded system usually has a single intended function, which it is designed to do. It is not usually possible to change the purpose for which the system is designed.',
    },
    {
      title: 'What does the acronym "CPU" stand for?',
      type: QuestionType.SINGLE,
      answers: [
        { title: 'Central Processing Unit', correct: true },
        { title: 'Computer Personal Unit', correct: false },
        { title: 'Central Program Unit', correct: false },
        { title: 'Computer Processing Unit', correct: false }
      ],
      funfact: 'The CPU is often referred to as the brain of the computer, as it performs most of the processing inside a computer.',
    },
    {
      title: 'Which of the following is the definition of a LAN (local area network)?',
      type: QuestionType.SINGLE,
      answers: [
        { title: 'A network which is confined to one building or site', correct: true },
        { title: 'A network that connects computers over large geographical distances', correct: false },
        { title: 'A network where all nodes are connected along a linear link/backbone', correct: false },
        { title: 'A network that connects computers using telephone lines', correct: false }
      ]
    },
    {
      title: 'What is latency in the context of a network?',
      type: QuestionType.SINGLE,
      answers: [
        { title: 'The time it takes for data to travel from one point to another', correct: true },
        { title: 'The amount of data that can be transmitted in a given time', correct: false },
        { title: 'The physical distance between two network nodes', correct: false },
        { title: 'The maximum speed of a network connection', correct: false }
      ]
    },
  ]
} satisfies GameSeedTemplate;

export default [ computer_science, ] satisfies GameSeedTemplate[];
