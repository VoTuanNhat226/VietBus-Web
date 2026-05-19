import Seat from "./Seat";
import {VietBusTheme} from "../../../constants/VietBusTheme";
import {useMemo} from "react";

const SeatMap24 = ({listTripSeat = [], title, onSeatClick}) => {
    // map nhanh để lookup
    const seatStatusMap = useMemo(() => {
        const map = {};
        listTripSeat.forEach((ts) => {
            map[ts.seat.seatNumber] = ts.status;
        });
        return map;
    }, [listTripSeat]);

    const renderSeat = (code) => (
        <Seat 
            key={code} 
            code={code} 
            status={seatStatusMap[code] || "AVAILABLE"}
            onClick={onSeatClick}
        />
    );

    return (
        <div className="space-y-2">
            <div
                className="text-center text-xl font-bold"
                style={{color: VietBusTheme.primary}}
            >
                {title}
            </div>

            {/* ===== TẦNG 1 ===== */}
            <h3 className="font-semibold">TẦNG 1</h3>
            <div className="space-y-1">
                {[
                    ["A1", "B1"],
                    ["A3", "B3"],
                    ["A5", "B5"],
                    ["A7", "B7"],
                    ["A9", "B9"],
                    ["A11", "B11"]
                ].map((row, idx) => (
                    <div
                        key={idx}
                        className="grid grid-cols-2 gap-x-12 justify-items-center"
                    >
                        {row.map(renderSeat)}
                    </div>
                ))}
            </div>

            {/* ===== TẦNG 2 ===== */}
            <h3 className="font-semibold">TẦNG 2</h3>
            <div className="space-y-1">
                {[
                    ["A2", "B2"],
                    ["A4", "B4"],
                    ["A6", "B6"],
                    ["A8", "B8"],
                    ["A10", "B10"],
                    ["A12", "B12"]
                ].map((row, idx) => (
                    <div
                        key={idx}
                        className="grid grid-cols-2 gap-x-12 justify-items-center"
                    >
                        {row.map(renderSeat)}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SeatMap24;
