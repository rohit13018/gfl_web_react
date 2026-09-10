import styled from '@emotion/styled'
import IconButton from '@mui/material/IconButton'
import useAuth from '../../../hooks/useAuth'
import logo from '../../../assets/logos/inoxgfl.png'
import logoutIcon from '../../../assets/icons/logout.png'
import userIcon from '../../../assets/icons/user 1.svg'
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
    /* Matches dashboard content padding (95px). */
    padding: ${theme.spacing.md} 95px;
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
