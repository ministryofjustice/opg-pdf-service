const puppeteer = require("puppeteer");

let browser = null;

async function initBrowser() {
  browser = await puppeteer.launch({
        args: [
          // Required for Docker version of Puppeteer
          "--no-sandbox",
          "--disable-setuid-sandbox",
          // This will write shared memory files into /tmp instead of /dev/shm,
          // because Docker’s default for /dev/shm is 64MB
          "--disable-dev-shm-usage",
          '--disable-gpu',
        ]
      }
  );
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

    // This will happen when you call browser.close(), not just when problems occur
    browser.on('disconnected', async () => {
      console.log("Browser disconnected");

      browser = null;
    });
  }

  let pdf;

  const page = await browser.newPage();

  try {
    await page.emulateMediaType(options.emulateMediaType);

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
      format: 'A4'
    });
  } finally {
    await page.close();
  }

  return pdf;
};
