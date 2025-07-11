import { useEffect, useState } from "react";
import { searchProducts } from "../services/ApiService";

export default function useSearch(query) {
  const [searchResults, setSearchResults] = useState(null);
  const [searchPage, setSearchPage] = useState(1);
  const [searchText, setSearchText] = useState(query);
  const [loading, setLoading] = useState(true);

  const resultsPerPage = 12; // Define how many results you want per page

  useEffect(() => {
    setLoading(true);
    setSearchResults(null);
    searchProducts(query, ((searchPage - 1) * resultsPerPage), resultsPerPage)
      .then((response) => {
        setSearchResults(response);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setSearchResults(null);
        setLoading(false);
      });
  }, [query, searchPage, searchText]);


  return { searchResults, loading, searchPage, setSearchPage, setSearchText };
};