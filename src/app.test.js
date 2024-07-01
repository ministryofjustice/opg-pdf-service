import { exitBrowser, initBrowser } from './lib/htmlToPdf';
import { fromBuffer } from 'pdf2pic';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';

import request from 'supertest';
import app from './app';

const testHtml = `<html><head></head><body><p><a href="/home" class="govuk-link">Test with no links</a></p></body></html>0i9`;

beforeEach(async () => {
  await initBrowser();
});

afterAll(async () => {
  await exitBrowser();
});

describe('Given the app gets an api request to an endpoint', () => {
  describe('GET /health-check', () => {
    test('It should respond with a http status code of 200', async () => {
      await request(app.handler)
        .get('/health-check')
        .timeout(1000)
        .retry(2)
        .expect(200);
    });
  });
});

describe('Given the app gets an api request to an endpoint', () => {
  describe('POST /generate-pdf', () => {
    test('It should respond with a valid PDF and correct headers', async () => {
      const response = await request(app.handler)
        .post('/generate-pdf')
        .set('content-type', 'text/html')
        .timeout(1000)
        .send(testHtml);
      expect(response.statusCode).toBe(200);
      expect(response.type).toBe('application/pdf');
      expect(response.headers['content-disposition']).toBe(
        'attachment; filename=download.pdf',
      );
      expect(response.body).toBeInstanceOf(Uint8Array);
    });
  });
  describe('POST /generate-pdf with page width and height', () => {
    test('It should respond with a valid PDF and new page size', async () => {
      const response = await request(app.handler)
        .post('/generate-pdf')
        .set('content-type', 'text/html')
        .timeout(1000)
        .send(testHtml);
      expect(response.statusCode).toBe(200);
      expect(response.type).toBe('application/pdf');
      expect(response.headers['content-disposition']).toBe(
        'attachment; filename=download.pdf',
      );
      expect(response.body).toBeInstanceOf(Uint8Array);
    });
  });

  describe('POST /generate-pdf with known HTML', () => {
    test('It should respond with a consistently rendered PDF', async () => {
      const files = readdirSync('/app/src/baseline').filter((file) =>
        file.endsWith('.html'),
      );

      const matchPromises = files.map(async (file) => {
        const name = file.substring(0, file.length - 5);

        const html_path = `src/baseline/${name}.html`;
        const baseline_image_path = `src/baseline/${name}.1.png`;
        const generated_image_path = `test-results/images/${name}.1.png`;
        const diff_image_path = `test-results/images/${name}.diff.png`;

        const response = await request(app.handler)
          .post('/generate-pdf')
          .set('content-type', 'text/html')
          .timeout(10000)
          .send(readFileSync(`/app/${html_path}`));

        // expected output
        const options = {
          density: 100,
          saveFilename: name,
          savePath: '/app/test-results/images',
          format: 'png',
          width: 600,
          preserveAspectRatio: true,
        };

        const convert = fromBuffer(response.body, options);
        const pageToConvertAsImage = 1;
        await convert(pageToConvertAsImage, { responseType: 'image' });

        const baseline_image = PNG.sync.read(readFileSync(`/app/${baseline_image_path}`));
        const generated_image = PNG.sync.read(readFileSync(`/app/${generated_image_path}`));
        const { width, height } = baseline_image;

        const diff = new PNG({ width, height });
        const match = pixelmatch(
          baseline_image.data,
          generated_image.data,
          diff.data,
          baseline_image.width,
          baseline_image.height,
          { threshold: 0.1 },
        );

        writeFileSync(`/app/${diff_image_path}`, PNG.sync.write(diff));

        return {
          result: match,
          html: html_path,
          baseline_image: baseline_image_path,
          generated_image: generated_image_path,
          diff_image: diff_image_path
        };
      });

      const matches = await Promise.all(matchPromises);

      let comparison_passed = true;
      matches.forEach(function (match) {
        console.log(`
          ****************************\n
          Comparing generated image ${match['generated_image']}\n
          from HTML file ${match['html']}\n
          with baseline image ${match['baseline_image']}\n
          Diff PNG is in ${match['diff_image']}\n
          RESULT (0 is good, anything else is bad): ${match['result']}
        `)

        if (match['result'] !== 0) {
          comparison_passed = false;
        }
      });

      expect(comparison_passed).toEqual(true);
    });
  });
});
