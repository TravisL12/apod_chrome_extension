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
    return items.filter((item: { title: string }) => {
      return item.title.toLowerCase().includes(keyword.toLowerCase());
    });
  }, [keyword]);

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
