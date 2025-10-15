import embedRemoteImages from './embedRemoteImages';

const testHtml = `<html>
<head>
</head>
<body>
<img src="http://static-server/remote_image.jpg"/>
<img src="http://static-server/not_found.jpg"/>
<img src="https://does-not-exist/not_found.jpg"/>
<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="/>
</body>
</html>`;

describe('Given you have a HTML document with remote images in it', () => {
  test('it should replace remote images with data: urls where it can', async () => {
    const result = await embedRemoteImages(testHtml);

    expect(result).not.toBeNull();
    expect(result).toEqual(`<html>
<head>
</head>
<body>
<img src="data:image/png;base64,[[whatever the Base 64 of of the image is]]"/>
<img src="http://static-server/not_found.jpg"/>
<img src="https://does-not-exist/not_found.jpg"/>
<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="/>
</body>
</html>`);
  });
});
