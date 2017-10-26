// Given an array of URLs, build a DOM list of those URLs in the
// browser action popup.
function buildPopupDom(divName, data) {
  var popupDiv = document.getElementById(divName);

  var ul = document.createElement('ul');
  popupDiv.appendChild(ul);

  for (var i = 0, ie = data.length; i < ie; ++i) {
    var site = data[i],
        a    = document.createElement('a'),
        li   = document.createElement('li')
        img  = new Image();

    img.src = 'chrome://favicon/' + site.url;
    img.classList.add('thumb-img');

    a.href = site.url;
    a.title = site.title;

    a.appendChild(img);
    li.appendChild(a);
    ul.appendChild(li);
  }
}

function buildTypedUrlList(divName) {
    chrome.topSites.get(function(data) {
        buildPopupDom(divName, data.slice(0,10));
    });
}

document.addEventListener('DOMContentLoaded', function () {
  buildTypedUrlList('topSites');
});
