import React, { useState, useEffect } from 'react';
import { TTopSite } from '../types';
import { STopSites } from './styles';

/**
 * Chrome's own favicon cache, served locally from the extension. The previous
 * `google.com/s2/favicons` endpoint sent the user's most-visited domains to a
 * third party -- over plain http -- on every new tab, which this extension's
 * `api.nasa.gov`-only permissions imply it does not do.
 */
const faviconUrl = (pageUrl: string, size: number = 32) => {
  const url = new URL(chrome.runtime.getURL('/_favicon/'));
  url.searchParams.set('pageUrl', pageUrl);
  url.searchParams.set('size', `${size}`);
  return url.toString();
};

const TopSites: React.FC = () => {
  const [sites, setSites] = useState<TTopSite[]>([]);

  useEffect(() => {
    chrome.topSites.get((data) => {
      setSites(data);
    });
  }, []);

  return (
    <STopSites>
      {sites.map((site) => (
        <span key={site.url}>
          <a href={site.url} title={site.title}>
            <img alt="" aria-hidden="true" src={faviconUrl(site.url)} />
          </a>
        </span>
      ))}
    </STopSites>
  );
};

export default TopSites;
