import React, {
  ChangeEvent,
  SyntheticEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  SearchForm,
  SearchInput,
  SearchSubmit,
} from "@components/Search/Search.styled";

import { LocaleString } from "@hooks/useLocale";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/router";

const Search = () => {
  const [value, setValue] = useState<string>();
  const router = useRouter();
  const search = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    router.push({
      pathname: "/search",
      query: {
        ...router.query,
        q: value,
      },
    });
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  useEffect(() => {
    if (router) {
      const { q } = router.query;
      if (q && search.current) search.current.value = q as string;
      setValue(q as string);
    }
  }, [router]);

  return (
    <SearchForm onSubmit={handleSubmit} data-testid="search-form">
      <SearchInput onChange={handleSearchChange} ref={search} />
      <MagnifyingGlassIcon />
      <SearchSubmit type="submit">{LocaleString("searchButton")}</SearchSubmit>
    </SearchForm>
  );
};

export default Search;
