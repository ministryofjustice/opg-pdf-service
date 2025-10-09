class PdfConfigService {
  static margin(value) {
    value = parseInt(value);
    return Number.isInteger(value) ? value : 0;
  }

  static stripAnchorTagsFromHtml(value) {
    return value === 'true';
  }

  static embedRemoteImages(value) {
    return value === 'true';
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
    return value === 'true';
  }
}

export default PdfConfigService;
