class PdfConfigService {
  static margin(value) {
    value = parseInt(value);
    return Number.isInteger(value) ? value : 0;
  }
  static stripAnchorTagsFromHtml(value) {
    return (this.stripAnchorTagsFromHtmlValue = value == 'true'); // jshint ignore:line
  }

  static title(title) {
    return title ? title : 'View LPA - View a lasting power of attorney';
  }

  static subject(subject) {
    return subject ? subject : '';
  }

  static emulateMediaType(emulateMediaType) {
    return emulateMediaType ? emulateMediaType : 'print';
  }

  static printBackground(value) {
    return (this.printBackgroundValue = value == 'true'); // jshint ignore:line
  }
}

export default PdfConfigService;
