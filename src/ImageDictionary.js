import planetSvg from "./imageSvg/planet";
import galaxySvg from "./imageSvg/galaxy";
import asteroidSvg from "./imageSvg/asteroid";
import moonSvg from "./imageSvg/moon";
import spacecraftSvg from "./imageSvg/spacecraft";
import satelliteSvg from "./imageSvg/satellite";
import ngcSvg from "./imageSvg/ngc";
import constellationSvg from "./imageSvg/constellation";

const ImageDictionary = {
  planet: dimension => {
    dimension = dimension || 15;
    return planetSvg(dimension);
  },

  "dwarf planet": dimension => {
    return ImageDictionary.planet(dimension);
  },

  asteroid: dimension => {
    dimension = dimension || 15;
    return asteroidSvg(dimension);
  },

  moon: dimension => {
    dimension = dimension || 15;
    return moonSvg(dimension);
  },

  satellite: dimension => {
    dimension = dimension || 15;
    return satelliteSvg(dimension);
  },

  spacecraft: dimension => {
    dimension = dimension || 15;
    return spacecraftSvg(dimension);
  },

  galaxy: dimension => {
    dimension = dimension || 15;
    return galaxySvg(dimension);
  },

  NGC: dimension => {
    dimension = dimension || 15;
    return ngcSvg(dimension);
  },

  constellation: dimension => {
    dimension = dimension || 15;
    return constellationSvg(dimension);
  }
};

export default ImageDictionary;
