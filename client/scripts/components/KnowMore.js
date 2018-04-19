import reqwest from 'reqwest';
import { $, htmlToElements } from '../utilities';
import ga from '../utils/ga';
import celestialDictionary from '../CelestialDictionary';
import imageDictionary from '../ImageDictionary';
import KnowMoreTab from '../tabs/KnowMoreTab';

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
 * Keyword
 * @param {string} name
 * @param {string} category
 * @param {int} index id
 */
function Keyword(name, category, id) {
    this.title = name[0].toUpperCase() + name.slice(1);
    this.query = `${name} ${category}`;
    this.category = category;
    this.id = id;
}

/**
 * KnowMoreComponent
 * @param {string} text
 */
class KnowMoreComponent {
    constructor(text) {
        this.text = text;
        this.celestialObjects = this.findCelestialObjects();
        this.newGeneralCatalog = this.findNewGeneralCatalogObjects();
        this.results = this.buildResults();
    }

    findNewGeneralCatalogObjects() {
        let match = this.text.match(/NGC(-|\s)?\d{1,7}/gi) || [];
        if (match.length) {
            match = this.createKeywords(match, 'NGC');
        }

        return match;
    }

    findCelestialObjects() {
        let matches = [];
        for (let category in celestialDictionary) {
            let match = celestialDictionary[category].filter(constellation => {
                const re = new RegExp('\\b' + constellation + '\\b', 'gi');
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
            return new Keyword(name, category, idx + 1);
        });
    }

    buildResults() {
        const results = [].concat(this.celestialObjects, this.newGeneralCatalog);
        const resultsToDisplay = 5;
        let frequency = {};

        for (let i in results) {
            const re = new RegExp('\\b' + results[i].title + '\\b', 'gi');
            frequency[results[i].title] = this.text.match(re).length;
        }

        return results
            .filter(uniqueResults)
            .sort((a, b) => {
                return frequency[b.title] > frequency[a.title];
            })
            .slice(0, resultsToDisplay);
    }

    buildLinkId(result) {
        let id =
            'know-more-tab-' + result.title.replace(/[\s-_.'"]/gi, '').toLowerCase().slice(0, 10);
        let isIdUsed = $('#' + id);

        return id;
    }

    createTab(result, index) {
        const el = document.createElement('div');
        el.className = 'tab';
        el.id = this.buildLinkId(result);

        const googleSearch = e => {
            ga({ category: 'Know More', action: 'clicked', label: result.query });
            el.removeEventListener('click', googleSearch); // Avoid searching twice!

            this.search(result.query)
                .then(
                    data => {
                        knowMoreTab.items = data.items;
                        knowMoreTab.openTab();
                    },
                    error => {
                        console.log(JSON.parse(error.response).error.errors[0].message);
                    },
                )
                .fail(error => {
                    knowMoreTab.template = `<h1>All out of searches for today!</h1>`;
                    knowMoreTab.openTab();
                });
        };

        el.appendChild(
            htmlToElements(`${imageDictionary[result.category]()} ${result.title}`, true),
        );
        el.addEventListener('click', googleSearch);
        $('#know-more-tabs').appendChild(el);

        const knowMoreTab = new KnowMoreTab('#' + el.id, index, googleSearch);
    }

    search(query) {
        return reqwest({
            method: 'GET',
            url: 'https://www.googleapis.com/customsearch/v1',
            data: {
                key: 'AIzaSyAoX7Ec50Nuh8hScDw05App_8XQb2YR-Ts',
                cx: '012134705583441818934:js43us2h5ua',
                q: query,
            },
        });
    }
}

export default KnowMoreComponent;
