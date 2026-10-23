import styled from '@emotion/styled'
import PropTypes from 'prop-types'
import IconButton from '@mui/material/IconButton'
import viewIcon from '../../assets/icons/view-icon 1.svg'
import editIcon from '../../assets/icons/edit-icon 1.svg'

const ACTIONS = [
  { key: 'view', icon: viewIcon, label: 'View' },
  { key: 'edit', icon: editIcon, label: 'Edit' },
]

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  height: 100%;
`

// Renders only the actions whose handler is passed; `rowLabel` names the row for screen readers.
const RowActions = ({ row, rowLabel, onView, onEdit }) => {
  const handlers = { view: onView, edit: onEdit }

  return (
    <Wrapper>
      {ACTIONS.filter(({ key }) => handlers[key]).map(({ key, icon, label }) => (
        <IconButton
          key={key}
          size="small"
          aria-label={`${label} ${rowLabel}`}
          onClick={() => handlers[key](row)}
        >
          <img src={icon} alt="" width={18} height={18} />
        </IconButton>
      ))}
    </Wrapper>
  )
}

RowActions.propTypes = {
  row: PropTypes.object.isRequired,
  rowLabel: PropTypes.string,
  onView: PropTypes.func,
  onEdit: PropTypes.func,
}

export default RowActions
