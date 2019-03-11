import { htmlToElements } from "scripts/utilities";
import DrawerTab from "scripts/tabs/DrawerTab";
import { SunLoader } from "scripts/LoadingSpinner";

class KnowMoreTab extends DrawerTab {
  constructor(el, drawer, index, searchCallback) {
    super(el, drawer);
    this.items = [];
    this.loader = new SunLoader();
    this.index = index;
    this.searchFn = searchCallback;
    this.isRendered = false;
    this.template = htmlToElements(`
            <div class='know-links'>
                <div class='loading-spinner hide'>${this.loader.template}</div>
            </div>
        `);
  }

  toggleLoader(isItems) {
    this.baseView
      .querySelector(".loading-spinner")
      .classList.toggle("hide", isItems);
  }

  addKeywordClickListener() {
    const tabs = document.getElementsByClassName(`keyword-${this.index}`);

    for (let i = 0; i < tabs.length; i++) {
      tabs[i].addEventListener("click", () => {
        this.toggle();
        this.searchFn();
      });
    }
  }

  constructLinksEl() {
    return this.items.reduce((p, c) => {
      return (
        p +
        `
                <li>
                    <a href="${c.link}" target="_blank">${c.htmlTitle}</a>
                </li>`
      );
    }, "");
  }

  render() {
    const isItems = this.items.length > 0;
    this.toggleLoader(isItems);

    // Don't re-render or render without items
    if (this.isRendered || !isItems) {
      return;
    }

    this.isRendered = true;

    this.baseView
      .querySelector(".know-links")
      .appendChild(htmlToElements(this.constructLinksEl(), "ul"));
  }
}

export default KnowMoreTab;
