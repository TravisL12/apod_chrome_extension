'use strict';

function KnowMoreTab (el, apod, drawer) {
    DrawerTab.call(this, el, apod, drawer);
    this.title = 'Learn More';
    this.keycode = 76;
    this.template = `<h1>LEARN SOME SHIT</h1>`;
};

KnowMoreTab.prototype = Object.create(DrawerTab.prototype, {

});
