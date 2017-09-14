import cheerio from 'cheerio';
import { HTTP } from 'meteor/http';

const getTwitterMetadata = (metatags) => {
  const metadata = {};
  Object.keys(metatags).forEach((key) => {
    const tag = metatags[key];
    if (tag.attribs && tag.attribs.name) {
      const name = tag.attribs.name;
      const isSocialMetadata = name.includes('twitter:') || name.includes('og:');
      if (isSocialMetadata) metadata[tag.attribs.name] = tag.attribs.content;
    }
  });
  return Object.keys(metadata).length > 0 ? metadata : null;
};

const getMetadataFromPage = $ => $('head').find('meta');

const getPageAsDOM = string => cheerio.load(string);

export default url =>
new Promise((resolve, reject) => {
  if (url) {
    HTTP.get(url, (error, response) => {
      if (error) reject(error);
      resolve(getTwitterMetadata(getMetadataFromPage(getPageAsDOM(response.content))));
    });
  } else {
    resolve();
  }
});
