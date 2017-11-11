import planetSvg from './imageSvg/planet';
import galaxySvg from './imageSvg/galaxy';

const ImageDictionary = {
    planet: dimension => {
        dimension = dimension || 15;
        return planetSvg(dimension);
    },

    'dwarf planet': dimension => {
        return ImageDictionary.planet(dimension);
    },

    asteroid: dimension => {
        return ImageDictionary.planet(dimension);
    },

    moon: dimension => {
        return ImageDictionary.planet(dimension);
    },

    satellite: dimension => {
        return ImageDictionary.planet(dimension);
    },

    spacecraft: dimension => {
        return ImageDictionary.planet(dimension);
    },

    galaxy: dimension => {
        dimension = dimension || 20;
        return galaxySvg(dimension);
    },

    NGC: dimension => {
        return ImageDictionary.galaxy(dimension);
    },

    constellation: dimension => {
        return ImageDictionary.planet(dimension);
    },
};

export default ImageDictionary;
