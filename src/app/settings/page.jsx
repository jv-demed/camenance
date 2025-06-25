'use client'
import { logout } from '@/services/authService';
import { ICONS } from '@/assets/icons';
import { Main } from '@/components/containers/Main';
import { Form } from '@/components/containers/Form';
import { DefaultBtn } from '@/components/buttons/DefaultBtn';
import { Container } from '@/components/containers/Container';

export default function Settings() {
    return (
        <Main>
            <Container>
                <Form onSubmit={logout}>
                    <DefaultBtn text='Sair'
                        icon={ICONS.logout}
                        type='submit'
                        width='150px'
                    />
                </Form>
            </Container>
        </Main>
    )
}