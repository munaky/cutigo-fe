import { User } from "@/types/user";

export const login = (token: string, user: User) => {
  setToken(token);
  setUser(user);
}

export const logout = () => {
  removeToken();
  removeUser();
}

export const getToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  };
  
  export const setToken = (token: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
    }
  };
  
  export const removeToken = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
  };
  
  export const getUser = (): User | null => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("user") || 'null');
    }
    return null;
  };
  
  export const setUser = (user: any) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(user));
    }
  };
  
  export const removeUser = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
    }
  };