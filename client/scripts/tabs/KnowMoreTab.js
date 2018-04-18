import { htmlToElements } from '../utilities';
import DrawerTab from './DrawerTab';
import { SunLoader } from '../SetupLoading';

class KnowMoreTab extends DrawerTab {
    constructor(el, index, searchCallback) {
        super(el);
        this.items = [];
        this.loader = new SunLoader();
        this.index = index;
        this.searchFn = searchCallback;
        const html = `
            <div class='know-links'>
                <div class='loading-spinner hide'>${this.loader.render()}</div>
            </div>
        `;
        this.template = htmlToElements(html);
    }

    toggleLoader(isItems) {
        this.baseView.querySelector('.loading-spinner').classList.toggle('hide', isItems);
    }

    setClickListener() {
        const tabs = document.getElementsByClassName(`keyword-${this.index}`);

        for (let i = 0; i < tabs.length; i++) {
            tabs[i].onclick = () => {
                this.toggle();
                this.searchFn();
            };
        }
    }

    render() {
        this.toggleLoader(this.items.length > 0);

        let links = '';
        for (let i in this.items) {
            let item = this.items[i];
            links += `
                <li>
                    <a href="${item.link}" target="_blank">${item.htmlTitle}</a>
                </li>`;
        }

        this.baseView.querySelector('.know-links').appendChild(htmlToElements(links, 'ul'));
    }
}

export default KnowMoreTab;
