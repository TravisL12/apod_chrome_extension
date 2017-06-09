'use strict';

class ExplanationTab extends DrawerTab {

    constructor (el, apod, drawer) {
        super(el, apod, drawer);
        this.keycode = 69;
        this.template = `
            <div class='explanation'>
                <h2 class='title'></h2>

                <div id='apod-explanation'></div>

                <div class='external-links'>
                    <a id='apod-origin' target='_blank'>View this APOD</a>
                    <a id='apod-hires'  target='_blank'>Hi-res</a>
                    <a id='apod-lowres' target='_blank'>Low-res</a>
                </div>
            </div>
        `;
    }

    render () {
        // this.baseView.innerHTML = this.template;
        const apodTitle  = this.baseView.querySelector('h2.title');
        const apodOrigin = this.baseView.querySelector('#apod-origin');
        const apodHiRes  = this.baseView.querySelector('#apod-hires');
        const apodLowRes = this.baseView.querySelector('#apod-lowres');
        const apodDescription = $('#apod-explanation');

        $('.external-links').addEventListener('click', (e) => {
            ga('send', 'event', {
                eventCategory: 'Outbound Link',
                eventAction: 'clicked',
                eventLabel: event.target.id,
                transport: 'beacon'
            });
        });

        apodTitle.textContent = this.apod.title;
        apodDescription.innerHTML = this.apod.description;
        apodHiRes.setAttribute('href', this.apod.hdurl);
        apodLowRes.setAttribute('href', this.apod.url);
        apodOrigin.setAttribute('href', 'https://apod.nasa.gov/apod/' + this.apod.apodSource());
    }

};
