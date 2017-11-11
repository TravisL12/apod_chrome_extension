import { $ } from '../utilities';
import ga from '../utils/ga';
import DrawerTab from './DrawerTab';

export default class ExplanationTab extends DrawerTab {
    constructor(el) {
        super(el);
        this.keycode = 69;
        this.template = `
            <div class='explanation'>
                <h2 class='title'>Explanation</h2>

                <div id='apod-explanation'></div>

                <div class='external-links'>
                    <a id='apod-origin' target='_blank'>View this APOD</a>
                    <a id='apod-hires'  target='_blank'>Hi-res</a>
                    <a id='apod-lowres' target='_blank'>Low-res</a>
                </div>
            </div>
        `;
    }

    setTabListeners() {
        const tabs = this.drawer.tabs.slice(2);

        for (let i = 0; i < tabs.length; i++) {
            tabs[i].setClickListener();
        }
    }

    render() {
        const apodOrigin = this.baseView.querySelector('#apod-origin');
        const apodHiRes = this.baseView.querySelector('#apod-hires');
        const apodLowRes = this.baseView.querySelector('#apod-lowres');
        const apodDescription = $('#apod-explanation');

        $('.external-links').addEventListener('click', e => {
            ga('send', 'event', {
                eventCategory: 'Outbound Link',
                eventAction: 'clicked',
                eventLabel: event.target.id,
                transport: 'beacon',
            });
        });

        apodOrigin.setAttribute('href', 'https://apod.nasa.gov/apod/' + this.apod.apodSource());
        apodHiRes.setAttribute('href', this.apod.hdurl);
        apodLowRes.setAttribute('href', this.apod.url);
        apodDescription.innerHTML = this.apod.description;

        this.setTabListeners();
    }
}