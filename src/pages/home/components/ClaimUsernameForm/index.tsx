import { Button, TextInput, Text } from '@ignite-ui/react';
import { Form } from './styles';
import { ArrowRight } from 'phosphor-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormAnnotation } from '../../styles';
import { useRouter } from 'next/router';

const claimUsernameFormSchema = z.object({
  username: z
    .string()
    .regex(/^([a-z\\-]+)$/i, {
      message: 'O usuário pode ter apenas letras e hifens.',
    })
    .min(3, { message: 'O usuário precisa ter pelo menos 3 letras.' })
    .transform((username) => username.toLowerCase()),
});

type ClaimUsernameFormData = z.infer<typeof claimUsernameFormSchema>;

export function ClaimUsernameForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClaimUsernameFormData>({
    resolver: zodResolver(claimUsernameFormSchema),
  });

  const router = useRouter();

  async function handlePreRegister(data: ClaimUsernameFormData) {
    const { username } = data;

    await router.push(`/register?username=${username}`);
  }
  return (
    <>
      <Form as='form' onSubmit={handleSubmit(handlePreRegister)}>
        <TextInput
          size='sm'
          prefix='ignite.com/'
          placeholder='seu-usuário'
          {...register('username')}
        />
        <Button size='sm' type='submit'>
          Reservar
          <ArrowRight />
        </Button>
      </Form>
      <FormAnnotation>
        <Text size='sm'>
          {errors.username
            ? errors.username.message
            : 'Digite o nome do usuário'}
        </Text>
      </FormAnnotation>
    </>
  );
}
