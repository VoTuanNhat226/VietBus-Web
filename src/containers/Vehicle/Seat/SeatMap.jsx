import Seat from "./Seat";
import { VietBusTheme } from "../../../constants/VietBusTheme";

const SeatMap = ({ listTripSeat = [], title }) => {
  // map nhanh để lookup
  const seatStatusMap = {};
  listTripSeat.forEach((ts) => {
    seatStatusMap[ts.seat.seatNumber] = ts.status;
  });

  const renderSeat = (code) => (
    <Seat key={code} code={code} status={seatStatusMap[code] || "AVAILABLE"} />
  );

  return (
    <div className="space-y-2">
      <div
        className="text-center text-xl font-bold"
        style={{ color: VietBusTheme.primary }}
      >
        {title}
      </div>

      {/* ===== TẦNG 1 ===== */}
      <h3 className="font-semibold">TẦNG 1</h3>
      <div className="space-y-1">
        {[
          ["A1", "B1", "C1"],
          ["A3", "B3", "C3"],
          ["A5", "B5", "C5"],
          ["A7", "B7", "C7"],
          ["A9", "B9", "C9"],
        ].map((row, idx) => (
          <div
            key={idx}
            className="grid grid-cols-3 gap-x-20 justify-items-center"
          >
            {row.map(renderSeat)}
          </div>
        ))}

        <div className="grid grid-cols-5 gap-x-6 justify-items-center">
          {["A11", "A13", "B11", "C13", "C11"].map(renderSeat)}
        </div>
      </div>

      {/* ===== TẦNG 2 ===== */}
      <h3 className="font-semibold">TẦNG 2</h3>
      <div className="space-y-3">
        {[
          ["A2", "B2", "C2"],
          ["A4", "B4", "C4"],
          ["A6", "B6", "C6"],
          ["A8", "B8", "C8"],
          ["A10", "B10", "C10"],
        ].map((row, idx) => (
          <div
            key={idx}
            className="grid grid-cols-3 gap-x-20 justify-items-center"
          >
            {row.map(renderSeat)}
          </div>
        ))}

        <div className="grid grid-cols-5 gap-x-6 justify-items-center">
          {["A12", "A14", "B12", "C14", "C12"].map(renderSeat)}
        </div>
      </div>
    </div>
  );
};

export default SeatMap;
