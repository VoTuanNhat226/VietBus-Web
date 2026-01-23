import {usePageTitle} from "../context/PageTitleContext.jsx";
import {useEffect} from "react";

const Home = () => {
    const {setTitle} = usePageTitle();

    useEffect(() => {
        setTitle("TỔNG QUAN");
    }, []);
    return (
        <>
            <h1>HOME</h1>
        </>
    );
};
export default Home;
