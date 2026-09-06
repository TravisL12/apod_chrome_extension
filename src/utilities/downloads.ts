import { TApodResponse } from '../pages/types';
import { isoDateFormat } from './dates';

/**
 * Saving the image cannot go through the page: an `<a download>` is ignored
 * for cross-origin URLs (it navigates to the image instead of saving it), and
 * fetching the bytes to build a blob is blocked by CORS, since apod.nasa.gov
 * sends no allow-origin header and is not in `host_permissions`. Both of those
 * are why the old `downloadjs` approach broke.
 *
 * `chrome.downloads` has neither restriction -- the browser fetches the URL
 * itself, outside the page's origin.
 */
const DOWNLOADS_PERMISSION = { permissions: ['downloads'] };

const FILE_EXTENSION = /\.(jpe?g|png|gif|webp|tiff?)$/i;

const fileExtension = (url: string): string => {
  try {
    const match = FILE_EXTENSION.exec(new URL(url).pathname);
    return match ? match[0].toLowerCase() : '.jpg';
  } catch {
    return '.jpg';
  }
};

export const downloadFilename = (response: TApodResponse): string => {
  // Trimming after the truncation, not before: a title cut mid-word would
  // otherwise leave a dangling hyphen right before the extension.
  const slug = response.title
    ?.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .slice(0, 60)
    .replace(/^-+|-+$/g, '');

  const name = [`apod-${isoDateFormat(response.date)}`, slug]
    .filter(Boolean)
    .join('-');

  return `${name}${fileExtension(response.hdurl || response.url)}`;
};

/**
 * `downloads` is optional rather than required so the extension does not ask
 * every user for it up front -- an added permission warning on an update
 * disables the extension until the user re-accepts it.
 */
export const downloadApodImage = (response?: TApodResponse) => {
  if (!response || response.media_type !== 'image') {
    return;
  }

  // Full resolution when there is one; `hdurl` is missing on some entries.
  const url = response.hdurl || response.url;
  if (!url) {
    return;
  }

  // Must stay inside the click handler's user gesture, or Chrome rejects it.
  chrome.permissions.request(DOWNLOADS_PERMISSION, (granted) => {
    if (!granted) {
      return;
    }

    chrome.downloads.download(
      { url, filename: downloadFilename(response) },
      () => {
        if (chrome.runtime.lastError) {
          console.error('APOD: download failed', chrome.runtime.lastError);
        }
      }
    );
  });
};
