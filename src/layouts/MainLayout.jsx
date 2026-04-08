import SideBar from "../components/./SideBar.jsx";
import Headbar from "../components/Headbar";
import {PageTitleProvider, usePageTitle} from "../context/PageTitleContext.jsx";
import {Outlet} from "react-router-dom";

const LayoutContent = () => {
    const {title} = usePageTitle();

    return (
        <>
            {/* Top headbar */}
            <Headbar title={title}/>

            {/* Left menu */}
            <SideBar/>

            {/* Content */}
            <div className="ml-60 pt-20 p-6 min-h-screen bg-gray-100">
                <Outlet/>
            </div>
        </>
    );
};

const MainLayout = () => {
    return (
        <PageTitleProvider>
            <LayoutContent/>
        </PageTitleProvider>
    );
};

export default MainLayout;
