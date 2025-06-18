import { jwtDecode } from "jwt-decode";
import type { CustomJwtPayload } from "../types/type";

export const isAuthenticated = (): boolean => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) return false;

    const payload = JSON.parse(atob(token.split('.')[1])); // Decode the payload
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

    // Check if token has expired
    if (payload.exp && payload.exp < currentTime) {
      // Optionally: remove token if expired
      localStorage.removeItem('accessToken');
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};


export const getTokenData = (): CustomJwtPayload | null => {
  const token = localStorage.getItem("accessToken"); // Or use sessionStorage.getItem("token")
  if (!token) {
    return null; // Return null if no token found
  }
  try {
    const decoded: CustomJwtPayload = jwtDecode<CustomJwtPayload>(token);
    return decoded; // Return the decoded token data
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
};
