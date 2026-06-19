import assert from 'node:assert';
import { describe, test } from 'node:test';
import pdfService from './pdfConfigService.js';

describe('Given you send a margin top', () => {
  test('It should update the value', () => {
    const testMarginTop = 300;
    const marginTop = pdfService.margin(testMarginTop);

    assert.strictEqual(marginTop, testMarginTop);
  });
});

describe('Given you send a margin top that is a string', () => {
  test('It should update the value', () => {
    const testMarginTop = '300';
    const marginTop = pdfService.margin(testMarginTop);

    assert.strictEqual(marginTop, 300);
  });
});

describe('Given you dont send a margin top', () => {
  test('It should update the value', () => {
    const testMarginTop = null;
    const marginTop = pdfService.margin(testMarginTop);

    assert.strictEqual(marginTop, 0);
  });
});

describe('Given you send letters to margin top', () => {
  test('It should update the value', () => {
    const testMarginTop = 'abc';
    const marginTop = pdfService.margin(testMarginTop);

    assert.strictEqual(marginTop, 0);
  });
});

describe('Given you send a flag for strip anchor tags from Html', () => {
  test('It should update the value', () => {
    const testStripAnchorTagsFromHtml = 'true';
    const stripAnchorTagsFromHtml = pdfService.stripAnchorTagsFromHtml(
      testStripAnchorTagsFromHtml,
    );

    assert.strictEqual(stripAnchorTagsFromHtml, true);
    assert.strictEqual(
      pdfService.stripAnchorTagsFromHtml(testStripAnchorTagsFromHtml),
      stripAnchorTagsFromHtml,
    );
  });
});

describe('Given you send letters to emulate media type as screen', () => {
  test('It should update the value', () => {
    const emulateMediaType = pdfService.emulateMediaType('screen');

    assert.strictEqual(emulateMediaType, 'screen');
  });
});

describe('Given you send letters to emulate media type as an empty value', () => {
  test('It should default to print', () => {
    const emulateMediaType = pdfService.emulateMediaType();

    assert.strictEqual(emulateMediaType, 'print');
  });
});

describe('Given you send letters to print background images', () => {
  test('It should be true', () => {
    const printBackground = pdfService.printBackground('true');

    assert.strictEqual(printBackground, true);
  });
});

describe('Given you send letters to not print background images', () => {
  test('It should be false', () => {
    const printBackground = pdfService.printBackground();

    assert.strictEqual(printBackground, false);
  });
});

describe('Given you send letters with a subject', () => {
  test('It should be set', () => {
    const subject = pdfService.subject('Test Subject');

    assert.strictEqual(subject, 'Test Subject');
  });
});

describe('Given you send letters without a subject', () => {
  test('It should return the default', () => {
    const subject = pdfService.subject();

    assert.strictEqual(subject, '');
  });
});

describe('Given you send letters with a title', () => {
  test('It should be set', () => {
    const title = pdfService.title('Test Title');

    assert.strictEqual(title, 'Test Title');
  });
});

describe('Given you send letters without a title', () => {
  test('It should return the default', () => {
    const title = pdfService.title();

    assert.strictEqual(title, 'View LPA - View a lasting power of attorney');
  });
});
