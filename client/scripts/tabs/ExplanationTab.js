import { $, clearElement, htmlToElements, zeroPad } from '../utilities';
import ga from '../utils/ga';
import DrawerTab from './DrawerTab';

export default class ExplanationTab extends DrawerTab {
    constructor(el) {
        super(el);
        this.keycode = 69;
        this.date = '';
        this.urls = {
            hdurl: '',
            url: '',
        };
        this.explanation = '';
        this.template = htmlToElements(`
            <div class='explanation'>
                <h2 class='title'>Explanation</h2>

                <div id='apod-explanation'></div>

                <div class='external-links'>
                    <a id='apod-origin' target='_blank'>View this APOD</a>
                    <a id='apod-hires'  target='_blank'>Hi-res</a>
                    <a id='apod-lowres' target='_blank'>Low-res</a>
                </div>
            </div>
        `);
    }

    knowMoreKeywordListeners() {
        const tabs = this.drawer.tabs.slice(2);

        for (let i = 0; i < tabs.length; i++) {
            tabs[i].addKeywordClickListener();
        }
    }

    /**
     * Build filename for APOD site: ap170111.html
     *
     * @return {String} "2011-02-15"
     */
    apodSource() {
        const date = this.date.split('-');
        return `ap${date[0].slice(-2)}${zeroPad(date[1])}${zeroPad(date[2])}.html`;
    }

    highlightKeywords(result, index) {
        const re = new RegExp('\\b(' + result + ')\\b', 'gi');
        this.explanation = this.explanation.replace(
            re,
            `<span class="keyword keyword-${index}">$1</span>`,
        );
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

        apodOrigin.setAttribute('href', 'https://apod.nasa.gov/apod/' + this.apodSource());
        apodHiRes.setAttribute('href', this.urls.hdurl);
        apodLowRes.setAttribute('href', this.urls.url);
        apodExplanation.appendChild(htmlToElements(this.explanation, true));

        this.knowMoreKeywordListeners();
    }
}
