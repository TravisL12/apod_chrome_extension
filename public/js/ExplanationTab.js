'use strict';

function ExplanationTab (el, apod, drawer) {
    DrawerTab.call(this, el, apod, drawer);
    this.title = 'Explanation';
    this.template = `
        <h1>EXPLAIN THIS!</h1>
    `;
};

ExplanationTab.prototype = Object.create(DrawerTab.prototype, {

});

ExplanationTab.prototype.constructor = ExplanationTab;
