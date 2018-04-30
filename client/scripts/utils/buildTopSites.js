import { $, htmlToElements, clearElement } from '../utilities';

function buildPopupDom(data) {
  const popupDiv = $('#topSites');
  clearElement(popupDiv);
  
  const ul = document.createElement('ul');
  popupDiv.appendChild(ul);

  for (var i = 0, ie = data.length; i < ie; ++i) {
    const site = data[i];
    const imgSource = `http://www.google.com/s2/favicons?domain_url=${site.url}`;
    const topSiteList = htmlToElements(`
        <li>
          <a href='${site.url}' title='${site.title}'>
            <img class='thumb-img' src='${imgSource}'/>
          </a>
        </li>`);

    ul.appendChild(topSiteList);
  }
}

function buildTypedUrlList() {
  chrome.topSites.get(function(data) {
    buildPopupDom(data.slice(0, 10));
  });
}
export default buildTypedUrlList;
