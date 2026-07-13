import styled from '@emotion/styled'
import useAuth from '../../../hooks/useAuth'
import Button from '../Button/Button'
import logo from '../../../assets/logos/inoxgfl.png'
import { theme, mq } from '../../../styles/theme'

const Bar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background: ${theme.colors.surface};
  border-bottom: 1px solid ${theme.colors.border};
  flex-wrap: wrap;

  ${mq('tablet')} {
    padding: ${theme.spacing.md} ${theme.spacing.lg};
  }

  ${mq('laptop')} {
    padding: ${theme.spacing.md} ${theme.spacing.xl};
  }
`

const Logo = styled.img`
  height: 32px;
  width: auto;
  display: block;

  ${mq('tablet')} {
    height: 36px;
  }
`

const UserArea = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`

const Greeting = styled.span`
  font-size: 14px;
  color: ${theme.colors.textMuted};
  white-space: nowrap;

  ${mq('tablet')} {
    font-size: 15px;
  }
`

const Header = () => {
  const { user, logout } = useAuth()

  return (
    <Bar>
      <Logo src={logo} alt="Company logo" />
      <UserArea>
        <Greeting>Hello, {user?.name}</Greeting>
        <Button variant="secondary" onClick={logout}>
          Logout
        </Button>
      </UserArea>
    </Bar>
  )
}

export default Header
