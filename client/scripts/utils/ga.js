import reqwest from 'reqwest';

const GA_TRACKING_ID = 'UA-91390132-1';

export default function(event) {
  const data = {
    v: 1,
    tid: GA_TRACKING_ID,
    t: event,
    ec: event.category,
    ea: event.action,
    el: event.label,
  };

  reqwest({
    method: 'POST',
    url: 'https://www.google-analytics.com/collect',
    data: data,
  });
}
