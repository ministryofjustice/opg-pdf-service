class PdfConfigService {

    static pageHeight(height) {
            height = parseInt(height)
            return Number.isInteger(height) ? this.pageHeightValue = height : this.pageHeightValue = 2000;
    }

    static pageWidth(width) {
        width = parseInt(width)
        return Number.isInteger(width)  ? this.pageWidthValue = width : this.pageWidthValue = 1100 ;
    }

    static stripAnchorTagsFromHtml(condition) {
        return this.stripAnchorTagsFromHtmlValue = condition;
    }
}

export default PdfConfigService;