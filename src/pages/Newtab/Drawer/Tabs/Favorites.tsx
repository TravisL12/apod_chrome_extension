import React, { useMemo } from 'react';
import { SHistoryContainer, SHistoryItem } from '../../styles';

const Favorites: React.FC<{
  viewFavorites: { [key: string]: { date: string } };
  goToApodDate: (date: string) => void;
}> = ({ viewFavorites = {}, goToApodDate }) => {
  const sortedFavorites = useMemo(() => {
    return Object.values(viewFavorites).sort((a, b) => {
      return b.date > a.date ? 1 : -1;
    });
  }, [viewFavorites]);

  return (
    <div>
      <h1>Favorites</h1>
      <SHistoryContainer>
        {sortedFavorites.length === 0 ? (
          <h3>You haven't saved any favorites!</h3>
        ) : (
          sortedFavorites.map((item: any, idx: number) => {
            return (
              <SHistoryItem
                key={`${item.date}-${idx}`}
                onClick={() => {
                  goToApodDate(item.date);
                }}
              >
                <div className="title">
                  <p>
                    {item.title} {item.mediaType !== 'image' && '(Video)'}
                  </p>
                </div>
                <div className="media">
                  <img
                    src={item.url}
                    style={{ maxWidth: '100%', maxHeight: '100%' }}
                  />
                </div>
              </SHistoryItem>
            );
          })
        )}
      </SHistoryContainer>
    </div>
  );
};

export default Favorites;
