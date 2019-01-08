const fs = require('fs');
const WordPOS = require('wordpos');
const wordpos = new WordPOS();
const tensify = require('tensify');
const pluralize = require('pluralize');
const five = require('five');

let words;

const AWordsFilePath = 'AWords.txt';
const GWordsFilePath = 'GWords.txt';
const DWordsFilePath = 'DWords.txt';
const QWordsFilePath = 'QWords.txt';

const acronymsToGenerate = (five() + five()) * five();

getAcronymWords().then(([a, g, d, q]) => {
  for (let i = 0; i < acronymsToGenerate; i++) {
    console.log(`${getRandom(a)} ${getRandom(g)} ${getRandom(d)} ${getRandom(q)}`);
  }
});

async function getAcronymWords() {
  const a = await getAcronymWord(AWordsFilePath, 'a', wordpos.getAdjectives.bind(wordpos));
  const g = await getAcronymWord(GWordsFilePath, 'g', async words => {
    const nouns = await wordpos.getNouns(words);
    return [...new Set(nouns.map(noun => pluralize(noun)))];
    return nouns.filter(noun => noun[noun.length - 1] === 's');
  });
  const d = await getAcronymWord(DWordsFilePath, 'd', async words => {
    const adjectives = await wordpos.getAdjectives(words);
    return [...new Set(adjectives.map(word => tensify(word).past))]
  });
  const q = await getAcronymWord(QWordsFilePath, 'q', wordpos.getAdverbs.bind(wordpos));
  return [a, g, d, q];
}

async function getAcronymWord(filepath, startingLetter, wordFilter) {
  try {
    return fs.readFileSync(filepath, 'utf8').split(',');
  } catch (e) {
    const words = getWords().filter(word => word[0] === startingLetter);
    const filteredWords = await wordFilter(words);
    fs.writeFileSync(filepath, filteredWords);
    return filteredWords;
  }
}

function getRandom(arr){
  return arr[Math.floor(Math.random() * arr.length)];
}
function getWords() {
  words = words || require('words-en').split('\n');
  return words;
}
