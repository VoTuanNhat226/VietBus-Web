import { createContext, useContext, useState } from "react";

const PageTitleContext = createContext();

export const PageTitleProvider = ({ children }) => {
  const [title, setTitle] = useState("");
  const [headerAction, setHeaderAction] = useState(null);

  return (
    <PageTitleContext.Provider value={{ title, setTitle, headerAction, setHeaderAction }}>
      {children}
    </PageTitleContext.Provider>
  );
};

export const usePageTitle = () => useContext(PageTitleContext);
