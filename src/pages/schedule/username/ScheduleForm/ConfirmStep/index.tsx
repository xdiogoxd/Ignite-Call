import { CalendarBlank, Clock } from 'phosphor-react';
import { ConfirmForm, FormActions, FormError, FormHeader } from './styles';
import { Button, Text, TextArea, TextInput } from '@ignite-ui/react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';

const confirmSchema = z.object({
  name: z.string().min(3, { message: 'O nome precisa no mínimo 3 caracteres' }),
  email: z.string().email({ message: 'Digite um e-mail válido' }),
  observations: z.string().nullable(),
});

type ConfirmFormData = z.infer<typeof confirmSchema>;

interface ConfirmStepProps {
  schedulingDate: Date;
  onCancelConfirmation: () => void;
}

export default function ConfirmStep({
  schedulingDate,
  onCancelConfirmation,
}: ConfirmStepProps) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<ConfirmFormData>({
    resolver: zodResolver(confirmSchema),
  });

  function handleConfirmScheduling(data: ConfirmFormData) {
    console.log(data);
  }

  const describedDate = dayjs(schedulingDate).format('DD[ de ]MMMM[ de ]YYYY');
  const describedTime = dayjs(schedulingDate).format('HH:mm[h]');

  return (
    <ConfirmForm as='form' onSubmit={handleSubmit(handleConfirmScheduling)}>
      <FormHeader>
        <Text>
          <CalendarBlank /> {describedDate}
        </Text>
        <Text>
          <Clock /> {describedTime}
        </Text>
      </FormHeader>
      <label>
        <Text size='sm'>Nome completo</Text>
        <TextInput placeholder='Seu nome' {...register('name')} />
        <FormError size='sm'>{errors.name?.message}</FormError>
      </label>
      <label>
        <Text size='sm'>Endereço de e-mail</Text>
        <TextInput placeholder='johndoe@example.com' {...register('email')} />
        <FormError size='sm'>{errors.email?.message}</FormError>
      </label>
      <label>
        <Text size='sm'>Observações</Text>
        <TextArea
          placeholder='Inclua alguma observação'
          {...register('observations')}
        />
      </label>

      <FormActions>
        <Button type='button' variant='tertiary' onClick={onCancelConfirmation}>
          Cancelar
        </Button>
        <Button type='submit' disabled={isSubmitting}>
          Confirmar
        </Button>
      </FormActions>
    </ConfirmForm>
  );
}
