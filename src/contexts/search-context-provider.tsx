"use client"

import React, { createContext, useState } from "react";
type TSearchContext = {
  searchQuery: string;
  handleChangeSearchQuery: (newValue: string) => void;
};
export const SearchContext = createContext<TSearchContext | null>(null);
export default function SearchContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  //states
  const [searchQuery, setSearchQuery] = useState("");
  //derived states

  //handlers / functions
  const handleChangeSearchQuery = (newValue: string) => {
    setSearchQuery(newValue);
  };
  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        handleChangeSearchQuery,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}
