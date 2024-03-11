import React from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './datepicker.css';

interface DateTimePickerProps {
  value: string;
  onChange: (value: string) => void;
  ariaLabel?: string;
  excludeTimes?: Date[];
  filterTime?: (date: Date) => boolean;
}

// Note: We keep ISO string in state to match backend expected format
const DateTimePicker: React.FC<DateTimePickerProps> = ({
  value,
  onChange,
  ariaLabel,
  excludeTimes,
  filterTime,
}) => {
  const selected = value ? new Date(value) : null;

  return (
    <div className='relative'>
      <ReactDatePicker
        selected={selected}
        onChange={(date: Date | null, event: any) => {
          const className = event?.target?.className || '';
          const isTodayBtn =
            typeof className === 'string' &&
            className.includes('react-datepicker__today-button');
          if (isTodayBtn) {
            // Don't auto-select a time when clicking Today; force the user to choose a time
            onChange('');
            return;
          }
          onChange(date ? date.toISOString() : '');
        }}
        showTimeSelect
        timeIntervals={15}
        timeCaption='Time'
        timeFormat='hh:mm aa'
        timeClassName={() => 'clinic-time-item'}
        dateFormat='Pp'
        placeholderText='dd/mm/yyyy, --:-- --'
        className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 pr-10'
        ariaLabel={ariaLabel}
        minDate={new Date()}
        excludeTimes={excludeTimes}
        filterTime={filterTime}
        popperClassName='z-50 clinic-datepicker-popper'
        calendarClassName='clinic-datepicker'
        shouldCloseOnSelect={false}
        withPortal={false}
        popperPlacement='bottom-start'
        inline={false}
        todayButton='Today'
        isClearable
        showPopperArrow
        showIcon
        toggleCalendarOnIconClick
      />
    </div>
  );
};

export default DateTimePicker;
