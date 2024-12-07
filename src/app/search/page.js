"use client";
import React, { useState, useEffect } from "react";
import SearchBar from "../UI/Components/SearchBar";
import { Container, Typography, CircularProgress } from "@mui/material";
import ItemList from "../UI/Components/ItemList";

export default function SearchBarForm({url}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [noResults, setNoResults] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  // Function to fetch data from the API
  const handleSearch = async (HopeFuelID) => {
    setLoading(true);
    setError(null);
    setNoResults(false);

    try {
      // const url = HopeFuelID
      //   ? `/api/searchDB?HopeFuelID=${HopeFuelID}&page=${page}`
      //   : `/api/searchDB?page=${page}`;
      const apiUrl = `${url}?HopeFuelID=${HopeFuelID || ""}&page=${page}`;

      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error("No item found");
      }

      const data = await response.json();
      console.log("Fetched Data:", data);

      if (data.length === 0 && page === 1) {
        setNoResults(true);
      } else {
        setItems((prevItems) => (page === 1 ? data : [...prevItems, ...data]));
      }
    } catch (error) {
      console.error("Search Error:", error);
      setError("No item found"); // Set error message to "No item found"
    } finally {
      setLoading(false);
    }
  };

  // Handle search input changes
  const handleSearchChange = (query) => {
    setSearchQuery(query);
    setPage(1); // Reset to first page on new search
    handleSearch(query);
  };

  // Load more items when "Load More" is clicked
  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  // Fetch data when page changes
  useEffect(() => {
    if (page > 1 || searchQuery === "") {
      handleSearch(searchQuery);
    }
  }, [page]);

  return (
    <Container
      maxWidth="md"
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        paddingTop: { xs: "8%", md: "5%" },
        boxSizing: "border-box",
        textAlign: "center",
      }}
    >
      {/* Search Bar */}
      <SearchBar onSearch={handleSearchChange} />

      {/* Conditional Rendering */}
      {loading ? (
        <CircularProgress />
      ) : error || noResults ? (
        <Typography variant="body1" color="error">
          No item found
        </Typography>
      ) : (
        <ItemList
          items={items}
          hasInput={searchQuery.length > 0}
          onLoadMore={handleLoadMore}
          onItemClick={(HopeFuelID) => console.log("Item clicked:", HopeFuelID)}
        />
      )}
    </Container>
  );
}
