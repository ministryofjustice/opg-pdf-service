const bodyParser = require('body-parser');
const polka = require('polka');
import GeneratePdf from './lib/generatePdf';
import pdfService from './lib/pdfConfigService';

const app = polka()
  .use(bodyParser.text({ type: 'text/html', limit: '2000kb' }))
  .post('/generate-pdf', async (req, res) => {
    const result = await GeneratePdf(req.body, {
      stripTags: pdfService.stripAnchorTagsFromHtml(
        req.headers['strip-anchor-tags'],
      ),
      marginTop: pdfService.margin(req.headers['margin-top']),
      marginBottom: pdfService.margin(req.headers['margin-bottom']),
      marginLeft: pdfService.margin(req.headers['margin-left']),
      marginRight: pdfService.margin(req.headers['margin-right']),
      title: pdfService.title(req.headers.title),
      subject: pdfService.subject(req.headers.subject),
      printBackground: pdfService.printBackground(
        req.headers['print-background'],
      ),
      emulateMediaType: pdfService.emulateMediaType(
        req.headers['emulate-media-type'],
      ),
    });

    res.writeHead(200, {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=download.pdf`,
      'Content-Length': result.length,
    });

    res.end(Buffer.from(result, 'binary'));
  });

app.get('/health-check', async (req, res) => {
  try {
    if (process.uptime() > 0) {
      return res.end('OK');
    } else {
      res.writeHead(500, {
        'Content-Type': 'application/json',
        'X-Error-Code': 'The up time is less than zero',
      });
      return res.end();
    }
  } catch (e) {
    res.writeHead(500, {
      'Content-Type': 'application/json',
      'X-Error-Code': 'There is a problem with the service.',
    });
    return res.end();
  }
});

module.exports = app;
