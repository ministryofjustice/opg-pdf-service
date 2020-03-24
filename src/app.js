const bodyParser = require("body-parser");
const polka = require("polka");
import GeneratePdf from "./lib/generatePdf";
import {error} from "pdf-lib";


function stripAnchorTagsFromHtml(headers) {
  return headers["strip-anchor-tags"] !== undefined;
}

const app = polka()
  .use(bodyParser.json({ type: "application/json" }))
  .post("/generate-pdf", async (req, res) => {
    const result = await GeneratePdf(req.body.html, {
        stripTags: stripAnchorTagsFromHtml(req.headers),
        pageWidth: req.body.pageWidth,
        pageHeight:req.body.pageHeight
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
