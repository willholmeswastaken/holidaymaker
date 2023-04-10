import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type Props = {
    id?: string;
    selectedDate: Date | null;
    onDateSelected?: (date: Date) => void;
}

export const CustomDatePicker = ({ id, selectedDate, onDateSelected }: Props) => {
    const [internalSelectedDate, setInternalSelectedDate] = useState<Date | null>(selectedDate || null);

    const onDatePickerDateSelected = (date: Date) => {
        setInternalSelectedDate(date);
        onDateSelected && onDateSelected(date);
    };

    return (
        <div className="relative">
            <DatePicker
                id={id}
                selected={internalSelectedDate}
                onChange={onDatePickerDateSelected}
                dateFormat="dd/MM/yyyy"
                className="w-full text-gray-700 px-3 py-2 border border-slate-300 dark:border-slate-700 dark:text-slate-50 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900 bg-transparent  placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent focus:ring-offset-2 rounded-md"
            />
        </div>
    );
};




