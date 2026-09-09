"use client";

import { useEffect, useMemo, useRef, useState } from "react";

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  minDate?: Date;
  placeholder?: string;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const toLocalDateString = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const parseISODate = (value: string) => {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
};

const isSameDay = (left: Date, right: Date) => {
  return left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth() && left.getDate() === right.getDate();
};

const formatDisplayDate = (value: string) => {
  const date = parseISODate(value);
  if (!date) return "Select date";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

export default function DatePicker({ value, onChange, minDate = new Date(), placeholder = "Select date" }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [monthCursor, setMonthCursor] = useState(() => {
    const selected = parseISODate(value) ?? new Date();
    return new Date(selected.getFullYear(), selected.getMonth(), 1);
  });
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    if (!value) return;
    const selected = parseISODate(value);
    if (selected) {
      setMonthCursor(new Date(selected.getFullYear(), selected.getMonth(), 1));
    }
  }, [value]);

  const calendarDays = useMemo(() => {
    const firstDay = new Date(monthCursor.getFullYear(), monthCursor.getMonth(), 1);
    const startOfWeek = new Date(firstDay);
    startOfWeek.setDate(firstDay.getDate() - firstDay.getDay());

    const days: Date[] = [];
    for (let index = 0; index < 42; index += 1) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + index);
      days.push(day);
    }

    return days;
  }, [monthCursor]);

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lowerBound = new Date(minDate);
    lowerBound.setHours(0, 0, 0, 0);
    return date < lowerBound || date < today;
  };

  const selectDate = (date: Date) => {
    if (isDateDisabled(date)) return;
    onChange(toLocalDateString(date));
    setIsOpen(false);
  };

  return (
    <div className="date-picker-container" ref={containerRef}>
      <button
        type="button"
        className="date-picker-trigger"
        onClick={() => setIsOpen((current) => !current)}
        aria-label={value ? `Selected date: ${formatDisplayDate(value)}` : placeholder}
      >
        <span>{formatDisplayDate(value)}</span>
        <span className="date-picker-icon">📅</span>
      </button>

      {isOpen && (
        <div className="date-picker-popup" role="dialog" aria-modal="false">
          <div className="date-picker-header">
            <button type="button" className="date-picker-nav" onClick={() => setMonthCursor(new Date(monthCursor.getFullYear(), monthCursor.getMonth() - 1, 1))} aria-label="Previous month">
              ‹
            </button>
            <div className="date-picker-month-label">
              {new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(monthCursor)}
            </div>
            <button type="button" className="date-picker-nav" onClick={() => setMonthCursor(new Date(monthCursor.getFullYear(), monthCursor.getMonth() + 1, 1))} aria-label="Next month">
              ›
            </button>
          </div>

          <div className="date-picker-weekdays">
            {WEEKDAYS.map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>

          <div className="date-picker-grid">
            {calendarDays.map((date) => {
              const isCurrentMonth = date.getMonth() === monthCursor.getMonth();
              const isDisabled = isDateDisabled(date);
              const isToday = isSameDay(date, new Date());
              const isSelected = value ? isSameDay(date, parseISODate(value) as Date) : false;

              return (
                <button
                  key={date.toISOString()}
                  type="button"
                  className={[
                    "date-picker-day",
                    isCurrentMonth ? "in-month" : "out-of-month",
                    isToday ? "today" : "",
                    isSelected ? "selected" : "",
                    isDisabled ? "disabled" : "",
                  ].join(" ")}
                  disabled={isDisabled}
                  onClick={() => selectDate(date)}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
