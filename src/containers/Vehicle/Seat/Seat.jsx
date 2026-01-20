import { CarOutlined } from "@ant-design/icons";

const Seat = ({ code }) => {
  return (
    <div className="flex flex-col items-center cursor-pointer text-gray-600 hover:text-blue-500">
      <CarOutlined className="text-2xl" />
      <span className="text-xs mt-1 font-bold">{code}</span>
    </div>
  );
};

export default Seat;
