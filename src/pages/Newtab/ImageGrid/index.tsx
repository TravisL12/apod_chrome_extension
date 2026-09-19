import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { GRID_LOAD_MORE_THRESHOLD } from '../../../constants';
import useAutoScroll from '../../../hooks/useAutoScroll';
import useImageGrid from '../../../hooks/useImageGrid';
import { splitIntoColumns } from '../../../utilities';
import { TAppOptions, TNasaImage } from '../../types';
import TopSites from '../TopSites';
import Lightbox from './Lightbox';
import Tile from './Tile';
import {
  SGridActions,
  SGridButton,
  SGridFooter,
  SGridMessage,
  SGridPage,
  SGridTopBar,
  SMasonry,
  SMasonryColumn,
} from './styles';

// Column count is driven off the viewport rather than a media query so the
// same number can be handed to the balancing helper.
const COLUMN_BREAKPOINTS = [
  { minWidth: 1900, columns: 5 },
  { minWidth: 1400, columns: 4 },
  { minWidth: 900, columns: 3 },
  { minWidth: 0, columns: 2 },
];

const columnsForWidth = (width: number): number =>
  COLUMN_BREAKPOINTS.find((breakpoint) => width >= breakpoint.minWidth)
    ?.columns ?? 3;

const ImageGrid: React.FC<{ options: TAppOptions }> = ({ options }) => {
  const { items, isLoading, isAppending, hasError, refresh, loadMore, isFull } =
    useImageGrid();
  const [selected, setSelected] = useState<TNasaImage | null>(null);
  const [columnCount, setColumnCount] = useState<number>(() =>
    columnsForWidth(window.innerWidth)
  );
  const scrollRef = useRef<HTMLDivElement>(null);

  // The drift stops while the lightbox is up -- it sits over the wall, so
  // scrolling underneath it is motion the viewer did not ask for.
  const isAutoScrolling = !!options.gridAutoScroll && !selected && !isLoading;

  const { isPaused } = useAutoScroll({
    containerRef: scrollRef,
    enabled: isAutoScrolling,
  });

  useEffect(() => {
    const handleResize = () =>
      setColumnCount(columnsForWidth(window.innerWidth));
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fires for the drift as well as for manual scrolling, since programmatic
  // scrollTop changes raise `scroll` just the same.
  const handleScroll = useCallback(() => {
    const container = scrollRef.current;
    if (!container || isFull || isAppending || isLoading) {
      return;
    }

    const remaining =
      container.scrollHeight - container.scrollTop - container.clientHeight;

    if (remaining < container.clientHeight * GRID_LOAD_MORE_THRESHOLD) {
      loadMore();
    }
  }, [isFull, isAppending, isLoading, loadMore]);

  // The first batch can be shorter than the viewport on a tall screen, which
  // would leave nothing to scroll and so never trigger the append.
  useEffect(() => {
    handleScroll();
  }, [handleScroll, items.length, columnCount]);

  const columns = useMemo(
    () => splitIntoColumns(items, columnCount),
    [items, columnCount]
  );

  const renderBody = () => {
    if (items.length) {
      return (
        <SMasonry>
          {columns.map((column, index) => (
            <SMasonryColumn key={index}>
              {column.map((item) => (
                <Tile key={item.nasaId} item={item} onSelect={setSelected} />
              ))}
            </SMasonryColumn>
          ))}
        </SMasonry>
      );
    }

    if (isLoading) {
      return <SGridMessage>Loading images…</SGridMessage>;
    }

    if (hasError) {
      return (
        <SGridMessage>
          Could not reach the NASA image library. Try shuffling again.
        </SGridMessage>
      );
    }

    return <SGridMessage>No images found.</SGridMessage>;
  };

  const autoScrollLabel = () => {
    if (!options.gridAutoScroll) return null;
    if (selected) return null;
    return isPaused ? 'Drift paused' : 'Drifting';
  };

  return (
    <SGridPage ref={scrollRef} onScroll={handleScroll}>
      <SGridTopBar>
        <div>{options.showTopSites && <TopSites />}</div>
        <SGridActions>
          {!!items.length && (
            <span className="count">{items.length} images</span>
          )}
          {!!items.length && autoScrollLabel() && (
            <span className="count">{autoScrollLabel()}</span>
          )}
          <SGridButton onClick={refresh} disabled={isLoading}>
            {isLoading ? 'Loading…' : 'Shuffle'}
          </SGridButton>
        </SGridActions>
      </SGridTopBar>
      {renderBody()}
      {!!items.length && (
        <SGridFooter>
          {isAppending && 'Loading more…'}
          {!isAppending && isFull && 'End of the wall — shuffle for a new set.'}
        </SGridFooter>
      )}
      {selected && (
        <Lightbox item={selected} onClose={() => setSelected(null)} />
      )}
    </SGridPage>
  );
};

export default ImageGrid;
