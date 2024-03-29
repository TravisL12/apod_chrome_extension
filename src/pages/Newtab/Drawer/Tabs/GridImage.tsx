import React from 'react';
import { prettyDateFormat } from '../../../../utilities';
import { TFavoriteItem, THistoryItem } from '../../../types';
import { SGridItem } from '../../styles';

const GridImage: React.FC<{
  item: TFavoriteItem & THistoryItem;
  goToDate: (date: string) => void;
  removeItem?: (date: string) => void;
}> = ({ item, removeItem, goToDate }) => {
  return (
    <SGridItem>
      <div
        className="title"
        onClick={() => {
          goToDate(item.date);
        }}
      >
        <div className="title__inner">
          <p className="title__date">{prettyDateFormat(item.date)}</p>
          <p>
            <strong>
              {item.title}{' '}
              {item.mediaType && item.mediaType !== 'image' && '(Video)'}
            </strong>
          </p>
        </div>
      </div>
      <div
        className="media"
        onClick={() => {
          goToDate(item.date);
        }}
      >
        <img
          src={item.url || item.imgUrl}
          style={{ maxWidth: '100%', maxHeight: '100%' }}
        />
      </div>
      {removeItem && (
        <div className="remove-item">
          <button onClick={() => removeItem(item.date)}>Remove</button>
        </div>
      )}
    </SGridItem>
  );
};

export default GridImage;
