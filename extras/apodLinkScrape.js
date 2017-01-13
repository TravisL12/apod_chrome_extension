import $ from 'jquery';

var links = document.querySelectorAll('body b a');
var hrefs = [];

for(var i = 0; i < links.length; i++) {
    hrefs.push(links[i].href);
};

console.log(hrefs);
