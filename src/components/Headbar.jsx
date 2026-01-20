const Headbar = ({ title }) => {
  return (
    <div className="fixed top-0 left-60 right-0 h-16 bg-white shadow flex items-center px-6 z-50">
      <h1 className="text-2xl font-semibold text-gray-800 mb-0">{title}</h1>
    </div>
  );
};

export default Headbar;
