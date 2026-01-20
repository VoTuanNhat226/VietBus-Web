import {usePageTitle} from "../context/PageTitleContext.jsx";
import {useEffect} from "react";

const Home = () => {
    const {setTitle} = usePageTitle();

    useEffect(() => {
        setTitle("TRANG CHỦ");
    }, []);
    return (
        <>
            <h1>HOME</h1>
        </>
    );
};
export default Home;
