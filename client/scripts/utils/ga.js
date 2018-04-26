const GA_TRACKING_ID = 'UA-91390132-1';

export default function(event) {
  const xhr = new XMLHttpRequest();
  const url = "http://www.google-analytics.com/collect";
  let params = "v=1";
  params += `&tid=${GA_TRACKING_ID}`;
  params += `&cid=${'55555'}`;
  params += `&t=${"event"}`;
  params += `&ec=${event.category}`;
  params += `&ea=${event.action}`;
  params += `&el=${event.label}`;
  params += `&z=${(1000000000 + Math.floor(Math.random() * (2147483647 - 1000000000)))}`;

  xhr.open("POST", url, true);
  xhr.send(params);
}
