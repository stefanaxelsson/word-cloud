jest.mock("../readFeed", () => url => {
  return Promise.resolve([
    {
      content: "Fågeln flyger över vägen. Och fågeln flyger vidare.",
      language: "sv"
    },
    { content: "She's a front-end-developer, not a bird.", language: "en" }
  ]);
});
const getWords = require("../getWords");

describe("getWords", () => {
  it("returns sorted words based on occurrence", async () => {
    const words = await getWords("example.com");

    expect(words).toEqual([
      { count: 2, word: "flyger" },
      { count: 1, word: "Fågeln" },
      { count: 1, word: "över" },
      { count: 1, word: "vägen" },
      { count: 1, word: "fågeln" },
      { count: 1, word: "vidare" },
      { count: 1, word: "She's" },
      { count: 1, word: "front-end-developer" },
      { count: 1, word: "not" },
      { count: 1, word: "bird" }
    ]);
  });
});
