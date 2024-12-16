"use client";
import React, { useState, useEffect } from "react";
import SearchBar from "../UI/Components/SearchBar";
import { Container, Typography, CircularProgress, Box , Divider} from "@mui/material";
import ItemList from "../UI/Components/ItemList";
import getScreenShotUrl from "../utilites/getScreenShotUrl";
import WalletSelect from "../UI/Components/GroupWallet";





export default function SearchBarForm() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [noResults, setNoResults] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  // Function to fetch data from the API
  const handleSearch = async (HopeFuelID) => {
    console.log("HopeID is " + HopeFuelID);
    setLoading(true);
    setError(null);
    setNoResults(false);
    try {
      const url = HopeFuelID
        ? `/api/searchDB?HopeFuelID=${HopeFuelID}&page=${page}`
        : `/api/searchDB?page=${page}`;

      const response = await fetch(url);
      console.log(response);

      if (!response.ok) {
        throw new Error("No item found");
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        for (let i = 0; i < data.length; i++) {
          console.log(data[i]);
          if (Array.isArray(data[i]["ScreenShotLinks"])) {
            console.log(data[i]["ScreenShotLinks"].length);
            for (
              let screenshot = 0;
              screenshot < data[i]["ScreenShotLinks"].length;
              screenshot++
            ) {
              let tmp = await getScreenShotUrl(
                data[i]["ScreenShotLinks"][screenshot]
              );
              data[i]["ScreenShotLinks"][screenshot] = tmp.href;
            }
          }
        }
        console.log("my Data:", data);

        if (data.length === 0 && page === 1) {
          setNoResults(true);
        } else {
          console.log("My final data");
          console.log(data);
          setItems((prevItems) =>
            page === 1 ? data : [...prevItems, ...data]
          );
        }
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
      <Box sx={{ width: "100%" , marginTop: "3px"}}>
        <SearchBar onSearch={handleSearchChange} />
      </Box>

      <Box sx={{ width: "100%", marginY: 2 }}>
        <Divider sx={{ borderColor: "#e0e0e0", width: "100%" }} />
      </Box>

      {/* wallet select */}
      <Box
        component="section"
        sx={{
          width: 270,
          paddingLeft: 2,
          paddingRight: 2,

          border: "1px solid #e0e0e0",
          borderRadius: "30px",
          marginBottom: "16px",
        }}
      >
        <WalletSelect />
      </Box>

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
