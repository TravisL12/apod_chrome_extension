import React, { useState, useEffect } from 'react';
import { TTopSite } from '../types';
import { STopSites, STopSiteFallback } from './styles';

const IS_FIREFOX = process.env.TARGET === 'firefox';

/**
 * Chrome's own favicon cache, served locally from the extension. The previous
 * `google.com/s2/favicons` endpoint sent the user's most-visited domains to a
 * third party -- over plain http -- on every new tab, which this extension's
 * `api.nasa.gov`-only permissions imply it does not do.
 *
 * Firefox has no `_favicon/` endpoint, so it takes the other branch below and
 * gets icons back from `topSites` itself as data URLs.
 */
const faviconUrl = (pageUrl: string, size: number = 32) => {
  const url = new URL(chrome.runtime.getURL('/_favicon/'));
  url.searchParams.set('pageUrl', pageUrl);
  url.searchParams.set('size', `${size}`);
  return url.toString();
};

/**
 * The two browsers disagree on both the signature and the icon source:
 * Chrome's `topSites.get` takes a callback and returns no favicon, Firefox's
 * returns a promise and will inline one per site when asked.
 */
const getTopSites = (): Promise<TTopSite[]> => {
  if (IS_FIREFOX) {
    return (globalThis as any).browser.topSites.get({ includeFavicon: true });
  }

  return new Promise((resolve) => chrome.topSites.get(resolve));
};

// Firefox omits `favicon` for any site it has no cached icon for, so a tile
// showing the domain's first letter stands in rather than a broken image.
const siteInitial = (site: TTopSite) => {
  try {
    return new URL(site.url).hostname.replace(/^www\./, '')[0].toUpperCase();
  } catch {
    return (site.title?.[0] || '?').toUpperCase();
  }
};

const TopSiteIcon: React.FC<{ site: TTopSite }> = ({ site }) => {
  const [failed, setFailed] = useState(false);

  const src = IS_FIREFOX ? site.favicon : faviconUrl(site.url);

  if (!src || failed) {
    return (
      <STopSiteFallback aria-hidden="true">
        {siteInitial(site)}
      </STopSiteFallback>
    );
  }

  return (
    <img alt="" aria-hidden="true" src={src} onError={() => setFailed(true)} />
  );
};

const TopSites: React.FC = () => {
  const [sites, setSites] = useState<TTopSite[]>([]);

  useEffect(() => {
    getTopSites().then(setSites);
  }, []);

  return (
    <STopSites>
      {sites.map((site) => (
        <span key={site.url}>
          <a href={site.url} title={site.title}>
            <TopSiteIcon site={site} />
          </a>
        </span>
      ))}
    </STopSites>
  );
};

export default TopSites;
