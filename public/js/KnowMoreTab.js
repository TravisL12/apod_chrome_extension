'use strict';

class KnowMoreTab extends DrawerTab {

    constructor (el, apod, drawer) {
        super(el, apod, drawer);
        this.title = 'Learn More';
        this.keycode = 76;
        this.template = `<h1>LEARN SOME SHIT</h1>`;
    }

}
