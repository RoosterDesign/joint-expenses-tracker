import { useState, useEffect, useRef } from "react";

interface Props {
    onValueChange: (value: string) => void;
    defaultDate: string;
    sidebar?: boolean
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

        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysArray = [];

        for (let i = 0; i < firstDayOfMonth; i++) {
            daysArray.push(<div key={`empty-${i}`}></div>);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const day = new Date(year, month, i);
            const dayString = day.toLocaleDateString("en-GB");
            let className = "flex items-center justify-center cursor-pointer w-[46px] h-[46px] rounded-full text-dark-3 hover:bg-primary hover:text-white";

            if (selectedDate && dayString === selectedDate) {
                className += " bg-primary text-white";
            }

            daysArray.push(
                <div
                    key={i}
                    className={className}
                    data-date={dayString}
                    onClick={() => handleDayClick(dayString)}
                >
                    {i}
                </div>,
            );

        }

        return daysArray;
    };
    renderCalendar();

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


    const calendarIcon = <svg className="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 20"><path d="M18 3.313h-1.688v-.688a.727.727 0 0 0-.718-.719.707.707 0 0 0-.719.719v.656H6.094v-.656a.727.727 0 0 0-.719-.719.707.707 0 0 0-.719.719v.656H3A1.98 1.98 0 0 0 1.031 5.25v10.875A1.98 1.98 0 0 0 3 18.094h15a1.98 1.98 0 0 0 1.969-1.969V5.25c0-1.063-.907-1.938-1.969-1.938ZM3 4.718h1.688v.625c0 .375.312.718.718.718a.707.707 0 0 0 .719-.718v-.625h8.844v.625c0 .375.312.718.719.718a.707.707 0 0 0 .718-.718v-.625H18a.56.56 0 0 1 .563.562v2.063H2.468V5.28c0-.343.219-.562.531-.562Zm15 11.937H3a.56.56 0 0 1-.563-.562V8.719h16.094v7.406c.032.313-.218.531-.531.531Z" fill="currentColor" /><path d="M9.5 9.594h-.688c-.187 0-.312.125-.312.312v.688c0 .187.125.312.313.312H9.5c.188 0 .313-.125.313-.312v-.688a.313.313 0 0 0-.313-.312ZM12.344 9.594h-.688c-.187 0-.312.125-.312.312v.688c0 .187.125.312.312.312h.688c.187 0 .312-.125.312-.312v-.688c0-.187-.125-.312-.312-.312ZM15.188 9.594H14.5c-.188 0-.313.125-.313.312v.688c0 .187.126.312.313.312h.688c.187 0 .312-.125.312-.312v-.688c0-.187-.125-.312-.313-.312ZM6.5 12h-.688c-.187 0-.312.125-.312.313V13c0 .188.125.313.313.313H6.5c.188 0 .313-.126.313-.313v-.688A.313.313 0 0 0 6.5 12ZM9.5 12h-.688c-.187 0-.312.125-.312.313V13c0 .188.125.313.313.313H9.5c.188 0 .313-.126.313-.313v-.688A.313.313 0 0 0 9.5 12ZM12.344 12h-.688c-.187 0-.312.125-.312.313V13c0 .188.125.313.312.313h.688c.187 0 .312-.126.312-.313v-.688c0-.187-.125-.312-.312-.312ZM15.188 12H14.5c-.188 0-.313.125-.313.313V13c0 .188.126.313.313.313h.688c.187 0 .312-.126.312-.313v-.688c0-.187-.125-.312-.313-.312ZM6.5 14.406h-.688c-.187 0-.312.125-.312.313v.687c0 .188.125.313.313.313H6.5c.188 0 .313-.125.313-.313v-.687a.313.313 0 0 0-.313-.313ZM9.5 14.406h-.688c-.187 0-.312.125-.312.313v.687c0 .188.125.313.313.313H9.5c.188 0 .313-.125.313-.313v-.687a.313.313 0 0 0-.313-.313ZM12.344 14.406h-.688c-.187 0-.312.125-.312.313v.687c0 .188.125.313.312.313h.688c.187 0 .312-.125.312-.313v-.687c0-.188-.125-.313-.312-.313Z" fill="currentColor" /></svg>;

    const days = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

    const calenderContent = (
        <div
            ref={datepickerContainerRef}
            id="datepicker-container"
            className={`flex flex-col rounded-xl bg-white p-4 shadow-four sm:p-[30px] absolute z-10 w-80 sm:w-96 ${sidebar ? 'lg:end-0 3xl:end-auto' : ''}`}>
            <div className="flex items-center justify-between pb-4">
                <button
                    id="prevMonth"
                    type="button"
                    className="flex h-[38px] w-[38px] cursor-pointer items-center justify-center rounded-[7px] border-[.5px] border-stroke bg-gray-2 text-dark hover:border-primary hover:bg-primary hover:text-white sm:h-[46px] sm:w-[46px] "
                    onClick={handlePrevMonth}
                >
                    <svg fill="none" width="24" height="24" className="fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M16.238 21.488c-.226 0-.45-.075-.6-.263L7.161 12.6a.838.838 0 0 1 0-1.2l8.476-8.625a.838.838 0 0 1 1.2 0 .838.838 0 0 1 0 1.2L8.961 12l7.913 8.025a.838.838 0 0 1 0 1.2c-.225.15-.413.262-.637.262Z" /></svg>
                </button>

                <span id="currentMonth" className="text-lg font-bold capitalize text-dark" >
                    {currentDate.toLocaleDateString("en-GB", { month: "long", year: "numeric", })}
                </span>

                <button
                    id="nextMonth"
                    type="button"
                    className="flex h-[38px] w-[38px] cursor-pointer items-center justify-center rounded-[7px] border-[.5px] border-stroke bg-gray-2 text-dark hover:border-primary hover:bg-primary hover:text-white sm:h-[46px] sm:w-[46px] "
                    onClick={handleNextMonth}
                >
                    <svg width="24" height="24" fill="none" className="fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M7.763 21.488a.92.92 0 0 1-.6-.226.838.838 0 0 1 0-1.2L15.037 12 7.162 3.975a.838.838 0 0 1 0-1.2.838.838 0 0 1 1.2 0l8.475 8.625a.838.838 0 0 1 0 1.2l-8.474 8.625a.885.885 0 0 1-.6.262Z" /></svg>
                </button>
            </div>
            <div className="grid grid-cols-7 justify-between text-center pb-2 pt-4 text-sm font-medium capitalize text-body-color sm:text-lg ">
                {days.map((day, i) => <span key={i} className="flex h-[38px] w-[38px] items-center justify-center sm:h-[46px] sm:w-[47px]">{day}</span>)}
            </div>

            <div id="days-container" className="grid grid-cols-7 text-center text-sm font-medium sm:text-lg">
                {renderCalendar()}
            </div>
        </div>
    )

    return (
        <div className="h-full">
            <div className="relative h-full">
                <input
                    id="datepicker"
                    type="text"
                    placeholder="Pick a date"
                    className={`h-full w-full appearance-none rounded-lg border border-stroke bg-white pl-11 pr-4 text-dark outline-none focus:border-primary ${!sidebar ? "lg:text-center lg:text-sm xl:text-base lg:pl-2 lg:pr-2 xl:pl-11 xl:pr-4 xl:text-left" : ""}`}
                    value={selectedDate || ""}
                    readOnly
                    onClick={handleToggleCalendar}
                />
                <span
                    id="toggleDatepicker"
                    onClick={handleToggleCalendar}
                    className={`absolute start-3 flex items-center justify-center text-dark-5 pointer-events-none h-[22px] w-[22px] top-[13px] ${!sidebar ? "lg:hidden xl:block" : ""}`}>
                    {calendarIcon}
                </span>
            </div>

            {isCalendarOpen && calenderContent}
        </div>
    );
}

export default Datepicker;
