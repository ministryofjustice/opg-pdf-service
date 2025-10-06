import puppeteer from 'puppeteer';

let browser = null;

export async function initBrowser() {
  browser = await puppeteer.launch({
    headless: 'true',
    args: [
      // Required for Docker version of Puppeteer
      '--no-sandbox',
      '--disable-setuid-sandbox',
      // This will write shared memory files into /tmp instead of /dev/shm,
      // because Docker’s default for /dev/shm is 64MB
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--disable-extensions',
    ],
  });

  // This will happen when you call browser.close(), not just when problems occur
  browser.on('disconnected', async () => {
    console.log('> Browser disconnected');

    browser = null;
  });

  browser.on('targetcreated', async () => {
    console.log('> PDF requested');
  });
}

export async function exitBrowser() {
  if (browser === null) {
    return;
  }

  await browser.close();
}

export const htmlToPdf = async (html, options) => {
  if (browser === null) {
    await initBrowser();
  }

  let pdf;

  const page = await browser.newPage();

  page.on('console', (msg) => console.log('>- page logged: ', msg.text()));
  page.on('requestfailed', (request) => {
    console.log(
      '>- page request failed: ',
      request.url() + ' ' + request.failure().errorText,
    );
  });

  try {
    await page.emulateMediaType(
      options.emulateMediaType ? options.emulateMediaType : 'print',
    );

    await page.setContent(html, options);
    pdf = await page.pdf({
      printBackground: options.printBackground,
      preferCSSPageSize: false,
      margin: {
        top: options.marginTop,
        bottom: options.marginBottom,
        right: options.marginRight,
        left: options.marginLeft,
      },
      format: 'A4',
    });
  } finally {
    await page.close();
  }

  return pdf;
};
