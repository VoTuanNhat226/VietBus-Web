import {useMemo} from "react";
import Seat from "./Seat";
import {VietBusTheme} from "../../../constants/VietBusTheme";

const SeatMap34 = ({listTripSeat = [], title}) => {
    // tối ưu lookup
    const seatStatusMap = useMemo(() => {
        const map = {};
        listTripSeat.forEach((ts) => {
            map[ts.seat.seatNumber] = ts.status;
        });
        return map;
    }, [listTripSeat]);

    const renderSeat = (code) => (
        <Seat key={code} code={code} status={seatStatusMap[code] || "AVAILABLE"} />
    );

    return (
        <div className="space-y-3">
            <div
                className="text-center text-xl font-bold"
                style={{color: VietBusTheme.primary}}
            >
                {title}
            </div>

            {/* ===== TẦNG 1 ===== */}
            <h3 className="font-semibold">TẦNG 1</h3>
            <div className="space-y-2">
                {/* Hàng 1 (không có B) */}
                <div className="grid grid-cols-3 gap-x-20 justify-items-center">
                    {renderSeat("A1")}
                    <div/>
                    {/* khoảng trống */}
                    {renderSeat("C1")}
                </div>

                {[
                    ["A3", "B1", "C3"],
                    ["A5", "B3", "C5"],
                    ["A7", "B5", "C7"],
                    ["A9", "B7", "C9"],
                    ["A11", "B9", "C11"],
                ].map((row, idx) => (
                    <div
                        key={idx}
                        className="grid grid-cols-3 gap-x-20 justify-items-center"
                    >
                        {row.map(renderSeat)}
                    </div>
                ))}
            </div>

            {/* ===== TẦNG 2 ===== */}
            <h3 className="font-semibold">TẦNG 2</h3>
            <div className="space-y-2">
                {/* Hàng 1 (không có B) */}
                <div className="grid grid-cols-3 gap-x-20 justify-items-center">
                    {renderSeat("A2")}
                    <div/>
                    {renderSeat("C2")}
                </div>

                {[
                    ["A4", "B2", "C4"],
                    ["A6", "B4", "C6"],
                    ["A8", "B6", "C8"],
                    ["A10", "B8", "C10"],
                    ["A12", "B10", "C12"],
                ].map((row, idx) => (
                    <div
                        key={idx}
                        className="grid grid-cols-3 gap-x-20 justify-items-center"
                    >
                        {row.map(renderSeat)}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SeatMap34;