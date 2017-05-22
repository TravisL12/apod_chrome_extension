'use strict';

function uniqueResults (value, index, self) {
    return self.findIndex((v) => {
        return v.title === value.title;
    }) === index;
};

function Keyword (name, category) {
    this.title = name[0].toUpperCase() + name.slice(1);
    this.query = `${name} ${category}`;
}

function KnowMore (text) {
    this.text = text;
    this.galaxies = this.findGalaxies();
    this.celestialObjects = this.findCelestialObjects();
    this.newGeneralCatalog = this.findNgc();
    this.results = this.buildResults();
}

KnowMore.prototype = {
    findGalaxies () {
        let match = this.text.match(/M+\d{1,3}\b/gi) || [];
        if (match.length) {
            match = this.createKeywords(match, 'galaxy');
        }

        return match;
    },

    findNgc () {
        let match = this.text.match(/NGC(-|\s)?\d{1,7}/gi) || [];
        if (match.length) {
            match = this.createKeywords(match, 'NGC');
        }

        return match;
    },

    findCelestialObjects () {
        let matches = [];
        for (let i in celestialDictionary) {
            let match = celestialDictionary[i].filter((constellation) => {
                const re = new RegExp('\\b' + constellation + '\\b', 'gi');
                return this.text.match(re);
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
        let frequency = {};

        for (let i in results) {
            const re = new RegExp('\\b' + results[i].title + '\\b', 'gi');
            frequency[results[i].title] = this.text.match(re).length;
        };

        console.log(frequency);

        return results.filter(uniqueResults).sort((a,b) => {
            return frequency[b.title] > frequency[a.title];
        }).slice(0,5);
    },

    createLink (result) {
        const el = document.createElement('li');

        const googleSearch = (e) => {
            el.removeEventListener('click', googleSearch); // No clicking twice!

            this.search(result.query).then((data) => {
                let response = JSON.parse(data.response);
                let items = response.items;
                let url = response.items[0].formattedUrl;
                let title = response.items[0].htmlTitle;
                el.innerHTML = `
                    ${el.innerHTML}
                    <a href="${items[0].formattedUrl}" target="_blank">${items[0].htmlTitle}</a>
                    <a href="${items[1].formattedUrl}" target="_blank">${items[1].htmlTitle}</a>
                    <a href="${items[2].formattedUrl}" target="_blank">${items[2].htmlTitle}</a>
                `;
            }, (error) => {
                console.log(JSON.parse(error.response).error.errors[0].message);
            });
        }

        el.innerHTML = '<h4>' + result.title + '</h4>';
        el.addEventListener('click', googleSearch);

        return el;
    },

    search (query) {
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
        'mercury','venus','mars','jupiter','saturn','uranus','neptune','pluto',
    ],

    'dwarf planet': [
        'ceres','haumea','makemake','eris',
    ],

    asteroid: [
        'alauda','aletheia','amphitrite','aurora','bamberga','camilla','cybele','daphne','davida','diotima',
        'doris','egeria','eros','eugenia','eunomia','euphrosyne','europa','fortuna','hebe','hektor','herculina',
        'hermione','hygiea','interamnia','iris','juno','lachesis','metis','nemesis','pallas','palma','patientia',
        'psyche','sylvia','themis','thisbe','ursula','vesta',
    ],

    moon: [
        'adrastea','aitne','albiorix','amalthea','ananke','anthe','aoede','arche','ariel','atlas','autonoe','belinda',
        'bianca','caliban','callirrhoe','callisto','calypso','carme','carpo','chaldene','charon','cordelia','cressida',
        'cupid','cyllene','deimos','desdemona','despina','dione','elara','enceladus','epimetheus','erinome','erriapo',
        'euanthe','eukelade','euporie','europa','eurydome','ferdinand','francisco','galatea','ganymede','halimede',
        'harpalyke','hegemone','helene','helike','hermippe','himalia','hyperion','iapetus','ijiraq','io','iocaste',
        'isonone','janus','juliet','kale','kallichore','kalyke','kiviuq','kore','laomedeia','larissa','leda','lysithea',
        'mab','magaclite','margaret','methone','metis','mimas','miranda','mneme','mundilfari','naiad','narvi','nereid',
        'neso','oberon','ophelia','orthosie','paaliaq','pallene','pan','pandora','pasiphae','pasithee','perdita','phobos',
        'phoebe','polydeuces','portia','praxidike','prometheus','prospero','proteus','psamathe','puck','rhea','rosalind',
        'sao','setebos','siarnaq','sinope','skathi','sponde','stephano','suttungr','sycorax','tarvos','taygete','telesto',
        'tethys','thalassa','thebe','thelxinoe','themisto','thrymr','thyone','titan','titania','trinculo','triton','umbriel','ymir',
    ],

    constellation: [
        "air pump","altar","andromeda","antlia","apus","aquarius","aquila","ara","archer","aries","arrow","auriga",
        "balance","berenice's hair","big bear","big dipper","big dog","bird of paradise","bootes","bull","caelum",
        "camelopardalis","camelopardus","cancer","canes venatici","canis major","canis minor","capricornus","carina",
        "carpenter's level","cassiopeia","cassiopeia","centaur","centaurus","cepheus","cepheus","cephus","cetus",
        "chameleon","chameleon","charioteer","circinus","clock","columba","coma berenices","compasses","corona australis",
        "corona borealis","corvus","crab","crane","cross","crow","crux","cygnus","delphinus","dolphin","dorado","dove",
        "draco","draco","eagle","easel","equuleus","eridanus","eridanus","filly","fishes","fly","flying fish","fornax",
        "fox","furnace","gemini","giraffe","giraffe","goat","goldfish","graving tool","great dog","grus","hare",
        "harp","hercules","hercules","herdsman","holder of serpent","horologium","hunting dogs","hydra","indian",
        "indus","keel of argonauts' ship","king of ethiopia","lacerta","leo minor","leo","leo","lepus","libra",
        "little bear","little dipper","little dog","little horse","little lion","lizard","lupus","lupus","lynx",
        "lynx","lyra","lyre","mariner's compass","mensa","mensa","microscope","microscopium","monoceros","musca",
        "norma","northern crown","octans","octant","ophiuchus","orion","orion","painter","pavo","peacock","pegasus",
        "pegasus","perseus","phoenix","phoenix","pictor","pisces","piscis austrinis","piscis austrinus","poop",
        "porpoise","princess of ethiopia","puppis","pyxis","queen of ethiopia","ram","raven","reticulum","rule",
        "sagitta","sagittarius","sail","scales","scorpion","scorpius","sculptor","sculptor","sculptor's tool",
        "scutum","sea goat","sea monster","sea serpent","serpens","serpent","serpent-bearer","sextans","sextant",
        "shield","son of zeus","southern cross","southern crown","southern fish","southern fish","southern fly",
        "southern triangle","stern of the argonauts","straightedge","swan","swordfish","taurus","telescopium",
        "telescopium","the hunter","toucan","triangulum australe","triangulum","triangulum","tucana","twins","unicorn",
        "ursa major","ursa minor","vela","virgin","virgo","volans","vulpecula","water bearer","water snake","whale","winged horse",
    ],
};
