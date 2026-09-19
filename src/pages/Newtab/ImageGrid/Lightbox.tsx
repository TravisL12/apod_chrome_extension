import React, { useEffect } from 'react';
import { prettyDateFormat } from '../../../utilities';
import { TNasaImage } from '../../types';
import { SGridButton, SLightbox, SLightboxInfo } from './styles';

const NASA_DETAILS_URL = 'https://images.nasa.gov/details';

const Lightbox: React.FC<{
  item: TNasaImage;
  onClose: () => void;
}> = ({ item, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <SLightbox
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      // Clicking the backdrop closes; clicks that bubble up from the image or
      // the caption must not.
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <SGridButton className="lightbox__close" onClick={onClose}>
        Close
      </SGridButton>
      <div className="lightbox__media">
        <img src={item.largeUrl} alt={item.title} />
      </div>
      <SLightboxInfo>
        <h2>{item.title}</h2>
        {item.description && <p>{item.description}</p>}
        <div className="lightbox__meta">
          {item.center && (
            <span className="lightbox__credit">NASA / {item.center}</span>
          )}
          {item.dateCreated && (
            <span>{prettyDateFormat(item.dateCreated.slice(0, 10))}</span>
          )}
          <a
            href={`${NASA_DETAILS_URL}/${item.nasaId}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View on images.nasa.gov
          </a>
          {item.origUrl && (
            <a href={item.origUrl} target="_blank" rel="noopener noreferrer">
              Full resolution
            </a>
          )}
        </div>
      </SLightboxInfo>
    </SLightbox>
  );
};

export default Lightbox;
