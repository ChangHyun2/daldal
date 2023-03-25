import React, { createContext, useContext } from "react";

type FooContextType = {};
export const FooContext = createContext<FooContextType | undefined>(undefined);

export const FooContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  <FooContext.Provider value={{}}>{children}</FooContext.Provider>;
};

export const useFooContext = () => {
  const fooContext = useContext(FooContext);
  if (fooContext === undefined) {
    throw new Error("FooContext must be used in FooContextProvider");
  }

  return fooContext;
};
