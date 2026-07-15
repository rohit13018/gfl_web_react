import styled from '@emotion/styled'
import PropTypes from 'prop-types'
import IconButton from '@mui/material/IconButton'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { theme } from '../../../styles/theme'

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: ${theme.spacing.md};
  padding-top: 8vh;
  z-index: 1300;
`

const Dialog = styled.div`
  width: 100%;
  max-width: ${(props) => props.maxWidth};
  height: ${(props) => props.height || 'auto'};
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  background: ${theme.colors.surface};
  border-radius: ${theme.radii.lg};
  box-shadow: ${theme.shadow};
  overflow: hidden;
`

const HeaderBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  background: ${theme.colors.tableHeader};
  color: #fff;
`

const HeaderTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
`

const Body = styled.div`
  flex: 1 1 auto;
  padding: ${theme.spacing.lg};
  overflow-y: auto;
`

const Modal = ({ open, onClose, title, children, maxWidth = '640px', height }) => {
  if (!open) return null

  return (
    <Overlay onMouseDown={onClose}>
      <Dialog maxWidth={maxWidth} height={height} onMouseDown={(event) => event.stopPropagation()}>
        <HeaderBar>
          <HeaderTitle>{title}</HeaderTitle>
          <IconButton onClick={onClose} size="small" aria-label="Close" sx={{ color: '#fff' }}>
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        </HeaderBar>
        <Body>{children}</Body>
      </Dialog>
    </Overlay>
  )
}

Modal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.node,
  children: PropTypes.node,
  maxWidth: PropTypes.string,
  height: PropTypes.string,
}

export default Modal
