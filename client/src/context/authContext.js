import * as React from "react";

const AuthContext = React.createContext();



function AuthProvider({ children }) {
  const [isAuth, setIsAuth ] = React.useState(false);
  const [currentLoginUser, setcurrentLoginUser] = React.useState(null);
  const [token, setToken] = React.useState(null);
  const value = { isAuth, setIsAuth, currentLoginUser, setcurrentLoginUser, token, setToken };
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
}

export { AuthProvider, useAuth };
