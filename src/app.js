import healthCheck from "./healthCheck/healthCheck";

const bodyParser = require("body-parser");
const polka = require("polka");
import GeneratePdf from "./lib/generatePdf";
import {error} from "pdf-lib";

function stripAnchorTagsFromHtml(headers) {
  return headers["strip-anchor-tags"] !== undefined;
}

const handleError = (res, err) => {
    res.status(503).json({
        error: err
    })
};

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

app.get("/healthcheck", async (req, res) => {
    try {
        throw new Error("ooopss");
        return res.end("OK");
    } catch(e) {
        return res.end(e);
        // handleError(res, err);
    }
});

module.exports = app;
