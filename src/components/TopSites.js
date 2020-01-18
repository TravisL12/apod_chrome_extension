/*global chrome*/
import React, { useState, useEffect } from "react";

function TopSites() {
  const [sites, setSites] = useState([]);

  useEffect(() => {
    chrome.topSites.get(data => {
      setSites(data);
    });
  }, []);

  return (
    <div class="apod__top-sites">
      <ul>
        {sites.map((site, idx) => {
          const imgSource = `http://www.google.com/s2/favicons?domain_url=${site.url}`;
          return (
            <li key={idx}>
              <a href={site.url} title={site.title}>
                <img class="thumb-img" alt={site.title} src={imgSource} />
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default TopSites;
