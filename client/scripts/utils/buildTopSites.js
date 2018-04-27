import { $, htmlToElements } from '../utilities';

function buildPopupDom(data) {
  const popupDiv = $('#topSites');

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
          <div class='delete-top-site' title="Don't show on this page">&times;</div>
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
