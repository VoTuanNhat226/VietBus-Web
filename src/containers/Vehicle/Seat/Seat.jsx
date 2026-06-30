import { CarOutlined } from "@ant-design/icons";

const Seat = ({ code, status, onClick }) => {
  const getColor = () => {
    switch (status) {
      case "SOLD":
      case "HOLD":
        return "text-green-600";
      case "SELECTED":
        return "text-blue-500";
      case "BLOCKED":
        return "text-red-600";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div
      className={`flex flex-col items-center cursor-pointer ${getColor()}`}
      onClick={() => onClick && onClick(code, status)}
    >
      <i className="fa-solid fa-couch text-2xl" />
      <span className="text-xs mt-1 font-bold">{code}</span>
    </div>
  );
};

export default Seat;
