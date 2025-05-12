import {
  Button,
  Heading,
  MultiStep,
  Text,
  TextArea,
  TextInput,
} from '@ignite-ui/react';
import { Container, Form, FormError, Header } from '../styles';
import { ArrowRight } from 'phosphor-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { FormAnnotation, ProfileBox } from './styles';

const updateProfileFormSchema = z.object({
  bio: z.string(),
});

type updateProfileFormData = z.infer<typeof updateProfileFormSchema>;

export default function updateProfile() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<updateProfileFormData>({
    resolver: zodResolver(updateProfileFormSchema),
  });

  async function handleUpdateProfile(data: updateProfileFormData) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  return (
    <Container>
      <Header>
        <Heading as='strong'>Crie uma conta</Heading>
        <Text>
          Precisamos de algumas informações para criar seu perfil! Ah, você pode
          editar essas informações depois
        </Text>

        <MultiStep size={4} currentStep={4} />
      </Header>
      <ProfileBox as='form' onSubmit={handleSubmit(handleUpdateProfile)}>
        <label>
          <Text size='sm'>Foto de perfil</Text>
        </label>
        <label>
          <Text size='sm'>Sobre você</Text>
          <TextArea
            placeholder='Digite seu nome completo'
            {...register('bio')}
          />
          <FormAnnotation size='sm'>
            Fale um pouco sobre você. Isto será exibido em sua página pessoal.
          </FormAnnotation>
        </label>
        <Button type='submit' disabled={isSubmitting}>
          Finalizar
          <ArrowRight />
        </Button>
      </ProfileBox>
    </Container>
  );
}
