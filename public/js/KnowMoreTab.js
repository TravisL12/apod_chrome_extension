'use strict';

function KnowMoreTab (el, apod, drawer) {
    DrawerTab.call(this, el, apod, drawer);
    this.title = 'Would you like to know more?';
    this.template = `
        <h1>LEARN SOME SHIT</h1>
    `;
};

KnowMoreTab.prototype = Object.create(DrawerTab.prototype, {

});

KnowMoreTab.prototype.constructor = KnowMoreTab;
