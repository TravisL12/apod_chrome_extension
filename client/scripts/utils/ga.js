import reqwest from 'reqwest';

const GA_TRACKING_ID = 'UA-91390132-1';

export default function(event) {
  const data = {
    v: 1,
    tid: GA_TRACKING_ID,
    t: 'pageview',
    ec: event.category,
    ea: event.action,
    el: event.label,
    dl: 'chrome-extension://aedpginojmhafbemcoelnppdcmlfjcdj/index.html',
    dp: 'apod_trav.html',
    ul: 'en-us',
    dt: 'APOD by The Trav'
  };

  reqwest({
    method: 'POST',
    url: 'https://www.google-analytics.com/collect',
    data: data,
  });
}
