const fs = require('fs');
const WordPOS = require('wordpos');
const wordpos = new WordPOS();
const tensify = require('tensify');
const pluralize = require('pluralize');
let words;

const AWordsFilePath = 'AWords.txt';
const GWordsFilePath = 'GWords.txt';
const DWordsFilePath = 'DWords.txt';
const QWordsFilePath = 'QWords.txt';

//Generates an acronym for agdq.  Pass in an object containing values for any of a, g, d or q to use those values for that part of the acronym instead of generating a random one.
module.exports.generateAcronym = async ({ a, g, d, q } = {}) => {
  a = a || getRandom(await getAcronymWord(AWordsFilePath, 'a', wordpos.getAdjectives.bind(wordpos)));
  g = g || getRandom(await getAcronymWord(GWordsFilePath, 'g', async words => {
    const nouns = await wordpos.getNouns(words);
    return [...new Set(nouns.map(noun => pluralize(noun)))];
  }));
  d = d || getRandom(await getAcronymWord(DWordsFilePath, 'd', async words => {
    const adjectives = await wordpos.getAdjectives(words);
    return [...new Set(adjectives.map(word => tensify(word).past))]
  }));
  q = q || getRandom(await getAcronymWord(QWordsFilePath, 'q', wordpos.getAdverbs.bind(wordpos)));
  return { a, g, d, q };
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

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function getWords() {
  words = words || require('words-en').split('\n');
  return words;
}
