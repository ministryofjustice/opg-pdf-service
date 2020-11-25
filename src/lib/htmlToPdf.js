const puppeteer = require("puppeteer");
const htmlToPdf = async (html, options) => {
  const browser = await puppeteer.launch({
    args: [
      // Required for Docker version of Puppeteer
      "--no-sandbox",
      "--disable-setuid-sandbox",
      // This will write shared memory files into /tmp instead of /dev/shm,
      // because Docker’s default for /dev/shm is 64MB
      "--disable-dev-shm-usage"
    ]
  });

  let pdf;

  try {
    const page = await browser.newPage();
    await page.emulateMediaType("print");

    await page.setContent(html, options);
    pdf = await page.pdf({
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
    await browser.close();
  }

  return pdf;
};

export default htmlToPdf;
