import * as cheerio from 'cheerio';
import http from 'http';
import https from 'https';

var client = http;

const embedRemoteImages = async (html) => {
  const imagePromises = []
  const $ = cheerio.load(html);

  $(':not(template) img').each(function () {
    let $url       = $(this).attr('src');
    let $parsedUrl = new URL($url);

    if ($parsedUrl.protocol !== 'data') {
      // delete image url before attempting replacement
      // this will result in broken images if they're unable to be fetched
      $(this).attr('src', ''); 
      imagePromises.push(fetchRemoteImage($(this), $parsedUrl));
    }
  });

  await Promise.allSettled(imagePromises)
    .then((results) => {
      results.forEach((result) => {
        if (result.status === 'fulfilled') {
          let [element, imageData] = result.value;
          element.attr('src', imageData);
        } else {
          console.log(result.reason.message);
        }
      })
    });

  return $.root().html();
};

const fetchRemoteImage = (element, url) => {
  return new Promise(
    function(resolve, reject) {
      console.log('  - requesting', url.protocol +  '//' + url.host + '' + url.pathname);

      client = (url.protocol === 'https:') ? https : client;

      const req = client.request(
        url,
        function(res) {
          res.setEncoding('base64');

          if (res.statusCode !== 200) {
            reject(new Error('  - response error ' + url.protocol +  '//' + url.host + '' + url.pathname + ' - ' + res.statusCode + ' ' + res.statusMessage));
            return;
          }

          let imageData = "data:" + res.headers["content-type"] + ";base64,";
          res.on('data', (data) => { body += data });
          res.on('end', function() {
            resolve([element, imageData]);
          });
        }
      )

      req.on('error', (e) => {
        reject(new Error('  - request error ' + url.protocol +  '//' + url.host + '' + url.pathname + ' - ' + e.message));
      });

      req.end();
    }
  )
}

export default embedRemoteImages;
