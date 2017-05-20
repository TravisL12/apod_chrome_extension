'use strict';

function addKeyword (keyword, collection) {
    return collection.map((item) => {
        return item + ' ' + keyword;
    });
}

function uniqueResults (value, index, self) {
    return self.indexOf(value) === index;
};

function KnowMore (text) {
    this.galaxies = this.galaxies(text);
    this.celestialObjects = this.celestialObjects(text);
    this.newGeneralCatalog = this.ngc(text);
}

KnowMore.prototype = {
    galaxies (text) {
        return text.match(/M+\d{1,3}\b/g) || [];
    },

    ngc (text) {
        return text.match(/NGC(-|\s)\d{1,7}/g) || [];
    },

    celestialObjects (text) {
        return Object.keys(celestialDictionary).filter((constellation) => {
            const re = new RegExp("\\b" + constellation + "\\b");
            return text.toLowerCase().match(re);
        })
    },

    results () {
        let results = [].concat(addKeyword('galaxy', this.galaxies), addKeyword('constellation', this.celestialObjects), this.newGeneralCatalog);
        return results.filter(uniqueResults).slice(0,3);
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

const planets = [
    'mercury',
    'venus',
    'earth',
    'mars',
    'jupiter',
    'saturn',
    'uranus',
    'neptune',
    'pluto',
];

const moons = [
    'Moon',
    'ganymede',
    'europa',
    'titan',
    'io',
    'callisto',
];

let celestialDictionary = {
    "andromeda":           ["princess of ethiopia"],
    "antlia":              ["air pump"],
    "apus":                ["bird of paradise"],
    "aquarius":            ["water bearer"],
    "aquila":              ["eagle"],
    "ara":                 ["altar"],
    "aries":               ["ram"],
    "auriga":              ["charioteer"],
    "bootes":              ["herdsman"],
    "caelum":              ["graving tool", "sculptor's tool"],
    "camelopardalis":      ["giraffe"],
    "camelopardus":        ["giraffe"],
    "cancer":              ["crab"],
    "canes venatici":      ["hunting dogs"],
    "canis major":         ["big dog", "great dog"],
    "canis minor":         ["little dog"],
    "capricornus":         ["goat", "sea goat"],
    "carina":              ["keel of argonauts' ship"],
    "cassiopeia":          ["cassiopeia", "queen of ethiopia"],
    "centaurus":           ["centaur"],
    "cepheus":             ["cepheus"],
    "cephus":              ["king of ethiopia"],
    "cetus":               ["sea monster", "whale"],
    "chameleon":           ["chameleon"],
    "circinus":            ["compasses"],
    "columba":             ["dove"],
    "coma berenices":      ["berenice's hair"],
    "corona australis":    ["southern crown"],
    "corona borealis":     ["northern crown"],
    "corvus":              ["crow", "raven"],
    "crux":                ["cross", "southern cross"],
    "cygnus":              ["swan"],
    "delphinus":           ["dolphin", "porpoise"],
    "dorado":              ["swordfish", "goldfish"],
    "draco":               ["draco"],
    "equuleus":            ["filly", "little horse"],
    "eridanus":            ["eridanus"],
    "fornax":              ["furnace"],
    "gemini":              ["twins"],
    "grus":                ["crane"],
    "hercules":            ["hercules", "son of zeus"],
    "horologium":          ["clock"],
    "hydra":               ["sea serpent", "water snake"],
    "indus":               ["indian"],
    "lacerta":             ["lizard"],
    "leo minor":           ["little lion"],
    "leo":                 ["lion"],
    "lepus":               ["hare"],
    "libra":               ["balance", "scales"],
    "lupus":               ["wolf"],
    "lynx":                ["lynx"],
    "lyra":                ["lyre", "harp"],
    "mensa":               ["mensa"],
    "microscopium":        ["microscope"],
    "monoceros":           ["unicorn"],
    "musca":               ["southern fly", "fly"],
    "norma":               ["carpenter's level", "rule", "straightedge"],
    "octans":              ["octant"],
    "ophiuchus":           ["serpent-bearer", "holder of serpent"],
    "orion":               ["orion", "the hunter"],
    "pavo":                ["peacock"],
    "pegasus":             ["pegasus", "winged horse"],
    "perseus":             ["perseus"],
    "phoenix":             ["phoenix"],
    "pictor":              ["easel", "painter"],
    "pisces":              ["fishes"],
    "piscis austrinis":    ["southern fish"],
    "piscis austrinus":    ["southern fish"],
    "puppis":              ["poop", "stern of the argonauts"],
    "pyxis":               ["mariner's compass"],
    "reticulum":           ["net"],
    "sagitta":             ["arrow"],
    "sagittarius":         ["archer"],
    "scorpius":            ["scorpion"],
    "sculptor":            ["sculptor"],
    "scutum":              ["shield"],
    "serpens":             ["serpent"],
    "sextans":             ["sextant"],
    "taurus":              ["bull"],
    "telescopium":         ["telescopium"],
    "triangulum australe": ["southern triangle"],
    "triangulum":          ["triangulum"],
    "tucana":              ["toucan"],
    "ursa major":          ["big bear", "big dipper"],
    "ursa minor":          ["little bear", "little dipper"],
    "vela":                ["sail"],
    "virgo":               ["virgin"],
    "volans":              ["flying fish"],
    "vulpecula":           ["fox"],
}

// Extends dictionary with keys of added descriptions
Object.keys(celestialDictionary).reduce((acc, propName) =>
  celestialDictionary[propName].reduce((a, num) => {
    a[num] = propName;
    return a;
}, acc), celestialDictionary);
