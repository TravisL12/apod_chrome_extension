import { $, clearElement, htmlToElements } from '../utilities';
import ga from '../utils/ga';
import DrawerTab from './DrawerTab';

export default class ExplanationTab extends DrawerTab {
    constructor(el) {
        super(el);
        this.keycode = 69;
        const html = `
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
        this.template = htmlToElements(html);
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
        const apodExplanation = $('#apod-explanation');
        clearElement(apodExplanation);

        $('.external-links').addEventListener('click', e => {
            ga({
                category: 'Outbound Link',
                action: 'clicked',
                label: event.target.id,
            });
        });

        apodOrigin.setAttribute('href', 'https://apod.nasa.gov/apod/' + this.apod.apodSource());
        apodHiRes.setAttribute('href', this.apod.hdurl);
        apodLowRes.setAttribute('href', this.apod.url);
        apodExplanation.appendChild(htmlToElements(this.apod.explanation, true));

        this.setTabListeners();
    }
}
