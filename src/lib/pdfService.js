class PdfService {

    static pageHeight(height) {
        return height ? this.pageHeightValue = height : this.pageHeightValue = 2000;
    }

    static pageWidth(width) {
        return width ? this.pageWidthValue = width : this.pageWidthValue = 1100;
    }

    static stripAnchorTagsFromHtml(condition) {
        return this.stripAnchorTagsFromHtmlValue = condition;
    }
}

export default PdfService;