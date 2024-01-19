![docs-workflow](https://github.com/ministryofjustice/opg-pdf-service/actions/workflows/docs.yml/badge.svg)
![build-workflow](https://github.com/ministryofjustice/opg-pdf-service/actions/workflows/build.yml/badge.svg)

[![pre-commit](https://img.shields.io/badge/pre--commit-enabled-brightgreen?logo=pre-commit&logoColor=white)](https://github.com/pre-commit/pre-commit)
![licence](https://img.shields.io/github/license/ministryofjustice/opg-pdf-service.svg)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

[OpenAPI Documentation Site](https://docs.pdf.opg.service.justice.gov.uk)

# PDF Service

The following service allows you to post html to an endpoint at `/generate-pdf` and returns a `application/pdf` response containing a PDF.

The service automatically runs on docker compose up. Its entry point is `npm run start:webserver`

To start the service locally without docker, run `npm run start:webserver`.

Locally this will run at [http://localhost:9004](http://localhost:9004)

When on staging or live, the url will be available in the PHP Environment variable `PDF_SERVICE_URL`

## Contact

Should you wish to talk to others about using this service, you can find help in the `#ss-opg-pdf-service` slack channel.

## Node Versions

We recommend using [Node Version Manager](https://github.com/nvm-sh/nvm#installing-and-updating) while working on this project.

The version of node to use while working on this project is set in the [.nvmrc](./.nvmrc) file. This file is used for the CI and local development.

To ensure you are using the correct version of Node, run the following commands using `nvm`.

`nvm use` - will read the `.nvmrc` file and set your node version to it.

If you get an error saying it is not installed, run the following command to install ther required version and enable it.

`nvm install` - will read the `.nvmrc` file, download that version and set your node version to it.

If you need to install a newer version of node, you should set the version in this file and run the above steps. The CI will automatically read this file and install the appropriate version.

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

``` css
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

## Documentation

We use an OpenAPI Spec for generating our documentation for this service. Full documenation can be found at our
[OpenAPI Documentation Site](https://docs.pdf.opg.service.justice.gov.uk).

## Pre-Commit Hooks

The root of this project contains a `.pre-commit-config.yaml` file used with [pre-commit](https://pre-commit.com/) to automate the running of tasks when a commit is made with github.

## Render Diffs

To aid in catching rendering differences betwen versions, there's a test 'It should respond with a consistently rendered PDF' that runs an example html file in `src/assets/opgTestLetter.js` through the PDF process and then renders it as an image in `test-results/images/logo.pdf.1.png`. The outputs of this are checked against a baseline in `/src/baseline/logo.pfd.1.png`.

The test will check for 0 diff in output render between builds, so will fail if the HTML is converted differently for some reason i.e. a dependency update.  A diff file in created at `test-results/images/logo-pdf.1.diff.png` where red pixels will show drift.
