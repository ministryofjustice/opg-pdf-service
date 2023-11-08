import cheerio from 'cheerio';

const stripAnchorTags = async (html) => {
  const $ = cheerio.load(html);
  $('a').each(function () {
    $(this).removeAttr('href');
  });

  return $.root().html();
};

export default stripAnchorTags;
