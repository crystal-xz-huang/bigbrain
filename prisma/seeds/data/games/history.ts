import { QuestionType, GameStatus, GameVisibility } from '@prisma/client';
import { CategoryNameEnum } from '@/lib/definitions/constants';
import { GameSeedTemplate } from '@/lib/definitions/types';

const world_history: GameSeedTemplate = {
  name: 'Who Did That? A Historical Bio Quiz',
  description:
    'Test your knowledge of historical figures and their contributions.',
  status: GameStatus.PUBLISHED,
  visibility: GameVisibility.PUBLIC,
  categories: [CategoryNameEnum.HISTORY],
  questions: [
    {
      title:
        'Aided by his 6-foot-4-inch height, which U.S. president won an estimated 300 wrestling matches?',
      funfact:
        'Abraham Lincoln suffered only one recorded defeat. Lincoln was posthumously inducted into the National Wrestling Hall of Fame.',
      type: QuestionType.SINGLE,
      answers: [
        { title: 'Abraham Lincoln', correct: true },
        { title: 'George Washington', correct: false },
        { title: 'John F. Kennedy', correct: false },
        { title: 'Franklin D. Roosevelt', correct: false },
      ],
    },
    {
      title:
        'Which scientist was known for eating exotic animals whenever he could, including giant tortoises of the Galapagos Islands?',
      funfact:
        'Charles Darwin developed a taste for exotic creatures as part of Cambridge’s Glutton Club. His travels aboard The Beagle gave him access to a much broader menu.',
      type: QuestionType.SINGLE,
      answers: [
        { title: 'Charles Darwin', correct: true },
        { title: 'Albert Einstein', correct: false },
        { title: 'Isaac Newton', correct: false },
        { title: 'Galileo Galilei', correct: false },
      ],
    },
    {
      title:
        'Which author survived a train wreck, helping to rescue others from the wreckage before retrieving an early manuscript of Our Mutual Friend?',
      funfact:
        'Charles Dickens was so concerned about the manuscript that he refused to leave it behind, even though it was soaked in water and blood.',
      type: QuestionType.SINGLE,
      answers: [
        { title: 'Charles Dickens', correct: true },
        { title: 'Mark Twain', correct: false },
        { title: 'Ralph Waldo Emerson', correct: false },
        { title: 'FWalt Whitman', correct: false },
      ],
    },
    {
      title:
        'In his book 50 Secrets of Magic Craftsmanship, which artist described a process for waking himself just after falling asleep to harness his dreams for art?',
      funfact:
        'Salvador Dalí used a technique called “slumber with a key” to capture his dreams. He would hold a key in his hand, and when he fell asleep, the key would drop and wake him up, allowing him to remember his dreams.',
      type: QuestionType.SINGLE,
      answers: [
        { title: 'Salvador Dalí', correct: true },
        { title: 'Pablo Picasso', correct: false },
        { title: 'Vincent van Gogh', correct: false },
        { title: 'Leonardo da Vinci', correct: false },
      ],
    },
    {
      title:
        'Which famous composer was known for his love of coffee, reportedly drinking up to 60 cups a day?',
      funfact:
        'Johann Sebastian Bach was such a coffee enthusiast that he even wrote a coffee cantata, which humorously lamented the effects of coffee on his wife.',
      type: QuestionType.SINGLE,
      answers: [
        { title: 'Johann Sebastian Bach', correct: true },
        { title: 'Ludwig van Beethoven', correct: false },
        { title: 'Wolfgang Amadeus Mozart', correct: false },
        { title: 'Frédéric Chopin', correct: false },
      ],
    },
    {
      title:
        'Which Founding Father invented a swimming aid at the age of 11, decades before creating bifocal glasses and the lightning rod?',
      funfact:
        'An avid swimmer from a young age, Benjamin Franklin developed swim fins that resembled paddles to be worn on the hands to help increase thrust in the water.',
      type: QuestionType.SINGLE,
      answers: [
        { title: 'Benjamin Franklin', correct: true },
        { title: 'Thomas Jefferson', correct: false },
        { title: 'George Washington', correct: false },
        { title: 'John Adams', correct: false },
      ],
    },
    {
      title:
        'Which famous artist was known for his love of cats, even painting them into many of his works?',
      funfact:
        'Pablo Picasso had a deep affection for cats and often included them in his paintings. He even had a pet cat named Mau that he painted several times.',
      type: QuestionType.SINGLE,
      answers: [
        { title: 'Pablo Picasso', correct: true },
        { title: 'Vincent van Gogh', correct: false },
        { title: 'Claude Monet', correct: false },
        { title: 'Ernest Hemingway', correct: false },
      ],
    },
    {
      title:
        'Which famous scientist was known for his love of playing the violin, often using it to relax and think through complex problems?',
      funfact:
        'Albert Einstein was an accomplished violinist and often played to help him concentrate and relax. He once said, “Life without playing music is inconceivable to me.”',
      type: QuestionType.SINGLE,
      answers: [
        { title: 'Albert Einstein', correct: true },
        { title: 'Isaac Newton', correct: false },
        { title: 'Galileo Galilei', correct: false },
        { title: 'Niels Bohr', correct: false },
      ],
    },
    {
      title:
        'Which famous criminal preferred the nickname “Snorky,” a term meaning snazzy, to his more common moniker “Scarface”?',
      funfact:
        'Al Capone got his namesake scar after making rude remarks about a fellow hoodlum’s sister.',
      type: QuestionType.SINGLE,
      answers: [
        { title: 'Al Capone', correct: true },
        { title: 'John Dillinger', correct: false },
        { title: 'Lucky Luciano', correct: false },
        { title: 'Meyer Lansky', correct: false },
      ],
    },
    {
      title:
        'Who was bullied by schoolmates for, among other things, speaking French with a thick Corsican accent?',
      funfact:
        'Until he was nine years old, Napoléon lived on the island of Corsica, 105 miles south of France. He retained his Corsican accent throughout his life.',
      type: QuestionType.SINGLE,
      answers: [
        { title: 'Napoléon Bonaparte', correct: true },
        { title: 'Louis XVI', correct: false },
        { title: 'Charles de Gaulle', correct: false },
        { title: 'Louis XIV', correct: false },
      ],
    },
    {
      title:
        'Who dropped out of public school because her teacher refused to teach long division to girls?',
      funfact:
        'Susan B. Anthony’s male teacher thought girls had no need for long division. Her father started his own school for Susan and other selected students.',
      type: QuestionType.SINGLE,
      answers: [
        { title: 'Susan B. Anthony', correct: true },
        { title: 'Elizabeth Cady Stanton', correct: false },
        { title: 'Sojourner Truth', correct: false },
        { title: 'Harriet Tubman', correct: false },
      ],
    },
    {
      title:
        'Which artist was once suspected of stealing Mona Lisa from the Louvre in 1911?',
      type: QuestionType.SINGLE,
      funfact:
        'Pablo Picasso was questioned by police in 1911 after the Mona Lisa was stolen from the Louvre. The painting was missing for over two years before it was recovered.',
      answers: [
        { title: 'Pablo Picasso', correct: true },
        { title: 'Vincent van Gogh', correct: false },
        { title: 'Claude Monet', correct: false },
        { title: 'Henri Matisse', correct: false },
      ],
    },
    {
      title:
        'Which world leader proposed and was rejected by three different women before marrying Clementine Hozier, his wife of 56 years?',
      type: QuestionType.SINGLE,
      funfact:
        'One of Winston Churchill’s marriage proposals was to actress Ethel Barrymore, once regarded as the “first lady” of the American theater.',
      answers: [
        { title: 'Winston Churchill', correct: true },
        { title: 'Franklin D. Roosevelt', correct: false },
        { title: 'Joseph Stalin', correct: false },
        { title: 'Charles de Gaulle', correct: false },
      ],
    },
    {
      title:
        'A seamstress by trade, who was carrying a dress when she was arrested in 1955?',
      type: QuestionType.SINGLE,
      funfact:
        'Rosa Parks was arrested for refusing to give up her bus seat to a white passenger in Montgomery, Alabama.',
      answers: [
        { title: 'Rosa Parks', correct: true },
        { title: 'Harriet Tubman', correct: false },
        { title: 'Sojourner Truth', correct: false },
        { title: 'Ida B. Wells', correct: false },
      ],
    },
    {
      title:
        'In a letter to his cousin (and eventual wife), Elsa, which scientist admitted to hating socks and rarely wore them?',
      type: QuestionType.SINGLE,
      funfact:
        'Einstein’s big toe was so much longer than his other toes that it tended to make holes in his socks. At an early age he decided to stop wearing socks whenever possible.',
      answers: [
        { title: 'Albert Einstein', correct: true },
        { title: 'Isaac Newton', correct: false },
        { title: 'Galileo Galilei', correct: false },
        { title: 'Niels Bohr', correct: false },
      ],
    },
  ],
};

export default [world_history] as GameSeedTemplate[];
