import {usePageTitle} from "../../context/PageTitleContext.jsx";
import {useEffect} from "react";

const PassengerManagement = () => {
    const {setTitle} = usePageTitle();

    useEffect(() => {
        setTitle("QUẢN LÝ KHÁCH HÀNG");
    }, []);

    return (
        <></>
    )
}

export default PassengerManagement;