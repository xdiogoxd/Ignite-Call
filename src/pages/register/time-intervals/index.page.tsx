import { Container, FormError, Header } from '../styles';
import {
  Heading,
  MultiStep,
  TextInput,
  Text,
  Checkbox,
  Button,
} from '@ignite-ui/react';
import {
  IntervalBox,
  IntervalsContainer,
  IntervalItem,
  IntervalDay,
  IntervalInputs,
} from './styles';

import { ArrowRight } from 'phosphor-react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { getWeekDays } from '@/utils/get-week-days';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { convertTimeStringToMinutes } from '@/utils/convert-time-string-to-minutes';

const timeIntervalsFormSchema = z.object({
  intervals: z
    .array(
      z.object({
        weekDay: z.number().min(0).max(6),
        enabled: z.boolean(),
        startTime: z.string(),
        endTime: z.string(),
      })
    )
    .length(7)
    .transform((intervals) => {
      return intervals.filter((interval) => interval.enabled);
    })
    .refine((intervals) => intervals.length > 0, {
      message: 'Você precisa selecionar pelo menos um dia da semana',
    })
    .transform((intervals) => {
      return intervals.map((interval) => {
        return {
          ...interval,
          startTimeInMinutes: convertTimeStringToMinutes(interval.startTime),
          endTimeInMinutes: convertTimeStringToMinutes(interval.endTime),
        };
      });
    })
    .refine(
      (intervals) => {
        return intervals.every((interval) => {
          return interval.endTimeInMinutes > interval.startTimeInMinutes;
        });
      },
      {
        message: 'O horário de término deve ser maior que o horário de início',
      }
    ),
});

type TimeIntervalsFormDataInput = z.input<typeof timeIntervalsFormSchema>;
type TimeIntervalsFormDataOutput = z.output<typeof timeIntervalsFormSchema>;

export default function TimeIntervals() {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(timeIntervalsFormSchema),
    defaultValues: {
      intervals: [
        { weekDay: 0, enabled: false, startTime: '08:00', endTime: '18:00' },
        { weekDay: 1, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 2, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 3, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 4, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 5, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 6, enabled: false, startTime: '08:00', endTime: '18:00' },
      ],
    },
  });

  const { fields } = useFieldArray({
    control,
    name: 'intervals',
  });

  const intervals = watch('intervals');

  async function handleSetTimeIntervals(data: TimeIntervalsFormDataOutput) {
    console.log(data);
  }

  return (
    <Container>
      <Header>
        <Heading as='strong'>Quase lá</Heading>
        <Text>Defina o intervalo de horários que você trabalha.</Text>

        <MultiStep size={4} currentStep={3} />
      </Header>
      <IntervalBox as='form' onSubmit={handleSubmit(handleSetTimeIntervals)}>
        {fields.map((field, index) => {
          return (
            <IntervalItem key={field.id}>
              <IntervalDay>
                <Controller
                  name={`intervals.${index}.enabled`}
                  control={control}
                  render={({ field }) => {
                    return (
                      <Checkbox
                        onCheckedChange={(checked) => {
                          field.onChange(checked === true);
                        }}
                        checked={field.value}
                      />
                    );
                  }}
                />
                <Text>{getWeekDays()[field.weekDay]}</Text>
              </IntervalDay>
              <IntervalInputs>
                <TextInput
                  size='sm'
                  type='time'
                  step={60}
                  {...register(`intervals.${index}.startTime`)}
                  disabled={!intervals[index].enabled}
                />
                <TextInput
                  size='sm'
                  type='time'
                  step={60}
                  {...register(`intervals.${index}.endTime`)}
                  disabled={!intervals[index].enabled}
                />
              </IntervalInputs>
            </IntervalItem>
          );
        })}
        {errors.intervals && (
          <FormError size='sm'>{errors.intervals.root?.message}</FormError>
        )}
        <Button type='submit' disabled={isSubmitting}>
          Proximo passo
          <ArrowRight />
        </Button>
      </IntervalBox>
    </Container>
  );
}
