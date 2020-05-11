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
    await page.emulateMedia("print");

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
    await browser.close();
  } catch (error) {
    await browser.close();
    throw error;
  }
  return pdf;
};

export default htmlToPdf;
