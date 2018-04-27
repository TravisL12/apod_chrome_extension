import { $, htmlToElements, clearElement } from '../utilities';

function deleteTopSite (url) {
  chrome.history.deleteUrl({url: url}, () => {
    window.setTimeout(buildTypedUrlList, 250); // race condition between history and topSites, weird
  });
}

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
          <div class='delete-top-site' title="Don't show on this page">&times;</div>
        </li>`);

    topSiteList.querySelector('.delete-top-site').addEventListener('click', (e) => {
      deleteTopSite(e.target.previousElementSibling.href);
    });

    ul.appendChild(topSiteList);
  }
}

function buildTypedUrlList() {
  chrome.topSites.get(function(data) {
    buildPopupDom(data.slice(0, 10));
  });
}
export default buildTypedUrlList;
