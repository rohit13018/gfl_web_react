import styled from '@emotion/styled'
import { theme } from '../../styles/theme'

const Overlay = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.textMuted};
  font-size: 14px;
`

const NoRowsOverlay = () => <Overlay>No rows found</Overlay>

export default NoRowsOverlay
