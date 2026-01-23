import { CarOutlined } from "@ant-design/icons";

const Seat = ({ code, status }) => {
  const getColor = () => {
    switch (status) {
      case "SOLD":
        return "text-green-600";
      case "HOLD":
        return "text-red-500";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className={`flex flex-col items-center cursor-pointer ${getColor()}`}>
      <CarOutlined className="text-2xl" />
      <span className="text-xs mt-1 font-bold">{code}</span>
    </div>
  );
};

export default Seat;
