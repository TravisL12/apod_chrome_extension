import React from 'react';
import { prettyDateFormat } from '../../../../utilities';
import { SHistoryItem } from '../../styles';

const GridImage: React.FC<{
  item: any;
  handleClick: (date: string) => void;
}> = ({ item, handleClick }) => {
  return (
    <SHistoryItem
      onClick={() => {
        handleClick(item.date);
      }}
    >
      <div className="title">
        <div className="title__inner">
          <p className="title__date">{prettyDateFormat(item.date)}</p>
          <p>
            <strong>
              {item.title} {item.mediaType !== 'image' && '(Video)'}
            </strong>
          </p>
        </div>
      </div>
      <div className="media">
        <img src={item.url} style={{ maxWidth: '100%', maxHeight: '100%' }} />
      </div>
    </SHistoryItem>
  );
};

export default GridImage;
