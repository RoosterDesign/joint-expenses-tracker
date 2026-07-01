import { useState, useEffect, useRef } from "react";

interface Props {
    onValueChange: (value: string) => void;
    defaultDate: string;
    sidebar?: boolean;
}

const Datepicker: React.FC<Props> = ({ onValueChange, defaultDate, sidebar }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const datepickerContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setSelectedDate(defaultDate);
    }, [defaultDate]);

    const renderCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDayOfMonth = (new Date(year, month, 1).getDay() + 6) % 7;
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysArray = [];

        for (let i = 0; i < firstDayOfMonth; i++) {
            daysArray.push(<div key={`empty-${i}`}></div>);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const day = new Date(year, month, i);
            const dayString = day.toLocaleDateString("en-GB");
            const isSelected = selectedDate && dayString === selectedDate;
            daysArray.push(
                <div
                    key={i}
                    className={`flex items-center justify-center cursor-pointer w-[38px] h-[38px] rounded-full text-sm font-medium transition
                        ${isSelected ? 'bg-[#34d399] text-[#06110c] font-bold' : 'text-[#c3ccc7] hover:bg-[#34d399]/20 hover:text-[#34d399]'}`}
                    data-date={dayString}
                    onClick={() => handleDayClick(dayString)}
                >
                    {i}
                </div>,
            );
        }

        return daysArray;
    };

    const handleDayClick = (selectedDay: string) => {
        setSelectedDate(selectedDay);
        onValueChange(selectedDay);
        setIsCalendarOpen(false);
    };

    const handlePrevMonth = () => {
        setCurrentDate((prevDate) => {
            const newDate = new Date(prevDate);
            newDate.setMonth(prevDate.getMonth() - 1);
            return newDate;
        });
    };

    const handleNextMonth = () => {
        setCurrentDate((prevDate) => {
            const newDate = new Date(prevDate);
            newDate.setMonth(prevDate.getMonth() + 1);
            return newDate;
        });
    };

    const handleToggleCalendar = () => {
        setIsCalendarOpen(!isCalendarOpen);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (
            datepickerContainerRef.current &&
            !datepickerContainerRef.current.contains(event.target as Node) &&
            (event.target as HTMLElement).id !== "datepicker" &&
            (event.target as HTMLElement).id !== "toggleDatepicker"
        ) {
            setIsCalendarOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    const calendarIcon = (
        <svg className="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 20">
            <path d="M18 3.313h-1.688v-.688a.727.727 0 0 0-.718-.719.707.707 0 0 0-.719.719v.656H6.094v-.656a.727.727 0 0 0-.719-.719.707.707 0 0 0-.719.719v.656H3A1.98 1.98 0 0 0 1.031 5.25v10.875A1.98 1.98 0 0 0 3 18.094h15a1.98 1.98 0 0 0 1.969-1.969V5.25c0-1.063-.907-1.938-1.969-1.938ZM3 4.718h1.688v.625c0 .375.312.718.718.718a.707.707 0 0 0 .719-.718v-.625h8.844v.625c0 .375.312.718.719.718a.707.707 0 0 0 .718-.718v-.625H18a.56.56 0 0 1 .563.562v2.063H2.468V5.28c0-.343.219-.562.531-.562Zm15 11.937H3a.56.56 0 0 1-.563-.562V8.719h16.094v7.406c.032.313-.218.531-.531.531Z" fill="currentColor" />
        </svg>
    );

    const days = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

    const calendarContent = (
        <div
            ref={datepickerContainerRef}
            id="datepicker-container"
            className={`absolute z-20 w-72 rounded-[18px] border border-white/[0.09] bg-[#141b18] p-4 ${sidebar ? 'lg:end-0 3xl:end-auto' : ''}`}
            style={{ boxShadow: '0 18px 40px rgba(0,0,0,0.45)' }}
        >
            <div className="flex items-center justify-between pb-3">
                <button
                    id="prevMonth"
                    type="button"
                    className="flex h-[34px] w-[34px] items-center justify-center rounded-[9px] border border-white/[0.09] bg-[#0e1512] text-[#8a978f] hover:text-[#34d399] transition"
                    onClick={handlePrevMonth}
                >
                    <svg fill="none" width="16" height="16" className="fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M16.238 21.488c-.226 0-.45-.075-.6-.263L7.161 12.6a.838.838 0 0 1 0-1.2l8.476-8.625a.838.838 0 0 1 1.2 0 .838.838 0 0 1 0 1.2L8.961 12l7.913 8.025a.838.838 0 0 1 0 1.2c-.225.15-.413.262-.637.262Z" />
                    </svg>
                </button>
                <span id="currentMonth" className="text-[14px] font-semibold text-[#eef2f0] capitalize">
                    {currentDate.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
                </span>
                <button
                    id="nextMonth"
                    type="button"
                    className="flex h-[34px] w-[34px] items-center justify-center rounded-[9px] border border-white/[0.09] bg-[#0e1512] text-[#8a978f] hover:text-[#34d399] transition"
                    onClick={handleNextMonth}
                >
                    <svg width="16" height="16" fill="none" className="fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M7.763 21.488a.92.92 0 0 1-.6-.226.838.838 0 0 1 0-1.2L15.037 12 7.162 3.975a.838.838 0 0 1 0-1.2.838.838 0 0 1 1.2 0l8.475 8.625a.838.838 0 0 1 0 1.2l-8.474 8.625a.885.885 0 0 1-.6.262Z" />
                    </svg>
                </button>
            </div>

            <div className="grid grid-cols-7 text-center pb-1">
                {days.map((day, i) => (
                    <span key={i} className="flex h-[38px] w-[38px] items-center justify-center text-[11px] font-semibold text-[#7c887f]">{day}</span>
                ))}
            </div>

            <div id="days-container" className="grid grid-cols-7 text-center">
                {renderCalendar()}
            </div>
        </div>
    );

    return (
        <div className="h-full">
            <div className="relative h-full">
                <input
                    id="datepicker"
                    type="text"
                    placeholder="Pick a date"
                    className="h-full w-full appearance-none rounded-[13px] border border-white/[0.09] bg-[#0e1512] pl-10 pr-3 text-[14px] text-[#eef2f0] outline-none placeholder:text-[#7c887f] focus:border-[rgba(52,211,153,0.35)] transition"
                    value={selectedDate || ""}
                    readOnly
                    onClick={handleToggleCalendar}
                />
                <span
                    id="toggleDatepicker"
                    onClick={handleToggleCalendar}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-[#7c887f]"
                >
                    {calendarIcon}
                </span>
            </div>
            {isCalendarOpen && calendarContent}
        </div>
    );
}

export default Datepicker;
