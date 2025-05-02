import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";
import { cn } from "@/lib/utils";

interface DateOnlyPickerProps {
  value: Date;
  onChange: (date: Date | null) => void;
  className?: string;
  disabled?: boolean;
  id?: string;
}

const DateOnlyPicker: React.FC<DateOnlyPickerProps> = ({
  value,
  onChange,
  className = "",
  disabled = false,
  id = "",
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const datePickerRef = useRef<DatePicker>(null);

  // Update the selected date when value changes (initial render or prop change)
  useEffect(() => {
    if (value && new Date(value).getTime() !== selectedDate?.getTime()) {
      setSelectedDate(new Date(value));
    }
  }, [value]); // Runs when 'value' prop changes

  // Handle date change
  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    onChange(date);  // Notify parent component of the change
  };

  // Open date picker when the calendar icon is clicked
  const handleDateIconClick = () => {
    datePickerRef.current?.setOpen(true);
  };

  // Handle input change (disable typing)
  const handleInputChange = (event?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => {
    event?.preventDefault(); // Prevent typing
  };

  return (
    <div className="relative flex items-center gap-2">
      <DatePicker
        id={id}
        selected={selectedDate}
        onChange={handleDateChange}
        dateFormat="dd/MM/yyyy"
        disabled={disabled}
        className={cn(
          "w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50",
          className
        )}
        ref={datePickerRef}
        onChangeRaw={handleInputChange} // Prevent manual input
        popperPlacement="bottom-start"  // Placement of the datepicker
      />
      {/* Calendar Icon */}
      <FaCalendarAlt
        className="text-black-400 hover:text-blue-500 cursor-pointer"
        onClick={handleDateIconClick}
      />
    </div>
  );
};

export { DateOnlyPicker };