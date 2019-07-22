const WordsParserFromPdf = require("./WordsParserFromPdf");
const AsyncArray = require("./AsyncArray");
const axios = require("axios");
const fs = require("fs");

class PdfToAnkiFormat {
  constructor(path, startPositionWord, endtPositionWord) {
    this.words = new WordsParserFromPdf(path);
    this.startPositionWord = startPositionWord;
    this.endtPositionWord = endtPositionWord;
  }
  async build() {
    this.words = await this.words.parse();

    let { startPositionWord, endtPositionWord } = this;

    let part = this.words.slice(startPositionWord, endtPositionWord);
    part = new AsyncArray(...part);

    let translate = bind(this.translate, this);
    let delay2000 = noModifyArgument(bind(delay, null, 1000));
    let log = noModifyArgument(bind(console.log, console));

    let pipe = awaitPipe(translate, delay2000, log);
    try {
      var resultArr = await part.mapAwait(pipe);
    } catch (e) {
      console.log(e);
    }
    fs.writeFile("./AnkiFormat.txt", resultArr.join("\n"), null, err => {
      if (err) {
        console.log(err);
      }
    });
  }
  async translate(text) {
    let result = await axios.get(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ru&dt=t&q=${text}`
    );

    try {
      var ru = result.data[0][0][0];
    } catch (e) {
      ru = "";
    }
    return `${text}\t${ru}`;
  }
}

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

function awaitPipe(...functions) {
  return async param => {
    for (let f of functions) {
      param = await f(param);
    }
    return param;
  };
}

function bind(f, context, ...arg) {
  return f.bind(context, ...arg);
}

function noModifyArgument(f) {
  return async arg => {
    await f(arg);
    return arg;
  };
}

let ankiFormat = new PdfToAnkiFormat("./test.pdf", 350, 370);
ankiFormat.build();

function th(f, promise) {
  return () => {
    return new Promise(resolve => {
      promise
        .then(data => {
          f(data, resolve);
        })
        .catch(err => {
          f(err, resolve);
        });
    });
  };
}
