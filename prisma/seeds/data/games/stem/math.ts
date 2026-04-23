import { QuestionType, GameStatus, GameVisibility } from '@prisma/client';
import { CategoryNameEnum } from '@/lib/definitions/constants';
import type { GameSeedTemplate } from '@/lib/definitions/types';

const maths: GameSeedTemplate = {
  name: 'Quick Maths Practice',
  description:
    'Want to flex your Maths brain a little? Brush up with 7 questions covering a range of Maths topics.',
  status: GameStatus.PUBLISHED,
  visibility: GameVisibility.PUBLIC,
  categories: [CategoryNameEnum.STEM],
  questions: [
    {
      title:
        'What is the volume of this square pyramid? Give your answers in cm cubed.',
      image:
        'https://quiz-cdn-prd-01.studiosity.com/uploads/files/844/larges.jpg?1365750130',
      hint: 'The slant height is not needed for the volume calculation!',
      funfact:
        'The formula for the volume of a pyramid is V = (1/3) × base area × height. So, V = (1/3) × (6 × 6) × 8 = 96 cm³.',
      type: QuestionType.SINGLE,
      answers: [
        { title: '96', correct: true },
        { title: '72', correct: false },
        { title: '108', correct: false },
        { title: '432', correct: false },
      ],
    },
    {
      title:
        'What number is missing in this counting pattern: 5, 10, ? , 20, 25',
      hint: 'Find the pattern by working out the difference between one number and the next.',
      type: QuestionType.SINGLE,
      answers: [
        { title: '15', correct: true },
        { title: '11', correct: false },
        { title: '30', correct: false },
        { title: '9', correct: false },
      ],
    },
    {
      title:
        'The arrow is spun. What is the probability that it will stop on the darkest colour?',
      image:
        'https://quiz-cdn-prd-01.studiosity.com/uploads/files/89/mediums.jpg?1365745728',
      hint: 'Into how many sections is the spinner divided? What fraction of these are the darkest colour?',
      type: QuestionType.SINGLE,
      answers: [
        { title: '0.25', correct: true },
        { title: '0.50', correct: false },
        { title: '0.75', correct: false },
        { title: '1.25', correct: false },
      ],
    },
    {
      title: 'In the diagram β represents a number. Find the value of β.',
      image:
        'https://quiz-cdn-prd-01.studiosity.com/uploads/files/226/larges.jpg?1365746398',
      hint: 'How many degrees are there in a circle?',
      type: QuestionType.SINGLE,
      answers: [
        { title: '15', correct: true },
        { title: '30', correct: false },
        { title: '60', correct: false },
        { title: '90', correct: false },
      ],
    },
    {
      title:
        'The fractions of the whole tangram are written on six of the seven pieces. What fraction is missing?',
      image:
        'https://quiz-cdn-prd-01.studiosity.com/uploads/files/342/larges.jpg?1365746983',
      hint: 'All fractions in the tangram must add to one whole.',
      type: QuestionType.SINGLE,
      answers: [
        { title: '1/8', correct: true },
        { title: '1/4', correct: false },
        { title: '3/8', correct: false },
        { title: '1/16', correct: false },
      ],
    },
    {
      title:
        'ξ stands for a whole number. Which expression is equal to (6 × ξ + 9) ÷ 3?',
      image:
        'https://quiz-cdn-prd-01.studiosity.com/uploads/files/425/larges.jpg?1365747436',
      hint: 'Think of 6 x ξ + 9 as a product of two factors and then simplify the algebraic fraction.',
      type: QuestionType.SINGLE,
      answers: [
        { title: '2 × ξ + 3', correct: true },
        { title: '2 × ξ + 6', correct: false },
        { title: '6 × ξ + 3', correct: false },
        { title: '3 × ξ + 6', correct: false },
      ],
    },
    {
      title: 'Which number is the smallest?',
      type: QuestionType.SINGLE,
      answers: [
        { title: 'one fifth of five eighths', correct: true },
        { title: 'one half of three quarters', correct: false },
        { title: 'one eighth of seven', correct: false },
        { title: 'one third of six eighths', correct: false },
      ],
    },
    {
      title:
        'First use the angle sum of a quadrilateral to find z. What does (x + y) equal?',
      hint: 'In a quadrilateral, the sum of angles is 360°.',
      image:
        'https://quiz-cdn-prd-01.studiosity.com/uploads/files/328/larges.jpg?1365746904',
      type: QuestionType.SINGLE,
      answers: [
        { title: '25', correct: true },
        { title: '24', correct: false },
        { title: '107', correct: false },
        { title: '73', correct: false },
      ],
    },
    {
      title: 'What is the date 14 weeks after the 3rd of January?',
      image:
        'https://quiz-cdn-prd-01.studiosity.com/uploads/files/162/larges.jpg?1365746083',
      type: QuestionType.SINGLE,
      answers: [
        { title: '11 April', correct: true },
        { title: '21 March', correct: false },
        { title: '4 April', correct: false },
        { title: '9 May', correct: false },
      ],
    },
    {
      title:
        'Mr Brown had $500 in his bank account before he paid bills of $243, $57 and $350. How much money does he have left after paying his bills?',
      type: QuestionType.SINGLE,
      answers: [
        { title: '-$150', correct: true },
        { title: '+$150', correct: false },
        { title: '+$1150', correct: false },
        { title: '-$1150', correct: false },
      ],
    },
    {
      title:
        'A builder reads the number 3000 for the height of a wall on a house plan. What is this measured in?',
      type: QuestionType.SINGLE,
      answers: [
        { title: 'mm', correct: true },
        { title: 'cm', correct: false },
        { title: 'm', correct: false },
        { title: 'km', correct: false },
      ],
    },
    {
      title:
        'What is the smallest 4-digit number that Tracey can make with the digits on these numbers: 6, 0, 9, 4?',
      hint: 'Remember this must be a 4 digit number. What is the smallest value digit it can start with?',
      type: QuestionType.SINGLE,
      answers: [
        { title: '4069', correct: true },
        { title: '0469', correct: false },
        { title: '9640', correct: false },
        { title: '4609', correct: false },
      ],
    },
    {
      title: 'What is the value of 3 + 4 × 2?',
      hint: 'Remember the order of operations. What do you do first?',
      type: QuestionType.SINGLE,
      answers: [
        { title: '11', correct: true },
        { title: '14', correct: false },
        { title: '10', correct: false },
        { title: '7', correct: false },
      ],
    },
    {
      title:
        'Olga has made four rows each with five 10c coins. How much money does Olga have?',
      type: QuestionType.SINGLE,
      answers: [
        { title: '$20.00', correct: false },
        { title: '$200', correct: false },
        { title: '$2.00', correct: true },
        { title: '$4.00', correct: false },
      ],
    },
    {
      title:
        'A block of wood is cut in half from edge to opposite edge. What shape is each piece?',
      image:
        'https://quiz-cdn-prd-01.studiosity.com/uploads/files/125/larges.jpg?1365745900',
      hint: 'Imagine sliding away the top half and concentrate on the remaining half of the block of wood.',
      type: QuestionType.SINGLE,
      answers: [
        { title: 'Triangular Prism', correct: true },
        { title: 'Rectangular Prism', correct: false },
        { title: 'Triangular Pyramid', correct: false },
        { title: 'Triangular Prism', correct: false },
      ],
    },
    {
      title: 'Which angle is an obtuse angle?',
      image:
        'https://quiz-cdn-prd-01.studiosity.com/uploads/files/115/larges.jpg?1365745854',
      hint: 'Remember that an obtuse angle is greater than 90 degrees, but less than 180 degrees.',
      type: QuestionType.SINGLE,
      answers: [
        { title: 'a', correct: true },
        { title: 'b', correct: false },
        { title: 'c', correct: false },
        { title: 'd', correct: false },
      ],
    },
    {
      title: 'Which shape has rotational symmetry?',
      hint: 'A shape has rotational symmetry when it can be rotated (some angle less than 360°) and it still looks the same.',
      type: QuestionType.MULTIPLE,
      answers: [
        { title: 'Square', correct: true },
        { title: 'Circle', correct: true },
        { title: 'Rectangle', correct: false },
        { title: 'Trapezium', correct: false },
      ],
    },
    {
      title: 'Which is 2^2 x 5^2 not equal to?',
      hint: 'We read 2^2 as "two squared". It means 2 x 2. Use this idea to work out 2^2 x 5^2.',
      type: QuestionType.SINGLE,
      answers: [
        { title: '7^2', correct: true },
        { title: '49 + 51', correct: false },
        { title: '4 × 25', correct: false },
        { title: '10^2', correct: false },
      ],
    },
    {
      title: 'What is the largest number that is a factor of both 24 and 36?',
      hint: 'Write out all the factors of 24 and 36.',
      type: QuestionType.SINGLE,
      answers: [
        { title: '12', correct: true },
        { title: '4', correct: false },
        { title: '72', correct: false },
        { title: '16', correct: false },
      ],
    },
    {
      title:
        'In a cricket match, Robin went in to bat at 12:45 pm and was caught out at 4:13 pm. How long did Robin bat for?',
      type: QuestionType.SINGLE,
      answers: [
        { title: '3 hours 28 minutes', correct: true },
        { title: '3 hours 32 minutes', correct: false },
        { title: '4 hours 28 minutes', correct: false },
        { title: '4 hours 32 minutes', correct: false },
      ],
    },
    {
      title:
        'An elephant eats about 200 kg of food each day. About how much food does the elephant eat in one year?',
      hint: 'There are 365 days in a year. 1 tonne = 1,000 kg.',
      type: QuestionType.SINGLE,
      answers: [
        { title: '70 tonnes', correct: true },
        { title: '700 kg', correct: false },
        { title: '370 tonnes', correct: false },
        { title: '3700 kg', correct: false },
      ],
    },
    {
      title:
        'Lara is 138 cm tall, Wadim is 150 cm tall and Shani is 123 cm tall. What is the average of their heights?',
      type: QuestionType.SINGLE,
      answers: [
        { title: '137 cm', correct: true },
        { title: '123 cm', correct: false },
        { title: '150 cm', correct: false },
        { title: '138 cm', correct: false },
      ],
    },
    {
      title:
        'Max was facing north. He turned to the right until he faced SE. How many degrees did Max turn through?',
      type: QuestionType.SINGLE,
      answers: [
        { title: '135°', correct: true },
        { title: '90°', correct: false },
        { title: '45°', correct: false },
        { title: '225°', correct: false },
      ],
    },
    {
      title:
        'Stan, Sam and Sushma each bought a drink for $2.80 and a meat pie for $2.35. Stan paid for them all with a $20 note. How much change did Stan get?',
      type: QuestionType.SINGLE,
      answers: [
        { title: '$4.55', correct: true },
        { title: '$5.15', correct: false },
        { title: '$13.50', correct: false },
        { title: '$14.85', correct: false },
      ],
    },
    {
      title: 'What fraction of the whole regular hexagon is shaded?',
      image:
        'https://quiz-cdn-prd-01.studiosity.com/uploads/files/145/mediums.jpg?1365745998',
      hint: 'The hexagon is NOT divided into equal parts.',
      type: QuestionType.SINGLE,
      answers: [
        { title: '1/3', correct: true },
        { title: '1/4', correct: false },
        { title: '1/5', correct: false },
        { title: '1/6', correct: false },
      ],
    },
    {
      title:
        'Taila watched television from 4:30 pm to 5:18 pm. She spent 50% more time watching television than she did on piano practice. How long did Taila practice the piano?',
      hint: '"50% more time" means she spent the same amount PLUS half as much again.',
      type: QuestionType.SINGLE,
      answers: [
        { title: '32 minutes', correct: true },
        { title: '36 minutes', correct: false },
        { title: '64 minutes', correct: false },
        { title: '3/4 hour', correct: false },
      ],
    },
    {
      title:
        'Both addition and subtraction are used in this pattern. What is the last number: 100, 90, 110, 100, 120, 110, 130, 120, ... ?',
      hint: 'Consider the clue that both addition and subtraction are used in this pattern.',
      type: QuestionType.SINGLE,
      answers: [
        { title: '120', correct: false },
        { title: '130', correct: false },
        { title: '140', correct: true },
        { title: '150', correct: false },
      ],
    },
  ],
};

export default [maths] satisfies GameSeedTemplate[];
