class PdfService {

    static pageHeight(height) {
        return this.pageHeightValue = height;
    }

    static pageWidth(width) {
        return this.pageWidthValue = width;
    }

    static stripAnchorTagsFromHtml(condition) {
        return this.stripAnchorTagsFromHtmlValue = condition;
    }
}

export default PdfService;