import { randomizer } from '../utilities';
const GA_TRACKING_ID = 'UA-91390132-1';

export default function(event) {
  const xhr = new XMLHttpRequest();
  const url = "http://www.google-analytics.com/collect";
  const cacheBustNum = randomizer(1147483647, 1000000000);
  const params = `
    v=1&tid=${GA_TRACKING_ID}&cid=${'55555'}
    &t=${"event"}
    &ec=${event.category}
    &ea=${event.action}
    &el=${event.label}
    &z=${cacheBustNum}
  `;

  xhr.open("POST", url, true);
  xhr.send(params);
}
