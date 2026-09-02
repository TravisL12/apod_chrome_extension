import React, { useMemo, useState } from 'react';
import { SGridTextInput, SGridTitle } from '../../styles';

type TSearchGridProps = {
  title: string;
  keyword: string;
  onChange: (key: string) => void;
};

export const useSearch = (items: { title: string }[] = []) => {
  const [keyword, setKeyword] = useState<string>('');

  const filteredItems = useMemo(() => {
    if (!keyword) {
      return items;
    }

    // Entries written by older versions can be missing a title entirely,
    // which used to throw and take the drawer down.
    const search = keyword.toLowerCase();
    return items.filter((item) => item?.title?.toLowerCase().includes(search));
  }, [keyword, items]);

  return { keyword, setKeyword, filteredItems };
};

const SearchGrid: React.FC<TSearchGridProps> = ({
  title,
  keyword,
  onChange,
}) => {
  const handleChange = (event: any) => {
    onChange(event.target.value);
  };

  return (
    <SGridTitle>
      <h1>{title}</h1>
      <div>
        <SGridTextInput
          value={keyword}
          onChange={handleChange}
          type="text"
          placeholder={`Search ${title}`}
        />
      </div>
    </SGridTitle>
  );
};

export default SearchGrid;
