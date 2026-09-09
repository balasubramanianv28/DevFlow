import { useState } from "react";
import {
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    X,
} from "lucide-react";

interface DatePickerProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

const DatePicker = ({
    value,
    onChange,
    placeholder = "dd-mm-yyyy",
}: DatePickerProps) => {
    const [open, setOpen] = useState(false);

    const selectedDate = value
        ? new Date(`${value}T00:00:00`)
        : null;

    const [currentMonth, setCurrentMonth] = useState(
        selectedDate || new Date()
    );

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(
        year,
        month + 1,
        0
    ).getDate();

    const monthName = currentMonth.toLocaleString(
        "en-US",
        {
            month: "long",
        }
    );

    const formatDate = (day: number) => {
        const monthValue = String(month + 1).padStart(
            2,
            "0"
        );

        const dayValue = String(day).padStart(2, "0");

        return `${year}-${monthValue}-${dayValue}`;
    };

    const displayDate = selectedDate
        ? selectedDate.toLocaleDateString("en-GB")
        : "";

    const goToPreviousMonth = () => {
        setCurrentMonth(
            new Date(year, month - 1, 1)
        );
    };

    const goToNextMonth = () => {
        setCurrentMonth(
            new Date(year, month + 1, 1)
        );
    };

    const handleSelectDate = (day: number) => {
        onChange(formatDate(day));
        setOpen(false);
    };

    const handleToday = () => {
        const today = new Date();

        const todayValue = `${today.getFullYear()}-${String(
            today.getMonth() + 1
        ).padStart(2, "0")}-${String(
            today.getDate()
        ).padStart(2, "0")}`;

        onChange(todayValue);
        setCurrentMonth(today);
        setOpen(false);
    };

    const handleClear = () => {
        onChange("");
        setOpen(false);
    };

    return (
        <div className="relative">
            {/* Date Input */}
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className={`w-full h-11 px-4 rounded-xl border bg-white/[0.03] text-sm flex items-center justify-between transition-all ${open
                    ? "border-orange-500/50 bg-orange-500/[0.04]"
                    : "border-white/[0.08] hover:border-white/[0.14]"
                    }`}
            >
                <span
                    className={
                        displayDate
                            ? "text-white"
                            : "text-white/25"
                    }
                >
                    {displayDate || placeholder}
                </span>

                <CalendarDays
                    size={17}
                    className={`transition-colors ${open
                        ? "text-orange-500"
                        : "text-white/30"
                        }`}
                />
            </button>

            {/* Calendar */}
            {open && (
                <div className="absolute left-0 bottom-[calc(100%+8px)] z-[60] w-[280px] rounded-2xl border border-white/[0.08] bg-[#111111] p-4 shadow-2xl shadow-black/60">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <button
                            type="button"
                            onClick={goToPreviousMonth}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/35 hover:text-orange-500 hover:bg-orange-500/10 transition-all"
                        >
                            <ChevronLeft size={17} />
                        </button>

                        <p className="text-sm font-semibold text-white">
                            {monthName}{" "}
                            <span className="text-orange-500">
                                {year}
                            </span>
                        </p>

                        <button
                            type="button"
                            onClick={goToNextMonth}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/35 hover:text-orange-500 hover:bg-orange-500/10 transition-all"
                        >
                            <ChevronRight size={17} />
                        </button>
                    </div>

                    {/* Weekdays */}
                    <div className="grid grid-cols-7 mb-2">
                        {[
                            "Su",
                            "Mo",
                            "Tu",
                            "We",
                            "Th",
                            "Fr",
                            "Sa",
                        ].map((day) => (
                            <span
                                key={day}
                                className="h-8 flex items-center justify-center text-[10px] font-medium text-white/25"
                            >
                                {day}
                            </span>
                        ))}
                    </div>

                    {/* Days */}
                    <div className="grid grid-cols-7 gap-1">
                        {Array.from({
                            length: firstDay,
                        }).map((_, index) => (
                            <div
                                key={`empty-${index}`}
                            />
                        ))}

                        {Array.from({
                            length: daysInMonth,
                        }).map((_, index) => {
                            const day = index + 1;
                            const dateValue =
                                formatDate(day);

                            const isSelected =
                                value === dateValue;

                            return (
                                <button
                                    key={day}
                                    type="button"
                                    onClick={() =>
                                        handleSelectDate(
                                            day
                                        )
                                    }
                                    className={`h-8 rounded-lg text-xs transition-all ${isSelected
                                        ? "bg-orange-500 text-black font-semibold shadow-lg shadow-orange-500/20"
                                        : "text-white/55 hover:bg-orange-500/10 hover:text-orange-500"
                                        }`}
                                >
                                    {day}
                                </button>
                            );
                        })}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/[0.06]">
                        <button
                            type="button"
                            onClick={handleClear}
                            className="flex items-center gap-1.5 text-[11px] text-white/30 hover:text-white transition-colors"
                        >
                            <X size={13} />
                            Clear
                        </button>

                        <button
                            type="button"
                            onClick={handleToday}
                            className="text-[11px] text-orange-500 hover:text-orange-400 transition-colors"
                        >
                            Today
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DatePicker;