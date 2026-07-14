import Chip from '@mui/material/Chip'
import PropTypes from 'prop-types'

const STATUS_STYLES = {
  Active: { color: '#1E9E5A', backgroundColor: '#E4F8ED' },
  Inactive: { color: '#E0454B', backgroundColor: '#FCE9EA' },
}

const StatusChip = ({ status }) => {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.Inactive

  return (
    <Chip
      label={status}
      size="small"
      sx={{
        fontWeight: 600,
        fontSize: 12,
        color: style.color,
        backgroundColor: style.backgroundColor,
        borderRadius: '6px',
        width: 80,
        justifyContent: 'center',
      }}
    />
  )
}

StatusChip.propTypes = {
  status: PropTypes.string.isRequired,
}

export default StatusChip
