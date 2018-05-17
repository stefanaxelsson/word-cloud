(() => {
  const config = {
    url: "http://localhost:3000"
  };

  function processResponse(response) {
    return new Promise((resolve, reject) => {
      const callback = response.status < 400 ? resolve : reject;
      response
        .json()
        .then(data => callback({ status: response.status, data: data }));
    });
  }

  class Result {
    constructor() {
      this.onWordsReceived = this.onWordsReceived.bind(this);
      this.onErrorReceived = this.onErrorReceived.bind(this);
      this.onFetchInProgress = this.onFetchInProgress.bind(this);
      this.resultElement = document.querySelector("#result");
      this.errorElement = document.querySelector(".result__error");
      this.wordsElement = document.querySelector(".result__words");
    }

    resetState() {
      this.resultElement.classList.remove("result--no-action");
      this.resultElement.classList.remove("result--error");
      this.resultElement.classList.remove("result--words");
    }

    onWordsReceived(response) {
      this.resetState();
      this.resultElement.classList.add("result--words");

      let html = ["<table>"];
      let i = 0;
      response.data.words.forEach(wordItem => {
        // Filter out any html tags
        const span = document.createElement("span");
        span.innerHTML = wordItem.word;
        const text = span.textContent || "";

        // If word ended up being empty after html filtering, skip it
        if (text && text.length && text !== " " && i < 100) {
          i++;
          html.push(
            `<tr><td>${parseInt(wordItem.count, 10)}<td>${text}</td></tr>`
          );
        }
      });

      html.push("</table>");

      this.wordsElement.innerHTML = html.join("\n");
    }

    onErrorReceived(response) {
      this.resetState();
      this.resultElement.classList.add("result--error");
      this.errorElement.textContent =
        response.data.error || "Ouups, something went wrong";
    }

    onFetchInProgress() {
      this.resetState();
    }
  }

  class WordService {
    getWords(url) {
      const api = new URL(`${config.url}/words`);
      const params = { url };

      Object.keys(params).forEach(key =>
        api.searchParams.append(key, params[key])
      );

      return fetch(api).then(processResponse);
    }
  }

  class InputForm {
    constructor({ onWordsReceived, onErrorReceived, onSubmit }) {
      this.onSubmit = onSubmit;
      this.onWordsReceived = onWordsReceived;
      this.onErrorReceived = onErrorReceived;
      this.submitListener = this.submitListener.bind(this);
      this.addListeners();
      this.words = new WordService();
      document.querySelector("#url").focus();
    }

    submitListener(event) {
      event.preventDefault();
      const url = document.querySelector("#url");

      if (url.validity.valid) {
        const button = document.querySelector("#listWordsButton");
        this.onSubmit();
        button.disabled = true;
        this.words
          .getWords(url.value)
          .then(response => {
            button.disabled = false;
            this.onWordsReceived(response);
          })
          .catch(error => {
            button.disabled = false;
            this.onErrorReceived(error);
          });
      }
    }

    addListeners() {
      document
        .querySelector("#input-form")
        .addEventListener("submit", this.submitListener);
    }
  }

  class Footer {
    render() {
      // Hello crawlers. Please don't be smart :)
      const element = document.querySelector("#email");
      const at = "\u0040";
      const email = `hej${at}stefanaxelsson.se`;
      element.href = `mailto:${email}`;
      element.textContent = email;
    }
  }

  class App {
    render() {
      const result = new Result();
      new InputForm({
        onSubmit: result.onFetchInProgress,
        onWordsReceived: result.onWordsReceived,
        onErrorReceived: result.onErrorReceived
      });
      new Footer().render();
    }
  }

  new App().render();
})();
