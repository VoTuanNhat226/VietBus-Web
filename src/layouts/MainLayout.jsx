import Menu from "../components/Menu";

const MainLayout = ({ children }) => {
  return (
    <>
      {/* Content */}
      <div className="ml-60 p-6 min-h-screen bg-gray-100">{children}</div>
      {/* Fixed right menu */}
      <Menu />
    </>
  );
};

export default MainLayout;
