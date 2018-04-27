// Given an array of URLs, build a DOM list of those URLs in the
// browser action popup.
function buildPopupDom(divName, data) {
  const popupDiv = document.getElementById(divName);

  const ul = document.createElement('ul');
  popupDiv.appendChild(ul);

  for (var i = 0, ie = data.length; i < ie; ++i) {
    const site = data[i];
    const li = document.createElement('li');

    const img = new Image();
    img.src = `http://www.google.com/s2/favicons?domain_url=${site.url}`;
    img.classList.add('thumb-img');

    const a = document.createElement('a');
    a.href = site.url;
    a.title = site.title;

    a.appendChild(img);
    li.appendChild(a);
    ul.appendChild(li);
  }
}

function buildTypedUrlList(divName) {
  chrome.topSites.get(function(data) {
    buildPopupDom(divName, data.slice(0, 10));
  });
}
export default buildTypedUrlList;
