const request = require("supertest");
const app = require("./app");

const testHtml = `<html><head></head><body><p><a href="/home" class="govuk-link">Test with no links</a></p></body></html>`;

describe("Given the app gets an api request to an endpoint", () => {
  describe("POST /generate-pdf", () => {
    test("It should respond with a valid PDF and correct headers", async () => {
      const response = await request(app.handler)
        .post("/generate-pdf")
        .set("content-type", "text/html")
        .send(testHtml);
      expect(response.statusCode).toBe(200);
      expect(response.type).toBe("application/pdf");
      expect(response.headers["content-disposition"]).toBe(
        "attachment; filename=download.pdf"
      );
      expect(response.body).toBeInstanceOf(Uint8Array);
    });
  });
});

describe("Given the app gets an api request to an endpoint", () => {
  describe("GET /health-check", () => {
    test("It should respond with a http status code of 200", async () => {
      const response = await request(app.handler)
          .get("/health-check");
      expect(response.statusCode).toBe(200);
    });
  });
});

describe("Given the app gets an api request to an endpoint", () => {
  describe("GET /health-check", () => {
    test("It should respond with a http status code of 503", async () => {
      const response = await request(app.handler)
          .get("/health-check").throw("I am an Error");
      expect(response.statusCode).toBe(503);
    });
  });
});
