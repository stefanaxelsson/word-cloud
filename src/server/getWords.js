const readFeed = require("./readFeed");
const stopword = require("stopword");
const createPromiseWrapper = require("./promiseWrapper");

const getWords = async url => {
  const promiseWrapper = createPromiseWrapper();
  const words = new Map();
  const items = await readFeed(url).catch(e => promiseWrapper.reject(e));

  if (items && items.length) {
    items.forEach(item => {
      /**
       * Remove non-word characters.
       * This could be improved further using v8s new unicode support and
       * using a dom parser to remove html. Handling of special characters
       * like ' and also - needs to a cleaner approach. There is no normalizing, i.e.
       * Bird and bird will be detected as two separate words.
       */
      let content = item.content.replace(/[^a-zåäö'-]/gim, " ");
      content = content.replace(/[\s]+/gm, " ");
      content = content.trim();

      let itemWords = content.split(" ");
      if (item.language) {
        itemWords = stopword.removeStopwords(
          itemWords,
          stopword[item.language]
        );
      }

      // "She's" and "Front-end" should be allowed but not single ' or -
      itemWords = itemWords.filter(itemWord => !["'", "-"].includes(itemWord));

      itemWords.forEach(itemWord => {
        if (words.has(itemWord)) {
          words.set(itemWord, words.get(itemWord) + 1);
        } else {
          words.set(itemWord, 1);
        }
      });
    });

    const sortedWords = Array.from(words)
      .map(item => ({ word: item[0], count: item[1] }))
      .sort((a, b) => b.count - a.count);

    promiseWrapper.resolve(sortedWords);
  } else {
    promiseWrapper.reject("Sorry, your feed doesn't seem to have any items");
  }

  return promiseWrapper.promise;
};

module.exports = getWords;
