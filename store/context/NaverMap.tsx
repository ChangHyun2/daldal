import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

export type NaverMapContextType = {
  naverMapEnabled: boolean;
  setNaverMapEnabled: Dispatch<SetStateAction<boolean>>;
};
const NaverMapContext = createContext<NaverMapContextType | undefined>(
  undefined
);

export const NaverMapContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [naverMapEnabled, setNaverMapEnabled] = useState(false);
  return (
    <NaverMapContext.Provider value={{ naverMapEnabled, setNaverMapEnabled }}>
      {children}
    </NaverMapContext.Provider>
  );
};

export const useNaverMapContext = () => {
  const naverMapContext = useContext(NaverMapContext);

  if (naverMapContext === undefined) {
    throw new Error(
      "naver map context must be used in naver map context provider"
    );
  }

  return naverMapContext;
};
