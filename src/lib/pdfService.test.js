import pdfService from "./pdfService";

describe("Given you send a page height", () => {
    test("It should update the value", () => {
        const testPageHeight = 300;
        const pageHeight= pdfService.pageHeight(testPageHeight);

        expect(pageHeight).toBe(testPageHeight);
        expect(pdfService.pageHeightValue).toBe(pageHeight);
    });
});

describe("Given you send a page width", () => {
    test("It should update the value", () => {
        const testPageWidth = 500;
        const pageWidth = pdfService.pageWidth(testPageWidth);

        expect(pageWidth).toBe(testPageWidth);
        expect(pdfService.pageWidthValue).toBe(pageWidth);
    });
});

describe("Given you send a flag for strip anchor tags from Html", () => {
    test("It should update the value", () => {
        const testStripAnchorTagsFromHtml = true;
        const stripAnchorTagsFromHtml = pdfService.stripAnchorTagsFromHtml(testStripAnchorTagsFromHtml);

        expect(stripAnchorTagsFromHtml).toBe(testStripAnchorTagsFromHtml);
        expect(pdfService.stripAnchorTagsFromHtml(true)).toBe(stripAnchorTagsFromHtml);
    });
});