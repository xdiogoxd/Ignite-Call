import { Calendar } from '@/components/Calendar';
import {
  Container,
  TimePicker,
  TimePickerHeader,
  TimePickerItem,
  TimePickerList,
} from './styles';
import { useState } from 'react';
import dayJs from 'dayjs';

interface Availability {
  possibleHours: number[];
  availableHours: number[];
}

interface CalendarStepProps {
  onSelectDateTime: (date: Date) => void;
}

export default function CalendarStep({ onSelectDateTime }: CalendarStepProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availability, setAvailability] = useState<Availability | null>(null);

  function resetEnableHours() {
    setAvailability({
      possibleHours: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
      availableHours: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    });
  }

  function disableHours() {
    setAvailability({
      possibleHours: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
      availableHours: [8, 10, 12, 14, 16, 20],
    });
  }

  const isDateSelected = !!selectedDate;

  const weekDay = selectedDate ? dayJs(selectedDate).format('dddd') : null;
  const describedDate = selectedDate
    ? dayJs(selectedDate).format('DD[ de ]MMMM')
    : null;

  function handledSelectTime(hour: number) {
    const dateWithTime = dayJs(selectedDate)
      .set('hour', hour)
      .startOf('hour')
      .toDate();

    onSelectDateTime(dateWithTime);
  }

  return (
    <Container isTimePickerOpen={isDateSelected}>
      <Calendar
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        blockedDates={[]}
      />
      {isDateSelected && (
        <TimePicker>
          <TimePickerHeader>
            {weekDay} <span>{describedDate}</span>
          </TimePickerHeader>
          <TimePickerList>
            <TimePickerItem onClick={resetEnableHours}>
              Resetar horários disponíveis
            </TimePickerItem>
            <TimePickerItem onClick={disableHours}>
              Desabilitar horários disponíveis
            </TimePickerItem>

            {availability?.possibleHours.map((hour) => {
              return (
                <TimePickerItem
                  disabled={!availability.availableHours.includes(hour)}
                  onClick={() => handledSelectTime(hour)}
                >
                  {String(hour).padStart(2, '0')}:00h
                </TimePickerItem>
              );
            })}
          </TimePickerList>
        </TimePicker>
      )}
    </Container>
  );
}
