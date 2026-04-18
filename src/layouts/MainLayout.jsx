import {useState} from "react";
import SideBar from "../components/SideBar.jsx";
import Headbar from "../components/Headbar";
import {PageTitleProvider, usePageTitle} from "../context/PageTitleContext.jsx";
import {Outlet} from "react-router-dom";

const LayoutContent = () => {
    const {title} = usePageTitle();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <>
            {/* Top headboard */}
            <Headbar collapsed={collapsed}/>

            {/* Left menu */}
            <SideBar collapsed={collapsed} onToggle={() => setCollapsed(prev => !prev)}/>

            {/* Content */}
            <div
                className="pt-20 p-6 min-h-screen bg-gray-100 transition-all duration-300"
                style={{marginLeft: collapsed ? "4rem" : "15rem"}}
            >
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