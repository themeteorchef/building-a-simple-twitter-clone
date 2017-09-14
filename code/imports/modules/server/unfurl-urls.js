import URI from 'urijs';
import unfurl from './unfurler';

export default async (string) => {
  const urls = [];
  URI.withinString(string, url => urls.push(url));
  return unfurl(urls[0] || '');
};
