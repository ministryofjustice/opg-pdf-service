import htmlToPdf from "./htmlToPdf";

describe("Given you pass HTML to be returned into PDF", () => {
  const testHtml = `<html><head></head><body><p><a href="/home" class="govuk-link">Test with no links</a></p></body></html>`;

  describe("Given a PDF is not generated correctly due to an error", () => {
    test("it should return null and throw an error", () => {
      return expect(
        htmlToPdf(testHtml, { waitUntil: "loads", pageHeight: 2000, pageWidth: 1100 })
      ).rejects.toThrow("PDF Generation Error");
    });
  });
  describe("Given a PDF is valid and to be generated", () => {
    test("it should generate a PDF using puppeteer successfully", async () => {
      const pdf = await htmlToPdf(testHtml, { waitUntil: "load", pageHeight: 2000, pageWidth: 1100 });

      expect(pdf).not.toBeNull();
      expect(pdf).toBeInstanceOf(Uint8Array);
    });
  });

  describe("Given a PDF is valid with page sizing sent and to be generated", () => {
    test("it should generate a PDF using puppeteer successfully", async () => {
      const pdf = await htmlToPdf(testHtml, { waitUntil: "load", pageHeight: 20, pageWidth: 40 });

      expect(pdf).not.toBeNull();
      expect(pdf).toBeInstanceOf(Uint8Array);
    });
  });
});
