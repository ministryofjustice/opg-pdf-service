import pdfService from "./pdfConfigService";

describe("Given you send a margin top", () => {
    test("It should update the value", () => {
        const testMarginTop = 300;
        const marginTop = pdfService.margin(testMarginTop);

        expect(marginTop).toBe(testMarginTop);
    });
});

describe("Given you send a margin top that is a string", () => {
    test("It should update the value", () => {
        const testMarginTop = "300";
        const marginTop = pdfService.margin(testMarginTop);

        expect(marginTop).toBe(300);
    });
});

describe("Given you dont send a margin top", () => {
    test("It should update the value", () => {
        const testMarginTop = null;
        const marginTop = pdfService.margin(testMarginTop);

        expect(marginTop).toBe(0);
    });
});

describe("Given you send letters to margin top", () => {
    test("It should update the value", () => {
        const testMarginTop = 'abc';
        const marginTop = pdfService.margin(testMarginTop);

        expect(marginTop).toBe(0);
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