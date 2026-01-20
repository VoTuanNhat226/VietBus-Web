import SideBar from "../components/./SideBar.jsx";
import Headbar from "../components/Headbar";
import {PageTitleProvider, usePageTitle} from "../context/PageTitleContext.jsx";

const LayoutContent = ({children}) => {
    const {title} = usePageTitle();

    return (
        <>
            {/* Top headbar */}
            <Headbar title={title}/>

            {/* Left menu */}
            <SideBar/>

            {/* Content */}
            <div className="ml-60 pt-20 p-6 min-h-screen bg-gray-100">{children}</div>
        </>
    );
};

const MainLayout = ({children}) => {
    return (
        <PageTitleProvider>
            <LayoutContent>{children}</LayoutContent>
        </PageTitleProvider>
    );
};

export default MainLayout;
