import pdfService from "./pdfConfigService";

describe("Given you send a page height", () => {
    test("It should update the value", () => {
        const testPageHeight = 300;
        const pageHeight= pdfService.pageHeight(testPageHeight);

        expect(pageHeight).toBe(testPageHeight);
        expect(pdfService.pageHeightValue).toBe(pageHeight);
    });
});

describe("Given you send a page height that is a string", () => {
    test("It should update the value", () => {
        const testPageHeight = "300";
        const pageHeight= pdfService.pageHeight(testPageHeight);

        expect(pageHeight).toBe(parseInt(testPageHeight));
        expect(pdfService.pageHeightValue).toBe(pageHeight);
    });
});

describe("Given you dont send a page height", () => {
    test("It should update the value", () => {
        const testPageHeight = null;
        const pageHeight= pdfService.pageHeight(testPageHeight);

        expect(pageHeight).toBe(2000);
        expect(pdfService.pageHeightValue).toBe(pageHeight);
    });
});

describe("Given you send letters to page height", () => {
    test("It should update the value", () => {
        const testPageHeight = "abc";
        const pageHeight= pdfService.pageHeight(testPageHeight);

        expect(pageHeight).toBe(2000);
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

describe("Given you send a page width that is a string", () => {
    test("It should update the value", () => {
        const testPageWidth = "500";
        const pageWidth = pdfService.pageWidth(testPageWidth);

        expect(pageWidth).toBe(parseInt(testPageWidth));
        expect(pdfService.pageWidthValue).toBe(pageWidth);
    });
});

describe("Given you dont send a page width", () => {
    test("It should update the value", () => {
        const testPageWidth = null;
        const pageWidth = pdfService.pageHeight(testPageWidth);

        expect(pageWidth).toBe(2000);
        expect(pdfService.pageHeightValue).toBe(pageWidth);
    });
});

describe("Given you send letters to page width", () => {
    test("It should update the value", () => {
        const testPageWidth = "abc";
        const pageWidth = pdfService.pageHeight(testPageWidth);

        expect(pageWidth).toBe(2000);
        expect(pdfService.pageHeightValue).toBe(pageWidth);
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