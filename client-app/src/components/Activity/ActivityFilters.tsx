import React, { useState } from 'react';
import { Filter, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import axios from 'axios';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

// Card Components
const Card: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
    {children}
  </div>
);

const CardContent: React.FC<CardContentProps> = ({ children, className = '' }) => (
  <div className={`p-4 ${className}`}>
    {children}
  </div>
);

interface ActivityFiltersProps {
    applyFilters: (date: string) => void;  // Only expect the date as argument
    clearFilters: () => void;
  }
const ActivityFilters: React.FC<ActivityFiltersProps> = ({ applyFilters, clearFilters }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activityType, setActivityType] = useState<string>('all'); // Added activity type state

  // Get first day of month and total days in month
  const getMonthDetails = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return {
      firstDay: firstDay.getDay(),
      totalDays: lastDay.getDate(),
      year: date.getFullYear(),
      month: date.getMonth(),
    };
  };

  // Format date to YYYY-MM-DD for comparison
  const formatDate = (date: Date) => {
    // Get the local date in the format YYYY-MM-DD without time zone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0'); // Ensure day is 2 digits
  
    return `${year}-${month}-${day}`;
  };
  
  
  

  // Generate calendar data
  const generateCalendarDays = () => {
    const { firstDay, totalDays, year, month } = getMonthDetails(currentDate);
    const days = [];

    // Calculate previous month's days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    const prevMonthDays = firstDay === 0 ? 6 : firstDay - 1; // Adjust for Monday start

    for (let i = prevMonthDays - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);
      days.push({
        date,
        day: prevMonthLastDay - i,
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let i = 1; i <= totalDays; i++) {
      const date = new Date(year, month, i);
      days.push({
        date,
        day: i,
        isCurrentMonth: true,
      });
    }

    // Next month days to complete the grid
    const remainingDays = 42 - days.length; // 6 rows × 7 days = 42
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      days.push({
        date,
        day: i,
        isCurrentMonth: false,
      });
    }

    return days;
  };

  const weekDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  // Navigation handlers
  const navigateMonth = (direction: any) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
  };

  const navigateYear = (direction: any) => {
    setCurrentDate(new Date(currentDate.getFullYear() + direction, currentDate.getMonth(), 1));
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  // Month/Year formatter
  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Check if a date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return formatDate(date) === formatDate(today);
  };

  // Check if a date is selected
  const isSelected = (date: Date) => {
    return formatDate(date) === formatDate(selectedDate);
  };

  // Handle Apply Filter Button
  const handleApplyFilter = () => {
    const formattedDate = formatDate(selectedDate);
    // Update the API URL to use `Date` as a query parameter
    applyFilters(formattedDate);
  };
  
  
  

  // Handle Clear Filter Button
  const handleClearFilter = () => {
    setActivityType('all');
    setSelectedDate(new Date());
    clearFilters();
  };

  return (
    <div className="fixed top-28 right-32 w-80 space-y-4">
      {/* Filters Card */}
      <Card>
        <CardContent>
          <div className="flex items-center gap-2 text-teal-500 mb-4">
            <Filter size={20} />
            <span className="font-semibold">Filters</span>
          </div>

          <div className="space-y-2">
            <div
              onClick={() => setActivityType('all')}
              className={`p-2 cursor-pointer rounded transition-colors ${activityType === 'all' ? 'bg-teal-100' : ''}`}
            >
              All Activities
            </div>
            <div
              onClick={() => setActivityType("going")}
              className={`p-2 cursor-pointer rounded transition-colors ${activityType === 'going' ? 'bg-teal-100' : ''}`}
            >
              I'm going
            </div>
            <div
              onClick={() => setActivityType("hosting")}
              className={`p-2 cursor-pointer rounded transition-colors ${activityType === 'hosting' ? 'bg-teal-100' : ''}`}
            >
              I'm hosting
            </div>
          </div>

          <div className="flex justify-between mt-4">
            <button
              onClick={handleClearFilter}
              className="bg-gray-500 text-white px-6 py-1.5 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleApplyFilter}
              className="bg-teal-500 text-white px-6 py-1.5 rounded hover:bg-teal-600"
            >
              Apply Filter
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Calendar Card */}
      <Card>
        <CardContent>
          <div className="text-center">
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => navigateYear(-1)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <ChevronsLeft size={20} />
              </button>
              <button
                onClick={() => navigateMonth(-1)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="font-semibold">{formatMonthYear(currentDate)}</span>
              <button
                onClick={() => navigateMonth(1)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <ChevronRight size={20} />
              </button>
              <button
                onClick={() => navigateYear(1)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <ChevronsRight size={20} />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {/* Weekday headers */}
              {weekDays.map((day) => (
                <div key={day} className="text-xs font-medium p-1">
                  {day}
                </div>
              ))}

              {/* Calendar days */}
              {generateCalendarDays().map(({ date, day, isCurrentMonth }, index) => {
                const isWeekend = date.getDay() === 0 || date.getDay() === 6;

                return (
                  <div
                    key={date.toISOString()}
                    onClick={() => handleDateSelect(date)}
                    className={`
                      p-1 text-sm cursor-pointer transition-colors
                      hover:bg-gray-100
                      ${isSelected(date) ? 'bg-yellow-200 hover:bg-yellow-300' : ''}
                      ${!isCurrentMonth ? 'text-gray-400' : ''}
                      ${isWeekend && isCurrentMonth ? 'text-red-500' : ''}
                      ${isToday(date) ? 'border border-blue-500 rounded-full' : ''}
                    `}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityFilters;
