import { $, clearElement, htmlToElements, zeroPad } from "scripts/utilities";
import ga from "scripts/utilities/ga";
import DrawerTab from "scripts/tabs/DrawerTab";

export default class ExplanationTab extends DrawerTab {
  constructor(el, drawer) {
    super(el, drawer);
    this.keycode = 69;
    this.date = "";
    this.urls = {
      hdurl: "",
      url: ""
    };
    this.explanation = "";
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
    const date = this.date.split("-");
    return `ap${date[0].slice(-2)}${zeroPad(date[1])}${zeroPad(date[2])}.html`;
  }

  highlightKeywords(result, index) {
    const re = new RegExp("\\b(" + result + ")\\b", "gi");
    this.explanation = this.explanation.replace(
      re,
      `<span class="keyword keyword-${index}">$1</span>`
    );
  }

  render() {
    const origin = this.baseView.querySelector("#apod-origin");
    const hiRes = this.baseView.querySelector("#apod-hires");
    const lowRes = this.baseView.querySelector("#apod-lowres");
    const explanation = $("#apod-explanation");
    clearElement(explanation);

    $(".external-links").addEventListener("click", e => {
      ga({
        category: "Outbound Link",
        action: "clicked",
        label: event.target.id
      });
    });

    origin.setAttribute(
      "href",
      `https://apod.nasa.gov/apod/${this.apodSource()}`
    );
    hiRes.setAttribute("href", this.urls.hdurl);
    lowRes.setAttribute("href", this.urls.url);
    explanation.appendChild(htmlToElements(this.explanation, true));

    this.knowMoreKeywordListeners();
  }
}
