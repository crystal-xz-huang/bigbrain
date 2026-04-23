import { QuestionType, GameStatus, GameVisibility } from '@prisma/client';
import type { GameSeedTemplate } from '@/lib/definitions/types';
import { CategoryNameEnum } from '@/lib/definitions/constants';

const engineering = {
  name: 'Engineering Quiz',
  description: 'These 20 multiple-choice questions are designed to test your intermediate-level knowledge across various engineering disciplines. Whether you’re exploring the principles of structural support, delving into electronic circuits, or unraveling the complexities of fluid mechanics, this quiz offers a comprehensive test of your engineering acumen.',
  status: GameStatus.PUBLISHED,
  visibility: GameVisibility.PUBLIC,
  categories: [CategoryNameEnum.STEM],
  tags: ['engineering', 'mechanical', 'electrical', 'civil', 'aerospace'],
  questions: [
    {
      title:
        'What is the primary function of a flywheel in a mechanical system?',
      type: QuestionType.SINGLE,
      answers: [
        { title: 'Energy storage', correct: true },
        { title: 'Motion control', correct: false },
        { title: 'Heat dissipation', correct: false },
        { title: 'Vibration isolation', correct: false },
      ],
    },
    {
      title: 'Which law of thermodynamics states that energy cannot be created or destroyed, only transformed?',
      type: QuestionType.SINGLE,
      answers: [
        { title: 'First Law', correct: true },
        { title: 'Second Law', correct: false },
        { title: 'Third Law', correct: false },
        { title: 'Zeroth Law', correct: false },
      ]
    },
    {
      title: 'In civil engineering, what is the purpose of a geotechnical investigation?',
      type: QuestionType.SINGLE,
      answers: [
        { title: 'Soil and rock analysis', correct: true },
        { title: 'Design structural elements', correct: false },
        { title: 'Environmental impact assessment', correct: false },
        { title: 'Structural analysis', correct: false },
      ]
    },
    {
      title: 'What is the primary function of a transformer in electrical engineering?',
      type: QuestionType.SINGLE,
      answers : [
        { title: 'Voltage regulation', correct: true },
        { title: 'Current regulation', correct: false },
        { title: 'Power generation', correct: false },
        { title: 'Signal amplification', correct: false },
      ]
    },
    {
      title: 'In aerospace engineering, what is the primary purpose of a wing’s airfoil shape?',
      type: QuestionType.SINGLE,
      answers: [
        { title: 'Generate lift', correct: true },
        { title: 'Reduce drag', correct: false },
        { title: 'Increase stability', correct: false },
        { title: 'Control pitch', correct: false },
      ]
    },
    {
      title: 'What is the SI unit for electrical resistance?',
      type: QuestionType.SINGLE,
      answers: [
        { title: 'Ohm', correct: true },
        { title: 'Volt', correct: false },
        { title: 'Ampere', correct: false },
        { title: 'Watt', correct: false },
      ]
    },
    {
      title: 'In electronic engineering, what is the primary function of an operational amplifier (op-amp)?',
      type: QuestionType.SINGLE,
      answers: [
        { title: 'Signal amplification', correct: true },
        { title: 'Voltage regulation', correct: false },
        { title: 'Current limiting', correct: false },
        { title: 'Frequency modulation', correct: false },
      ]
    },
    {
      title:
        'In structural engineering, what is the primary purpose of a cantilever?',
      type: QuestionType.SINGLE,
      answers: [
        { title: 'Structural support', correct: true },
        { title: 'Load distribution', correct: false },
        { title: 'Heat dissipation', correct: false },
        { title: 'Reduce noise', correct: false },
      ],
    },
    {
      title: 'Which type of gear is known for transmitting motion between non-parallel and non-intersecting shafts?',
      type: QuestionType.SINGLE,
      answers: [
        { title: 'Bevel gear', correct: true },
        { title: 'Spur gear', correct: false },
        { title: 'Worm gear', correct: false },
        { title: 'Helical gear', correct: false },
      ]
    },
    {
      title: 'Which semiconductor device is commonly used for signal amplification in electronic circuits?',
      type: QuestionType.SINGLE,
      answers: [
        { title: 'Transistor', correct: true },
        { title: 'Diode', correct: false },
        { title: 'Resistor', correct: false },
        { title: 'Capacitor', correct: false },
      ]
    }
  ],
} satisfies GameSeedTemplate;

export default [engineering] satisfies GameSeedTemplate[];
