import { CaretLeft, CaretRight } from 'phosphor-react';
import {
  CalendarContainer,
  CalendarHeader,
  CalendarTitle,
  CalendarActions,
  CalendarBody,
  CalendarDay,
} from './styles';
import { getWeekDays } from '@/utils/get-week-days';
import dayJs from 'dayjs';
import { useMemo, useState } from 'react';
import dayjs from 'dayjs';

interface CalendarWeek {
  week: number;
  days: Array<{
    date: dayjs.Dayjs;
    disabled: boolean;
  }>;
}

type CalendarWeeks = CalendarWeek[];

interface BlockedDatesProps {
  blockedDates: Date[];
}

interface CalendarProps extends BlockedDatesProps {
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
}

interface CalendarStepProps extends BlockedDatesProps {
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
}

export function Calendar({ selectedDate, onSelectDate }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(() => {
    return dayJs().set('date', 1);
  });

  function handlePreviousMonth() {
    const previousMonthDate = currentDate.subtract(1, 'month');
    setCurrentDate(previousMonthDate);
  }

  function handleNextMonth() {
    const nextMonthDate = currentDate.add(1, 'month');
    setCurrentDate(nextMonthDate);
  }

  const shortWeekDays = getWeekDays({ short: true });

  const currentMonth = currentDate.format('MMMM');
  const currentYear = currentDate.format('YYYY');

  const calendarDays = useMemo(() => {
    const daysInMonthArray = Array.from({
      length: currentDate.daysInMonth(),
    }).map((_, i) => {
      return currentDate.set('date', i + 1);
    });

    const firstWeekDay = daysInMonthArray[0].get('day');

    const previousMonthFillArray = Array.from({
      length: firstWeekDay,
    })
      .map((_, i) => {
        return currentDate.subtract(i + 1, 'day');
      })
      .reverse();

    const lastWeekDayOnTheMonth = currentDate
      .set('date', daysInMonthArray.length)
      .get('day');

    const nextMonthFillArray = Array.from({
      length: 7 - (lastWeekDayOnTheMonth + 1),
    }).map((_, i) => {
      return currentDate.add(i, 'day');
    });

    function isDayInTheePast(date: dayjs.Dayjs) {
      return date.endOf('day').isBefore(new Date());
    }

    return [
      ...previousMonthFillArray.map((date) => {
        return { date, disabled: isDayInTheePast(date) };
      }),
      ...daysInMonthArray.map((date) => {
        return { date, disabled: isDayInTheePast(date) };
      }),
      ...nextMonthFillArray.map((date) => {
        return { date, disabled: true };
      }),
    ];
  }, [currentDate]);

  const calendarWeeks = calendarDays.reduce<CalendarWeeks>(
    (weeks, _, i, originalArray) => {
      if (i % 7 === 0) {
        weeks.push({
          week: i / 7 + 1,
          days: originalArray.slice(i, i + 7),
        });
      }
      return weeks;
    },
    []
  );

  return (
    <CalendarContainer>
      <CalendarHeader>
        <CalendarTitle>
          {currentMonth} <span>{currentYear}</span>
        </CalendarTitle>
        <CalendarActions>
          <button onClick={handlePreviousMonth} title='Previous month'>
            <CaretLeft />
          </button>
          <button onClick={handleNextMonth} title='Next month'>
            <CaretRight />
          </button>
        </CalendarActions>
      </CalendarHeader>
      <CalendarBody>
        <thead>
          <tr>
            {shortWeekDays.map((weekDay) => {
              return <th key={weekDay}>{weekDay}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {calendarWeeks.map(({ week, days }) => {
            return (
              <tr key={week}>
                {days.map(({ date, disabled }) => {
                  return (
                    <td key={date.toString()}>
                      <CalendarDay
                        disabled={disabled}
                        onClick={() => onSelectDate(date.toDate())}
                      >
                        {date.get('date')}
                      </CalendarDay>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </CalendarBody>
    </CalendarContainer>
  );
}
