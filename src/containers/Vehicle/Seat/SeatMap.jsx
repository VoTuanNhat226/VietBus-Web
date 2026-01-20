import Seat from "./Seat";
import { VietBusTheme } from "../../../constants/VietBusTheme";

const SeatMap = () => {
  return (
    <div className="space-y-4">
      <p
        className="text-center text-xl font-bold"
        style={{ color: VietBusTheme.primary }}
      >
        SƠ ĐỒ GHẾ
      </p>
      {/* ===== TẦNG 1 ===== */}
      <h3 className="font-semibold">TẦNG 1</h3>
      <div className="space-y-3">
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
            {row.map((seat) => (
              <Seat key={seat} code={seat} />
            ))}
          </div>
        ))}

        {/* hàng cuối */}
        <div className="grid grid-cols-5 gap-x-6 justify-items-center">
          {["A11", "A13", "B11", "C13", "C11"].map((seat) => (
            <Seat key={seat} code={seat} />
          ))}
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
            {row.map((seat) => (
              <Seat key={seat} code={seat} />
            ))}
          </div>
        ))}

        {/* hàng cuối */}
        <div className="grid grid-cols-5 gap-x-6 justify-items-center">
          {["A12", "A14", "B12", "C14", "C12"].map((seat) => (
            <Seat key={seat} code={seat} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SeatMap;
