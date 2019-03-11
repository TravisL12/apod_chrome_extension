import { $, htmlToElements, clearElement } from "scripts/utilities";

function buildPopupDom(data) {
  const popupDiv = $("#topSites");
  clearElement(popupDiv);

  const siteList = document.createElement("ul");

  for (var i = 0, ie = data.length; i < ie; ++i) {
    const site = data[i];
    const imgSource = `http://www.google.com/s2/favicons?domain_url=${
      site.url
    }`;
    const topSiteList = htmlToElements(`
    <li>
    <a href='${site.url}' title='${site.title}'>
    <img class='thumb-img' src='${imgSource}'/>
    </a>
        </li>`);

    siteList.appendChild(topSiteList);
  }

  popupDiv.appendChild(siteList);
}

function buildTypedUrlList() {
  chrome.topSites.get(function(data) {
    buildPopupDom(data.slice(0, 10));
  });
}
export default buildTypedUrlList;
