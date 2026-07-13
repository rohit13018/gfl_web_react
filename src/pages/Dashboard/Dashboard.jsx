import styled from '@emotion/styled'
import useAuth from '../../hooks/useAuth'
import MainLayout from '../../layouts/MainLayout/MainLayout'
import { theme, mq } from '../../styles/theme'

const Wrapper = styled.div`
  padding: ${theme.spacing.lg} ${theme.spacing.md};

  ${mq('tablet')} {
    padding: ${theme.spacing.xl} ${theme.spacing.lg};
  }

  ${mq('laptop')} {
    padding: ${theme.spacing.xl};
  }
`

const Title = styled.h1`
  font-size: 22px;
  color: ${theme.colors.text};
  margin: 0;

  ${mq('tablet')} {
    font-size: 28px;
  }
`

const Dashboard = () => {
  const { user } = useAuth()

  return (
    <MainLayout>
      <Wrapper>
        <Title>Welcome {user?.name}</Title>
      </Wrapper>
    </MainLayout>
  )
}

export default Dashboard
