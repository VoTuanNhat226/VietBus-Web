import { useEffect } from "react";
import { usePageTitle } from "../../context/PageTitleContext";

const Statistic = () => {
  const { setTitle } = usePageTitle();

  useEffect(() => {
    setTitle("THỐNG KÊ");
  }, []);
  return <h1>Statistic</h1>;
};

export default Statistic;
