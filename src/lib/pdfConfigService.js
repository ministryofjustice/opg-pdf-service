class PdfConfigService {

    static margin(value) {
            value = parseInt(value)
            return Number.isInteger(value) ? value : 0;
    }
    static stripAnchorTagsFromHtml(condition) {
        return this.stripAnchorTagsFromHtmlValue = condition;
    }

    static title(title) {
        return title ? title : "View LPA - View a lasting power of attorney";
    }

    static subject(subject) {
        return subject ? subject : "";
    }
}

export default PdfConfigService;