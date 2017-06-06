'use strict';

function ExplanationTab (el, apod, drawer) {
    DrawerTab.call(this, el, apod, drawer);
    this.title = 'Explanation';
    this.template = `
        <div class='explanation'>

            <div id='apod-explanation'></div>

            <div class='external-links'>
                <a id='apod-origin' target='_blank'>View this APOD</a>
                <a id='apod-hires'  target='_blank'>Hi-res</a>
                <a id='apod-lowres' target='_blank'>Low-res</a>
            </div>
        </div>
    `;
};

ExplanationTab.prototype = Object.create(DrawerTab.prototype, {

    render: {
        value: function () {
            this.baseView.innerHTML = this.template;
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

            apodDescription.innerHTML = this.apod.description;
            apodHiRes.setAttribute('href', this.apod.hdurl);
            apodLowRes.setAttribute('href', this.apod.url);
            apodOrigin.setAttribute('href', 'https://apod.nasa.gov/apod/' + this.apod.apodSource());
        }
    }

});

ExplanationTab.prototype.constructor = ExplanationTab;
