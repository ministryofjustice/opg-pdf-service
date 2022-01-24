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
        const testStripAnchorTagsFromHtml = "true";
        const stripAnchorTagsFromHtml = pdfService.stripAnchorTagsFromHtml(testStripAnchorTagsFromHtml);

        expect(stripAnchorTagsFromHtml).toBeTruthy();
        expect(pdfService.stripAnchorTagsFromHtml(testStripAnchorTagsFromHtml)).toBe(stripAnchorTagsFromHtml);
    });
});

describe("Given you send letters to emulate media type as screen", () => {
    test("It should update the value", () => {
        const emulateMediaType = pdfService.emulateMediaType("screen");

        expect(emulateMediaType).toBe("screen");
    });
});

describe("Given you send letters to emulate media type as an empty value", () => {
    test("It should default to print", () => {
        const emulateMediaType = pdfService.emulateMediaType();

        expect(emulateMediaType).toBe("print");
    });
});

describe("Given you send letters to print background images", () => {
    test("It should be true", () => {
        const printBackground = pdfService.printBackground("true");

        expect(printBackground).toBeTruthy();
    });
});

describe("Given you send letters to not print background images", () => {
    test("It should be false", () => {
        const printBackground = pdfService.printBackground();

        expect(printBackground).toBeFalsy();
    });
});

describe("Given you send letters with a subject", () => {
    test("It should be set", () => {
        const subject = pdfService.subject("Test Subject");

        expect(subject).toBe("Test Subject");
    });
});

describe("Given you send letters without a subject", () => {
    test("It should return the default", () => {
        const subject = pdfService.subject();

        expect(subject).toBe("");
    });
});

describe("Given you send letters with a title", () => {
    test("It should be set", () => {
        const title = pdfService.title("Test Title");

        expect(title).toBe("Test Title");
    });
});

describe("Given you send letters without a title", () => {
    test("It should return the default", () => {
        const title = pdfService.title();

        expect(title).toBe("View LPA - View a lasting power of attorney");
    });
});
