import React, { useMemo } from 'react';
import { removeFavorite } from '../../../../utilities';
import { SGridImageContainer } from '../../styles';
import GridImage from './GridImage';

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
    <>
      <h1>Favorites</h1>
      <SGridImageContainer>
        {sortedFavorites.length === 0 ? (
          <h3>You haven't saved any favorites!</h3>
        ) : (
          sortedFavorites.map((item: any, idx: number) => {
            return (
              <GridImage
                key={`${item.date}-${idx}`}
                goToDate={goToApodDate}
                removeItem={removeFavorite}
                item={item}
              />
            );
          })
        )}
      </SGridImageContainer>
    </>
  );
};

export default Favorites;
