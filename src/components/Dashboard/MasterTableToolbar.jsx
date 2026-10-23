import styled from '@emotion/styled'
import PropTypes from 'prop-types'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import InputAdornment from '@mui/material/InputAdornment'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import { theme, mq } from '../../styles/theme'

const PAGE_SIZE_OPTIONS = [10, 25, 50]

const Bar = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
  margin-bottom: 10px;

  ${mq('tablet')} {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`

const ShowGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  font-size: 14px;
  color: ${theme.colors.textMuted};
`

const searchSx = { minWidth: 220, backgroundColor: theme.colors.surface }

const MasterTableToolbar = ({ pageSize, onPageSizeChange, searchTerm, onSearchChange }) => (
  <Bar>
    <ShowGroup>
      Show:
      <TextField
        select
        size="small"
        value={pageSize}
        onChange={(event) => onPageSizeChange(Number(event.target.value))}
        sx={{ minWidth: 72, backgroundColor: theme.colors.surface }}
      >
        {PAGE_SIZE_OPTIONS.map((size) => (
          <MenuItem key={size} value={size}>
            {size}
          </MenuItem>
        ))}
      </TextField>
    </ShowGroup>

    <TextField
      size="small"
      placeholder="Search..."
      value={searchTerm}
      onChange={(event) => onSearchChange(event.target.value)}
      sx={searchSx}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchRoundedIcon fontSize="small" sx={{ color: theme.colors.textMuted }} />
            </InputAdornment>
          ),
        },
      }}
    />
  </Bar>
)

MasterTableToolbar.propTypes = {
  pageSize: PropTypes.number.isRequired,
  onPageSizeChange: PropTypes.func.isRequired,
  searchTerm: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
}

export default MasterTableToolbar
