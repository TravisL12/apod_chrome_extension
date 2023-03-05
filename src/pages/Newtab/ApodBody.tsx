import React, { useMemo, useState } from 'react';
import useFetchApod from '../../hooks/useFetchApod';
import { useNavigation } from '../../hooks/useNavigation';
import { TAppOptions } from '../types';
import Drawer from './Drawer';
import Header from './Header';
import ImageContainer from './ImageContainer';
import Loading from './Loading';
import { SApodContainer, SMediaContainer } from './styles';
import VideoContainer from './VideoContainer';

const ApodBody: React.FC<{ options: TAppOptions }> = ({ options }) => {
  const [drawerDisplay, setDrawerDisplay] = useState<string | null>(null);
  const [drawerIsOpen, setDrawerIsOpen] = useState<boolean>(false);
  const { hiResOnly, showTopSites, apodHistory, apodFavorites } = options;

  const handleToggleDrawer = (drawerOption: string | null) => {
    const canClose = drawerDisplay === drawerOption && drawerIsOpen;
    if (canClose) {
      setDrawerIsOpen(false);
    } else {
      setDrawerIsOpen(true);
      setDrawerDisplay(drawerOption);
    }
  };

  const { apodResponse, isLoading, errorMessage, loadImage, fetchApod } =
    useFetchApod({
      hiResOnly,
      setDrawerIsOpen,
    });

  const { navigationButtons, goToApodDate } = useNavigation({
    response: apodResponse,
    options,
    fetchApod,
    loadImage,
    toggleDrawer: handleToggleDrawer,
  });

  const renderBody = useMemo(() => {
    if (!apodResponse) {
      return <Loading isLoading={isLoading} />;
    }

    if (apodResponse.errorMessage) {
      return <h1 style={{ color: 'white' }}>{apodResponse.errorMessage}</h1>;
    }

    return apodResponse.media_type === 'video' ? (
      <VideoContainer url={apodResponse?.url} />
    ) : (
      <ImageContainer loadedImage={apodResponse.loadedImage} />
    );
  }, [errorMessage, apodResponse, isLoading]);

  return (
    <SApodContainer>
      <Header
        isLoading={isLoading}
        response={apodResponse}
        navigationButtons={navigationButtons}
        goToApodDate={goToApodDate}
        showTopSites={showTopSites}
      />
      {apodResponse && (
        <div style={{ position: 'absolute', left: '20px', bottom: '20px' }}>
          <Loading isLoading={isLoading} />
        </div>
      )}
      <SMediaContainer>{renderBody}</SMediaContainer>
      <Drawer
        drawerDisplay={drawerDisplay}
        isOpen={drawerIsOpen}
        response={apodResponse}
        toggleDrawer={handleToggleDrawer}
        viewHistory={apodHistory}
        viewFavorites={apodFavorites}
        goToApodDate={goToApodDate}
      />
    </SApodContainer>
  );
};

export default ApodBody;
