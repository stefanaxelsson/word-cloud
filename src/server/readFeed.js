const FeedParser = require("feedparser");
const request = require("request");
const detectLanguage = require("./detectLanguage");
const createPromiseWrapper = require("./promiseWrapper");

const readFeed = url => {
  const promiseWrapper = createPromiseWrapper();
  const req = request(url, { timeout: 5000 });
  const feedparser = new FeedParser();
  const items = [];

  req.on("error", function() {
    promiseWrapper.reject("Ouups, does the provided url actually exist?");
  });

  req.on("response", function(res) {
    const stream = this;
    if (res.statusCode !== 200) {
      this.emit("error", new Error("Bad status code"));
    } else {
      stream.pipe(feedparser);
    }
  });

  feedparser.on("error", function() {
    promiseWrapper.reject("Ouups, does the provided url actually exist?");
  });

  feedparser.on("end", function() {
    const resolvedItems = Promise.all(items);
    promiseWrapper.resolve(resolvedItems);
  });

  feedparser.on("readable", function() {
    let stream = this;
    let item;

    while ((item = stream.read())) {
      const content = item.description || item.summary || item.title;

      items.push(
        detectLanguage(content, item.language).then(language => {
          return {
            content,
            language
          };
        })
      );
    }
  });

  return promiseWrapper.promise;
};

module.exports = readFeed;
