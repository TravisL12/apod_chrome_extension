import reqwest from "reqwest";

import { $, htmlToElements } from "../utilities";
import ga from "../utilities/ga";
import celestialDictionary from "../CelestialDictionary";
import imageDictionary from "../ImageDictionary";
import KnowMoreTab from "../tabs/KnowMoreTab";

/**
 * uniqueResults
 * Callback for the filter() function to get
 * unique values in results object
 *
 * @param  value
 * @param  index
 * @param  self
 *
 * @return {array}
 */
function uniqueResults(value, index, self) {
  return (
    self.findIndex(v => {
      return v.title === value.title;
    }) === index
  );
}

/**
 * KnowMoreComponent
 * @param {string} text
 */
class KnowMoreComponent {
  constructor(text, drawer) {
    this.text = text;
    this.drawer = drawer;
    this.celestialObjects = this.findCelestialObjects();
    this.newGeneralCatalog = this.findNewGeneralCatalogObjects();
    this.results = this.buildResults();
  }

  findNewGeneralCatalogObjects() {
    let match = this.text.match(/NGC(-|\s)?\d{1,7}/gi) || [];
    if (match.length) {
      match = this.createKeywords(match, "NGC");
    }

    return match;
  }

  findCelestialObjects() {
    let matches = [];
    for (let category in celestialDictionary) {
      let match = celestialDictionary[category].filter(constellation => {
        const re = new RegExp("\\b" + constellation + "\\b", "gi");
        return this.text.match(re);
      });

      if (match.length) {
        match = this.createKeywords(match, category);
      }

      matches = matches.concat(match);
    }
    return matches;
  }

  createKeywords(match, category) {
    return match.map((name, idx) => {
      return {
        title: name[0].toUpperCase() + name.slice(1),
        query: `${name} ${category}`,
        category: category,
        id: idx + 1
      };
    });
  }

  buildResults() {
    const results = this.celestialObjects.concat(this.newGeneralCatalog);
    const maxResults = 5;
    const frequency = results.reduce((freq, result) => {
      const re = new RegExp("\\b" + result.title + "\\b", "gi");
      freq[result.title] = this.text.match(re).length;
      return freq;
    }, {});

    return results
      .filter(uniqueResults)
      .sort((a, b) => {
        return frequency[b.title] > frequency[a.title];
      })
      .slice(0, maxResults);
  }

  createTab(result, index) {
    const el = htmlToElements(`
            <div class='tab' id='know-more-tab-${index}'>
                ${imageDictionary[result.category]()} ${result.title}
            </div>`);

    const googleSearchOnClick = e => {
      ga({ category: "Know More", action: "clicked", label: result.query });
      el.removeEventListener("click", googleSearchOnClick); // Avoid searching twice!

      reqwest({
        method: "GET",
        url: "https://www.googleapis.com/customsearch/v1",
        data: {
          key: "AIzaSyAoX7Ec50Nuh8hScDw05App_8XQb2YR-Ts",
          cx: "012134705583441818934:js43us2h5ua",
          q: result.query
        }
      })
        .then(
          data => {
            knowMoreTab.items = data.items;
            knowMoreTab.openTab();
          },
          error => {
            console.log(JSON.parse(error.response).error.errors[0].message);
          }
        )
        .fail(error => {
          knowMoreTab.template = `<h1>All out of searches for today!</h1>`;
          knowMoreTab.openTab();
        });
    };

    el.addEventListener("click", googleSearchOnClick);
    $("#know-more-tabs").appendChild(el);

    const knowMoreTab = new KnowMoreTab(
      `#${el.id}`,
      this.drawer,
      index,
      googleSearchOnClick
    );
  }
}

export default KnowMoreComponent;
