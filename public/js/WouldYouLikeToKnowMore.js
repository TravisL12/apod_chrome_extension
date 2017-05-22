'use strict';

function uniqueResults (value, index, self) {
    return self.findIndex((v) => {
        return v.title === value.title;
    }) === index;
};

function Keyword (text, category) {
    this.title = text[0].toUpperCase() + text.slice(1);
    this.query = `${text} ${category}`;
}

function KnowMore (text) {
    this.galaxies = this.findGalaxies(text);
    this.celestialObjects = this.findCelestialObjects(text);
    this.newGeneralCatalog = this.findNgc(text);
    this.results = this.buildResults();
}

KnowMore.prototype = {
    findGalaxies (text) {
        let match = text.match(/M+\d{1,3}\b/g) || [];
        if (match.length) {
            match = this.createKeywords(match, 'galaxy');
        }

        return match;
    },

    findNgc (text) {
        let match = text.match(/NGC(-|\s)?\d{1,7}/g) || [];
        if (match.length) {
            match = this.createKeywords(match, 'NGC');
        }

        return match;
    },

    findCelestialObjects (text) {
        let matches = [];
        for (let i in celestialDictionary) {
            let match = celestialDictionary[i].filter((constellation) => {
                const re = new RegExp("\\b" + constellation + "\\b");
                return text.toLowerCase().match(re);
            });

            if (match.length) {
                match = this.createKeywords(match, i);
            }

            matches = matches.concat(match);
        }
        return matches;
    },

    createKeywords (match, category) {
        return match.map((name) => {
            return new Keyword(name, category);
        });
    },

    buildResults () {
        let results = [].concat(this.galaxies, this.celestialObjects, this.newGeneralCatalog);
        return results.filter(uniqueResults).slice(0,3).sort((a,b) => {
            return a.title > b.title;
        });
    },

    createLink (result) {
        const el = document.createElement('li');
        console.log(result.title);

        const googleSearch = (e) => {
            el.removeEventListener('click', googleSearch); // No clicking twice!

            this.search(result.query).then((data) => {
                let response = JSON.parse(data.response);
                let items = response.items;
                let url = response.items[0].formattedUrl;
                let title = response.items[0].htmlTitle;
                el.innerHTML = `
                    <a href="${items[0].formattedUrl}" target="_blank">${items[0].htmlTitle}</a>
                    <a href="${items[1].formattedUrl}" target="_blank">${items[1].htmlTitle}</a>
                    <a href="${items[2].formattedUrl}" target="_blank">${items[2].htmlTitle}</a>
                `;
            }, (error) => {
                console.log(JSON.parse(error.response).error.errors[0].message);
            });
        }

        el.innerHTML = '<p>' + result.title + '</p>';
        el.addEventListener('click', googleSearch);

        return el;
    },

    search (query) {
        console.log(query);
        return reqwest({
            type: 'GET',
            url: 'https://www.googleapis.com/customsearch/v1',
            data: {
                key: 'AIzaSyAoX7Ec50Nuh8hScDw05App_8XQb2YR-Ts',
                cx: '012134705583441818934:js43us2h5ua',
                q: query,
            },
        });
    },
}

const celestialDictionary = {
    planet: [
        'mercury',
        'venus',
        'mars',
        'jupiter',
        'saturn',
        'uranus',
        'neptune',
        'pluto',
    ],

    moon: [
        'ganymede',
        'europa',
        'titan',
        'io',
        'callisto',
    ],

    constellation: [
        "air pump",
        "altar",
        "andromeda",
        "antlia",
        "apus",
        "aquarius",
        "aquila",
        "ara",
        "archer",
        "aries",
        "arrow",
        "auriga",
        "balance",
        "berenice's hair",
        "big bear",
        "big dipper",
        "big dog",
        "bird of paradise",
        "bootes",
        "bull",
        "caelum",
        "camelopardalis",
        "camelopardus",
        "cancer",
        "canes venatici",
        "canis major",
        "canis minor",
        "capricornus",
        "carina",
        "carpenter's level",
        "cassiopeia",
        "cassiopeia",
        "centaur",
        "centaurus",
        "cepheus",
        "cepheus",
        "cephus",
        "cetus",
        "chameleon",
        "chameleon",
        "charioteer",
        "circinus",
        "clock",
        "columba",
        "coma berenices",
        "compasses",
        "corona australis",
        "corona borealis",
        "corvus",
        "crab",
        "crane",
        "cross",
        "crow",
        "crux",
        "cygnus",
        "delphinus",
        "dolphin",
        "dorado",
        "dove",
        "draco",
        "draco",
        "eagle",
        "easel",
        "equuleus",
        "eridanus",
        "eridanus",
        "filly",
        "fishes",
        "fly",
        "flying fish",
        "fornax",
        "fox",
        "furnace",
        "gemini",
        "giraffe",
        "giraffe",
        "goat",
        "goldfish",
        "graving tool",
        "great dog",
        "grus",
        "hare",
        "harp",
        "hercules",
        "hercules",
        "herdsman",
        "holder of serpent",
        "horologium",
        "hunting dogs",
        "hydra",
        "indian",
        "indus",
        "keel of argonauts' ship",
        "king of ethiopia",
        "lacerta",
        "leo minor",
        "leo",
        "leo",
        "lepus",
        "libra",
        "little bear",
        "little dipper",
        "little dog",
        "little horse",
        "little lion",
        "lizard",
        "lupus",
        "lupus",
        "lynx",
        "lynx",
        "lyra",
        "lyre",
        "mariner's compass",
        "mensa",
        "mensa",
        "microscope",
        "microscopium",
        "monoceros",
        "musca",
        "norma",
        "northern crown",
        "octans",
        "octant",
        "ophiuchus",
        "orion",
        "orion",
        "painter",
        "pavo",
        "peacock",
        "pegasus",
        "pegasus",
        "perseus",
        "phoenix",
        "phoenix",
        "pictor",
        "pisces",
        "piscis austrinis",
        "piscis austrinus",
        "poop",
        "porpoise",
        "princess of ethiopia",
        "puppis",
        "pyxis",
        "queen of ethiopia",
        "ram",
        "raven",
        "reticulum",
        "rule",
        "sagitta",
        "sagittarius",
        "sail",
        "scales",
        "scorpion",
        "scorpius",
        "sculptor",
        "sculptor",
        "sculptor's tool",
        "scutum",
        "sea goat",
        "sea monster",
        "sea serpent",
        "serpens",
        "serpent",
        "serpent-bearer",
        "sextans",
        "sextant",
        "shield",
        "son of zeus",
        "southern cross",
        "southern crown",
        "southern fish",
        "southern fish",
        "southern fly",
        "southern triangle",
        "stern of the argonauts",
        "straightedge",
        "swan",
        "swordfish",
        "taurus",
        "telescopium",
        "telescopium",
        "the hunter",
        "toucan",
        "triangulum australe",
        "triangulum",
        "triangulum",
        "tucana",
        "twins",
        "unicorn",
        "ursa major",
        "ursa minor",
        "vela",
        "virgin",
        "virgo",
        "volans",
        "vulpecula",
        "water bearer",
        "water snake",
        "whale",
        "winged horse",
    ]
};
// Extends dictionary with keys of added descriptions
// Object.keys(celestialDictionary).reduce((acc, propName) =>
//   celestialDictionary[propName].reduce((a, num) => {
//     a[num] = propName;
//     return a;
// }, acc), celestialDictionary);
