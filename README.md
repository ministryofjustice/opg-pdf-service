[![pre-commit](https://img.shields.io/badge/pre--commit-enabled-brightgreen?logo=pre-commit&logoColor=white)](https://github.com/pre-commit/pre-commit)

# PDF Service

The following service allows you to post html to a endpoint at `/generate-pdf` and returns a `application/pdf` response containing a PDF.

The service automatically runs on docker-compose up. Its entry point is `npm run start:webserver`

To start the service locally without docker, run `npm run start:webserver`.

Locally this will run at [http://localhost:9004](http://localhost:9004)

When on staging or live, the url will be available in the PHP Environment variable `PDF_SERVICE_URL`

## Testing

The project uses Jest to test the javascript components. Only `server.js` is ignored due to its implementation not needing testing.

Jest also provides us with code coverage reports. There are currently no thresholds setup to fail tests but this could be done in the future.

Coverage is fed into codecov for reporting via Github and also hooked into CircleCI which will fail the build if any tests fail.

You can run the test by running the following

`npm run test` - This will run tests and generate a coverage report
`npm run test:watch` - This will run tests without coverage but in a watch state so you can get instant feedback when developing.

## Puppeteer

Puppeteer is used for the parsing of HTML and CSS as well as the generation of the PDF. Passing in a HTML document with embedded CSS in a style tag will generate an accessible PDF for download.

There are some things to be aware of that affect performance.

CSS and Fonts _must_ be embedded directly in the HTML. The reason for doing this is it drastically reduces the load time for the generation.

The reason is that chrome will make network requests to the fonts and CSS file which will extend the page load speed by on average 2 seconds. If they are inline it reduces it to around 300-500ms instead.

For example, this can be done by extracting the CSS from the external file and putting it into the `<head></head>` tag like below.

```
<style type="text/css">
    body {
        color: #000000
    }
</style>
```

## Automatic CSS and Font Generation

Within `service-front/web` there is a webpack configuration that on build will do the following.

- Parse the SCSS in the project
- Pull in all fonts
- base64 encode the fonts
- Add the fonts to the parsed CSS
- Save the output to a file called `pdf.css`

This means whenever styles change on the site, `pdf.css` will be updated in a compatible way to be embedded in a HTML document to be passed to this service.

## API

The api details to call are as follows

- URL: `/generate-pdf`
- Body: `HTML and CSS Content`

### Request Headers

- Content-Type: `text/html`
- strip-anchor-tags: `true` (optional)

If the `strip-anchor-tags` header is present then the service will remove all anchor links in the document, else it will leave them present and clickable.

- print-background: `true` (optional)

If the `print-background` header is present then the service will include background colours and images, else it will exclude them.

- emulate-media-type: `print` (optional)

If the `emulate-media-type` header is set to `print` it will attempt to render the PDF with any linked print styles. If it is set to `screen` it will use the standard style tags.

- page-width: `1100` (optional)
- page-height: `2000` (optional)

If the `page-width` & `page-height` header is not present it will default to `1100` & `2000`

### Response Headers

- Content-Type: `application/pdf`
- Content-Disposition: `attachment; filename=download.pdf`
- Content-Length: `number`

## Pre-Commit Hooks

The root of this project contains a `.pre-commit-config.yaml` file used with [pre-commit](https://pre-commit.com/) to automate the running of tasks when a commit is made with github.
