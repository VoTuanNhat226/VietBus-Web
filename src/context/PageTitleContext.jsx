import { createContext, useContext, useState } from "react";

const PageTitleContext = createContext();

export const PageTitleProvider = ({ children }) => {
  const [title, setTitle] = useState("");

  return (
    <PageTitleContext.Provider value={{ title, setTitle }}>
      {children}
    </PageTitleContext.Provider>
  );
};

export const usePageTitle = () => useContext(PageTitleContext);
