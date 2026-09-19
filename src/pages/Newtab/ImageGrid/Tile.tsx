import React, { useState } from 'react';
import { TNasaImage } from '../../types';
import { STile } from './styles';

const Tile: React.FC<{
  item: TNasaImage;
  onSelect: (item: TNasaImage) => void;
}> = ({ item, onSelect }) => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  return (
    <STile
      ratio={item.width / item.height}
      onClick={() => onSelect(item)}
      aria-label={item.title}
    >
      <img
        src={item.thumbUrl}
        alt={item.title}
        // A full wall is ~48 thumbnails at roughly 50KB each, so anything
        // below the fold waits until it is scrolled to.
        loading="lazy"
        decoding="async"
        className={isLoaded ? 'is-loaded' : ''}
        onLoad={() => setIsLoaded(true)}
        // A dead asset would otherwise sit as an empty box forever; fading it
        // in anyway lets the browser's broken-image state show.
        onError={() => setIsLoaded(true)}
      />
      <div className="tile__title">{item.title}</div>
    </STile>
  );
};

export default Tile;
