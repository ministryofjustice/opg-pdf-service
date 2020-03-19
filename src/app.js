const bodyParser = require("body-parser");
const polka = require("polka");
import GeneratePdf from "./lib/generatePdf";
import {error} from "pdf-lib";


function stripAnchorTagsFromHtml(headers) {
  return headers["strip-anchor-tags"] !== undefined;
}

const app = polka()
  .use(bodyParser.text({ type: "text/html", limit: "2000kb" }))
  .post("/generate-pdf", async (req, res) => {
    const result = await GeneratePdf(req.body, {
      stripTags: stripAnchorTagsFromHtml(req.headers)
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
        return res.end("OK");
    } catch(e) {
        res.writeHead(503, {
            'Content-Type': 'application/json',
            'X-Error-Code': 'There is a problem with the service.'
        });
        return res.end();
    }
});

module.exports = app;
