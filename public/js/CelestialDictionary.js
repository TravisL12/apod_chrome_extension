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

    satellite: [
        'hubble', 'james webb', 'new horizons', 'voyager', 'spitzer', 'cassini',
    ],

    spacecraft: [
        'apollo', 'saturn v', 'gemini', 'shuttle',
    ],

    galaxy: [
        "andromeda","black eye","bode's","cartwheel","cigar","cosmos redshift 7","hoag's object","large magellanic cloud",
        "mayall's object","milky way","pinwheel","small magellanic cloud","sombrero","sunflower","tadpole","whirlpool",
    ],

    constellation: [
        "air pump","altar","andromeda","antlia","apus","aquarius","aquila","ara","archer","aries","arrow","auriga",
        "balance","berenice's hair","big bear","big dipper","big dog","bird of paradise","bootes","bull","caelum",
        "camelopardalis","camelopardus","cancer","canes venatici","canis major","canis minor","capricornus","carina",
        "carpenter's level","cassiopeia","cassiopeia","centaur","centaurus","cepheus","cepheus","cephus","cetus",
        "chameleon","chameleon","charioteer","circinus","clock","columba","coma berenices","compasses","corona australis",
        "corona borealis","corvus","crab","crane","crow","crux","cygnus","delphinus","dolphin","dorado","dove",
        "draco","draco","eagle","easel","equuleus","eridanus","eridanus","filly","fishes","flying fish","fornax",
        "fox","furnace","gemini","giraffe","giraffe","goat","goldfish","graving tool","great dog","grus","hare",
        "harp","hercules","hercules","herdsman","holder of serpent","horologium","hunting dogs","hydra","indian",
        "indus","keel of argonauts' ship","king of ethiopia","lacerta","leo minor","leo","leo","lepus","libra",
        "little bear","little dipper","little dog","little horse","little lion","lizard","lupus","lupus","lynx",
        "lynx","lyra","lyre","mariner's compass","mensa","mensa","microscope","microscopium","monoceros","musca",
        "norma","northern crown","octans","octant","ophiuchus","orion","orion","painter","pavo","peacock","pegasus",
        "pegasus","perseus","phoenix","phoenix","pictor","pisces","piscis austrinis","piscis austrinus",
        "porpoise","princess of ethiopia","puppis","pyxis","queen of ethiopia","ram","raven","reticulum",
        "sagitta","sagittarius","sail","scales","scorpion","scorpius","sculptor","sculptor","sculptor's tool",
        "scutum","sea goat","sea monster","sea serpent","serpens","serpent","serpent-bearer","sextans","sextant",
        "shield","son of zeus","southern cross","southern crown","southern fish","southern fish","southern fly",
        "southern triangle","stern of the argonauts","straightedge","swan","swordfish","taurus","telescopium",
        "telescopium","the hunter","toucan","triangulum australe","triangulum","triangulum","tucana","twins","unicorn",
        "ursa major","ursa minor","vela","virgin","virgo","volans","vulpecula","water bearer","water snake","whale","winged horse",
    ],

};

// Add Messier Objects (110 total)
for (let i = 1; i <= 110; i++) {
    celestialDictionary.galaxy.push('M' + i);
}
