/*global chrome*/

const GA_TRACKING_ID = "UA-91390132-1";
const analyticsSendInterval = 5 * 1000;
let parameters = [],
  intervalFn,
  CLIENT_ID;

// from: https://gist.github.com/jcxplorer/823878
function generateUuid() {
  let uuid = "",
    i,
    random;
  for (let i = 0; i < 32; i++) {
    random = (Math.random() * 16) | 0;

    if (i == 8 || i == 12 || i == 16 || i == 20) {
      uuid += "-";
    }
    uuid += (i == 12 ? 4 : i == 16 ? (random & 3) | 8 : random).toString(16);
  }
  return uuid;
}

function buildParameter(event) {
  const type = event.type || "event";
  let param = "v=1";
  param += `&tid=${GA_TRACKING_ID}`;
  param += `&cid=${CLIENT_ID}`;
  param += `&t=${type}`;
  param += `&z=${1000000000 +
    Math.floor(Math.random() * (2147483647 - 1000000000))}`;

  if (event.category) {
    param += `&ec=${event.category}`;
  }

  if (event.action) {
    param += `&ea=${event.action}`;
  }

  if (event.label) {
    param += `&el=${event.label}`;
  }

  if (event.page) {
    param += `&dp=${event.page}`;
  }

  parameters.push(param);
  updateInterval();
}

function sendAnalytics() {
  const xhr = new XMLHttpRequest();
  const url = "http://www.google-analytics.com/batch";
  xhr.open("POST", url, true);
  xhr.send(parameters.join("\n"));

  // reset for next round of data
  parameters = [];
  window.clearInterval(intervalFn);
}

function updateInterval() {
  window.clearInterval(intervalFn); // debounces
  intervalFn = window.setInterval(() => {
    if (parameters.length > 0) {
      sendAnalytics();
    }
  }, analyticsSendInterval);
}

export default function(event) {
  if (!CLIENT_ID) {
    chrome.storage.sync.get(["apodUuid"], items => {
      if (items.apodUuid) {
        CLIENT_ID = items.apodUuid;
      } else {
        const uuid = generateUuid();
        chrome.storage.sync.set({ apodUuid: uuid });
        CLIENT_ID = uuid;
      }
      buildParameter(event);
    });
  } else {
    buildParameter(event);
  }
}
