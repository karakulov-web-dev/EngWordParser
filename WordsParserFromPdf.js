const PDFParser = require("pdf2json");

const pathPropsName = Symbol();
const pdfParserPropsName = Symbol();
const pdfDataPropsName = Symbol();

class WordsParserFromPdf extends Array {
  constructor(path) {
    super();
    this[pathPropsName] = path;
    this[pdfParserPropsName] = new PDFParser();
  }
  async parse(cb) {
    await this.readPdf();
    this.processing();
    if (cb) {
      cb(this);
    }
    return this;
  }
  readPdf() {
    return new Promise((resolve, reject) => {
      this[pdfParserPropsName].on("pdfParser_dataReady", pdfData => {
        this[pdfDataPropsName] = pdfData;
        resolve(pdfData);
      });
      this[pdfParserPropsName].loadPDF(this[pathPropsName]);
    });
  }
  processing() {
    let pdfData = this[pdfDataPropsName];
    let words = pdfData.formImage.Pages.reduce((p, c, i, a) => {
      return (p = p.concat(c.Texts));
    }, [])
      .map(item => {
        return item.R[0].T.toLowerCase();
      })
      .filter(string => {
        return /^[a-zA-Z_\-\s]*$/.test(string);
      });
    words = [...new Set(words)];
    this.push(...words);
  }
}

module.exports = WordsParserFromPdf;
