import { Avatar, Heading, Text } from '@ignite-ui/react';
import { Container, UserHeader } from './styles';
import { GetStaticPaths, GetStaticProps } from 'next';
import ScheduleForm from './ScheduleForm';

interface ScheduleProps {
  user: {
    name: string;
    bio: string;
    avatarUrl: string;
  };
}

export default function Schedule({ user }: ScheduleProps) {
  return (
    <Container>
      <UserHeader>
        <Avatar src='https://github.com/xdiogoxd.png' alt='Diogo Saran' />
        <Heading>Diogo Saran</Heading>
        <Text>Software Engineer</Text>
      </UserHeader>
      <ScheduleForm />
    </Container>
  );
}
