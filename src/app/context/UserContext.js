"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import getAuthCurrentUser from "../utilites/getAuthCurrentUser";

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getAuthCurrentUser();
        console.log("User from UserContext:", user);
        setCurrentUser(user);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setCurrentUser(null);
      }
    };
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ currentUser, setUser: setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};
