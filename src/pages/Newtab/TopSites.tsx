/*global chrome*/
import React, { useState, useEffect } from 'react';
import { TTopSite } from '../types';
import { STopSites } from './styles';

const TopSites: React.FC = () => {
  const [sites, setSites] = useState<TTopSite[]>([]);

  useEffect(() => {
    window.chrome.topSites.get((data) => {
      setSites(data);
    });
  }, []);

  return (
    <STopSites>
      {sites.map((site, idx) => {
        const imgSource = `http://www.google.com/s2/favicons?domain_url=${site.url}`;
        return (
          <span key={idx}>
            <a href={site.url} title={site.title}>
              <img alt={site.title} src={imgSource} />
            </a>
          </span>
        );
      })}
    </STopSites>
  );
};

export default TopSites;
