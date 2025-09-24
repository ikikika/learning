import React, { useRef, useState } from 'react';
import { Pressable, TextInput } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { scaleFontSize } from '../../assets/styles/scaling';
import style from './style';

const Search = ({ onSearch, placeholder = 'Search' }: SearchTypes) => {
  const textInputRef = useRef<TextInput>(null);
  const [search, setSearch] = useState('');

  const handleFocus = () => {
    textInputRef.current?.focus();
  };

  const handleSearch = (searchValue: string) => {
    setSearch(searchValue);
    onSearch(searchValue);
  };
  return (
    <Pressable style={style.searchInputContainer} onPress={handleFocus}>
      <FontAwesomeIcon
        icon={faSearch}
        color={'#25C0FF'}
        size={scaleFontSize(22)}
      />
      <TextInput
        placeholder={placeholder}
        ref={textInputRef}
        style={style.searchInput}
        value={search}
        onChangeText={value => handleSearch(value)}
      />
    </Pressable>
  );
};

interface SearchTypes {
  onSearch: (searchValue: string) => void;
  placeholder?: string;
}

export default Search;
