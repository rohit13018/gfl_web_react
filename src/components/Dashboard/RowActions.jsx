import styled from '@emotion/styled'
import PropTypes from 'prop-types'
import IconButton from '@mui/material/IconButton'
import viewIcon from '../../assets/icons/view-icon 1.svg'
import editIcon from '../../assets/icons/edit-icon 1.svg'
import deleteIcon from '../../assets/icons/delete-icon 1.svg'

const ACTIONS = [
  { key: 'view', icon: viewIcon, label: 'View user' },
  { key: 'edit', icon: editIcon, label: 'Edit user' },
  { key: 'delete', icon: deleteIcon, label: 'Delete user' },
]

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  height: 100%;
`

const RowActions = ({ row, onView, onEdit, onDelete }) => {
  const handlers = { view: onView, edit: onEdit, delete: onDelete }

  return (
    <Wrapper>
      {ACTIONS.map(({ key, icon, label }) => (
        <IconButton
          key={key}
          size="small"
          aria-label={`${label} ${row.email}`}
          onClick={() => handlers[key](row)}
        >
          <img src={icon} alt="" width={18} height={18} />
        </IconButton>
      ))}
    </Wrapper>
  )
}

RowActions.propTypes = {
  row: PropTypes.shape({ email: PropTypes.string }).isRequired,
  onView: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}

export default RowActions
