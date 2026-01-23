import { useEffect } from "react";
import { usePageTitle } from "../../context/PageTitleContext.jsx";

const Payment = () => {
  const { setTitle } = usePageTitle();

  useEffect(() => {
    setTitle("THANH TOÁN");
  }, []);
  return <h1>Payment</h1>;
};

export default Payment;
