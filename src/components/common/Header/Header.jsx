import styled from '@emotion/styled'
import { NavLink } from 'react-router-dom'
import IconButton from '@mui/material/IconButton'
import useAuth from '../../../hooks/useAuth'
import logo from '../../../assets/logos/inoxgfl.png'
import logoutIcon from '../../../assets/icons/logout.png'
import userIcon from '../../../assets/icons/user 1.svg'
import { ROUTES } from '../../../utils/constants'
import { theme, mq } from '../../../styles/theme'

const NAV_ITEMS = [
  { to: ROUTES.DASHBOARD, label: 'Users' },
  { to: ROUTES.MASTERS, label: 'Masters' },
]

/* Mobile: logo + user on one row, nav below. Tablet+: logo | centered nav | user. */
const Bar = styled.header`
  display: grid;
  grid-template-columns: auto auto;
  grid-template-areas:
    'logo user'
    'nav nav';
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background: ${theme.colors.surface};
  border-bottom: 1px solid ${theme.colors.border};

  ${mq('tablet')} {
    grid-template-columns: 1fr auto 1fr;
    grid-template-areas: 'logo nav user';
    padding: ${theme.spacing.md} ${theme.spacing.lg};
  }

  ${mq('laptop')} {
    /* Matches dashboard content padding (95px). */
    padding: ${theme.spacing.md} 95px;
  }
`

const Logo = styled.img`
  grid-area: logo;
  height: 32px;
  width: auto;
  display: block;

  ${mq('tablet')} {
    height: 36px;
  }
`

const Nav = styled.nav`
  grid-area: nav;
  display: flex;
  justify-content: center;
  gap: 48px;
`

const NavItem = styled(NavLink)`
  padding: 6px 0;
  border-bottom: 2px solid transparent;
  font-size: 15px;
  font-weight: 500;
  color: ${theme.colors.text};
  text-decoration: none;
  transition: color ${theme.transitionFast};

  &:hover {
    color: ${theme.colors.tableHeader};
  }

  &.active {
    color: ${theme.colors.tableHeader};
    border-bottom-color: ${theme.colors.tableHeader};
  }
`

const UserArea = styled.div`
  grid-area: user;
  justify-self: end;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`

const NameBlock = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.2;
`

const UserName = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${theme.colors.text};

  ${mq('tablet')} {
    font-size: 15px;
  }
`

const UserSubtext = styled.span`
  font-size: 12px;
  color: ${theme.colors.textMuted};
`

const AvatarBadge = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${theme.colors.surfaceMuted};
  flex-shrink: 0;
`

const Header = () => {
  const { user, logout } = useAuth()

  return (
    <Bar>
      <Logo src={logo} alt="Company logo" />
      <Nav aria-label="Main">
        {NAV_ITEMS.map(({ to, label }) => (
          <NavItem key={to} to={to}>
            {label}
          </NavItem>
        ))}
      </Nav>
      <UserArea>
        <AvatarBadge>
          <img src={userIcon} alt="" width={18} height={18} />
        </AvatarBadge>
        <NameBlock>
          <UserName>{user?.name || 'Admin'}</UserName>
          {user?.email && <UserSubtext>{user.email}</UserSubtext>}
        </NameBlock>
        <IconButton aria-label="Log out" size="small" onClick={logout}>
          <img src={logoutIcon} alt="" width={20} height={20} />
        </IconButton>
      </UserArea>
    </Bar>
  )
}

export default Header
