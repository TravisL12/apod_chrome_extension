const GA_TRACKING_ID = 'UA-91390132-1';
let CLIENT_ID;

// from: https://gist.github.com/jcxplorer/823878
function generateUuid() {
  var uuid = "", i, random;
  for (i = 0; i < 32; i++) {
    random = Math.random() * 16 | 0;

    if (i == 8 || i == 12 || i == 16 || i == 20) {
      uuid += "-"
    }
    uuid += (i == 12 ? 4 : (i == 16 ? (random & 3 | 8) : random)).toString(16);
  }
  return uuid;
}

function ga(event) {
  const xhr = new XMLHttpRequest();
  const url = "http://www.google-analytics.com/collect";
  let params = "v=1";
  params += `&tid=${GA_TRACKING_ID}`;
  params += `&cid=${CLIENT_ID}`;
  params += `&t=${"event"}`;
  params += `&ec=${event.category}`;
  params += `&ea=${event.action}`;
  params += `&el=${event.label}`;
  params += `&z=${(1000000000 + Math.floor(Math.random() * (2147483647 - 1000000000)))}`;

  xhr.open("POST", url, true);
  xhr.send(params);
}

export default function(event) {
  if (!CLIENT_ID) {
    chrome.storage.sync.get(['apodUuid'], items => {
      if (items.apodUuid) {
        CLIENT_ID = items.apodUuid;
      } else {
        const uuid = { apodUuid: generateUuid() };
        chrome.storage.sync.set(uuid);
        CLIENT_ID = uuid;
      }
      ga(event);
    });
  } else {
    ga(event);
  }
}
