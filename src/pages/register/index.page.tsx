import { Button, Heading, MultiStep, Text, TextInput } from '@ignite-ui/react';
import { Container, Form, FormError, Header } from './styles';
import { ArrowRight } from 'phosphor-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { api } from '@/lib/axios';
import { AxiosError } from 'axios';

const registerFormSchema = z.object({
  username: z
    .string()
    .regex(/^([a-z\\-]+)$/i, {
      message: 'O usuário só pode ter apenas letras e hifens.',
    })
    .min(3, { message: 'O usuário precisa ter pelo menos 3 letras.' })
    .transform((username) => username.toLowerCase()),

  name: z.string().min(3, { message: 'O nome precisa no mínimo 3 caracteres' }),
});

type RegisterFormData = z.infer<typeof registerFormSchema>;

export default function Register() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
  });

  const router = useRouter();

  useEffect(() => {
    if (router.query.username) {
      setValue('username', String(router.query.username));
    }
  }, [router.query?.username, setValue]);

  async function handleRegister(data: RegisterFormData) {
    try {
      await api.post('/users', {
        name: data.name,
        username: data.username,
      });
    } catch (err) {
      if (err instanceof AxiosError && err?.response?.data?.message) {
        alert(err.response.data.message);
        return;
      }
    }

    await router.push('/register/connect-calendar');
  }
  return (
    <Container>
      <Header>
        <Heading as='strong'>Crie uma conta</Heading>
        <Text>
          Precisamos de algumas informações para criar seu perfil! Ah, você pode
          editar essas informações depois
        </Text>

        <MultiStep size={4} currentStep={1} />
      </Header>
      <Form as='form' onSubmit={handleSubmit(handleRegister)}>
        <label>
          <Text size='sm'>Nome de usuário</Text>
          <TextInput
            placeholder='Digite seu usuário'
            prefix='ignite.com/'
            {...register('username')}
          />
          {errors.username && (
            <FormError size='sm'>{errors.username.message}</FormError>
          )}
        </label>
        <label>
          <Text size='sm'>Nome completo</Text>
          <TextInput
            placeholder='Digite seu nome completo'
            {...register('name')}
          />
          {errors.name && (
            <FormError size='sm'>{errors.name.message}</FormError>
          )}
        </label>
        <Button type='submit' disabled={isSubmitting}>
          Próximo passo
          <ArrowRight />
        </Button>
      </Form>
    </Container>
  );
}
