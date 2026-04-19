import { useEffect, useState } from "react";
import SideBar from "../components/SideBar.jsx";
import Headbar from "../components/Headbar";
import {
  PageTitleProvider,
  usePageTitle,
} from "../context/PageTitleContext.jsx";
import { Outlet, useLocation, matchPath } from "react-router-dom";
import { ROUTE_TITLES } from "../constants/RouteTitles.js";

const LayoutContent = () => {
  const { setTitle } = usePageTitle();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const currentPath = location.pathname;
    let foundTitle = "";

    // Find matching title from ROUTE_TITLES
    for (const pathPattern in ROUTE_TITLES) {
      if (matchPath(pathPattern, currentPath)) {
        foundTitle = ROUTE_TITLES[pathPattern];
        break;
      }
    }

    if (foundTitle) {
      setTitle(foundTitle);
    }
  }, [location.pathname, setTitle]);

  return (
    <>
      {/* Top headboard */}
      <Headbar collapsed={collapsed} />

      {/* Left menu */}
      <SideBar
        collapsed={collapsed}
        onToggle={() => setCollapsed((prev) => !prev)}
      />

      {/* Content */}
      <div
        className="pt-20 p-6 min-h-screen bg-gray-100 transition-all duration-300"
        style={{ marginLeft: collapsed ? "3.5rem" : "15rem" }}
      >
        <Outlet />
      </div>
    </>
  );
};

const MainLayout = () => {
  return (
    <PageTitleProvider>
      <LayoutContent />
    </PageTitleProvider>
  );
};

export default MainLayout;
