const { detect } = require("cld");
const createPromiseWrapper = require("./promiseWrapper");

const supportedLanguages = [
  "ar",
  "bn",
  "br",
  "da",
  "de",
  "en",
  "es",
  "fa",
  "fr",
  "hi",
  "it",
  "ja",
  "nl",
  "no",
  "pl",
  "pt",
  "ru",
  "sv",
  "zh"
];

const detectLanguage = (value, preferredLanguage) => {
  if (supportedLanguages.includes(preferredLanguage)) {
    return Promise.resolve(preferredLanguage);
  }

  const promiseWrapper = createPromiseWrapper();

  detect(value, function(err, result) {
    if (
      result &&
      result.reliable &&
      result.languages &&
      supportedLanguages.includes(result.languages[0].code)
    ) {
      promiseWrapper.resolve(result.languages[0].code);
    } else {
      promiseWrapper.resolve();
    }
  });

  return promiseWrapper.promise;
};

module.exports = detectLanguage;
