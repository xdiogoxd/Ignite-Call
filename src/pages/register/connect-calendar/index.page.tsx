import { useRouter } from 'next/router';
import { Container, Header } from '../styles';
import { Heading, MultiStep, Button, Text } from '@ignite-ui/react';
import { ArrowRight } from 'phosphor-react';
import { AuthError, ConnectBox, ConnectItem } from './styles';

import { signIn, useSession } from 'next-auth/react';

export default function ConnectCalendar() {
  const session = useSession();
  const router = useRouter();

  const hasAuthError = !!router.query.error;
  const isAuthenticated = session.status === 'authenticated';

  async function handleConnectCalendar() {
    await signIn('google');
  }

  return (
    <Container>
      <Header>
        <Heading as='strong'>Crie uma conta</Heading>
        <Text>
          Conecte sua agenda do Google e permita que a nossa aplicação acesse as
          horas ocupadas e os novos eventos à medida em que são agendados.
        </Text>

        <MultiStep size={4} currentStep={2} />
      </Header>
      <ConnectBox>
        <ConnectItem>
          <Text>Google Calendar</Text>
          <Button
            size='sm'
            variant='secondary'
            onClick={handleConnectCalendar}
            disabled={isAuthenticated}
          >
            Conectar
            <ArrowRight />
          </Button>
        </ConnectItem>

        {hasAuthError && (
          <AuthError size='sm'>
            Falha ao se conectar com o Google, verifique se você habilitou as
            permissões de acesso ao Google Calendar.
          </AuthError>
        )}

        <Button type='submit' disabled={!isAuthenticated}>
          Próximo passo
          <ArrowRight />
        </Button>
      </ConnectBox>
    </Container>
  );
}
