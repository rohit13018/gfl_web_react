import styled from '@emotion/styled'
import PropTypes from 'prop-types'
import Modal from '../common/Modal/Modal'
import Button from '../common/Button/Button'
import { theme } from '../../styles/theme'

const Message = styled.p`
  margin: 0 0 ${theme.spacing.lg};
  color: ${theme.colors.text};
  font-size: 15px;
  line-height: 1.5;
`

const ErrorBanner = styled.div`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.radii.sm};
  background: ${theme.colors.dangerBg};
  color: ${theme.colors.danger};
  font-size: 14px;
  margin-bottom: ${theme.spacing.md};
`

const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${theme.spacing.sm};
`

const DeleteUserModal = ({ user, onClose, onConfirm, isSubmitting, error }) => (
  <Modal open onClose={onClose} title="Delete User" maxWidth="440px">
    {error && <ErrorBanner>{error}</ErrorBanner>}

    <Message>
      Are you sure you want to delete user <strong>{user.email}</strong>? This action cannot be
      undone.
    </Message>

    <Actions>
      <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
        Cancel
      </Button>
      <Button type="button" variant="danger" onClick={onConfirm} isLoading={isSubmitting}>
        Delete User
      </Button>
    </Actions>
  </Modal>
)

DeleteUserModal.propTypes = {
  user: PropTypes.shape({ email: PropTypes.string }).isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
  error: PropTypes.string,
}

export default DeleteUserModal
