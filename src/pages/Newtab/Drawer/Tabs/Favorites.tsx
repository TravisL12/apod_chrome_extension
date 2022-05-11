import React, { useMemo } from 'react';
import { removeFavorite, thumbSourceLink } from '../../../../utilities';
import { TFavoriteItem } from '../../../types';
import { SGridImageContainer } from '../../styles';
import GridImage from './GridImage';

// Some favorites were bookmarked from the previous API used
const extractHerokuImageUrl = (imgUrl?: string) => {
  if (imgUrl) {
    const searchStr = imgUrl.replace('apodapi.herokuapp.com/image/', '');
    return new URLSearchParams(searchStr).get('image');
  }
  return false;
};

const convertV3Favorite = (favorite: TFavoriteItem, dateKey: string) => {
  const imgUrl = extractHerokuImageUrl(favorite.imgUrl);
  const url = favorite.url || imgUrl || thumbSourceLink(dateKey);
  return { ...favorite, url, date: dateKey };
};

const Favorites: React.FC<{
  viewFavorites: { [key: string]: TFavoriteItem };
  goToApodDate: (date: string) => void;
}> = ({ viewFavorites = {}, goToApodDate }) => {
  const sortedFavorites = useMemo(() => {
    const adjFav = Object.keys(viewFavorites).map((dateKey) => {
      return convertV3Favorite(viewFavorites[dateKey], dateKey);
    });

    return adjFav.sort((a, b) => {
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
