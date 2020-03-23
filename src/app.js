const bodyParser = require("body-parser");
const polka = require("polka");
import GeneratePdf from "./lib/generatePdf";
import {error} from "pdf-lib";


function stripAnchorTagsFromHtml(headers) {
  return headers["strip-anchor-tags"] !== undefined;
}

function pageWidth(headers) {
    return headers["page-width"] !== undefined;
}

function pageHeight(headers) {
    return headers["page-height"] !== undefined;
}

const app = polka()
  .use(bodyParser.text({ type: "text/html", limit: "2000kb" }))
  .post("/generate-pdf", async (req, res) => {
    const result = await GeneratePdf(req.body, {
        stripTags: stripAnchorTagsFromHtml(req.headers),
        pageWidth: pageWidth(req.headers),
        pageHeight: pageHeight(req.headers)
    });

    res.writeHead(200, {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=download.pdf`,
      "Content-Length": result.length
    });

    res.end(Buffer.from(result, "binary"));
  });

app.get("/health-check", async (req, res) => {
    try {
        if (process.uptime() > 0) {
            return res.end("OK");
        } else {
            res.writeHead(500, {
                'Content-Type': 'application/json',
                'X-Error-Code': 'The up time is less than zero'
            });
            return res.end();
        }
    } catch(e) {
        res.writeHead(500, {
            'Content-Type': 'application/json',
            'X-Error-Code': 'There is a problem with the service.'
        });
        return res.end();
    }
});

module.exports = app;
