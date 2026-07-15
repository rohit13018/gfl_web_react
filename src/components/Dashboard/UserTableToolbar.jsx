import styled from '@emotion/styled'
import PropTypes from 'prop-types'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import InputAdornment from '@mui/material/InputAdornment'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import Button from '../common/Button/Button'
import { theme, mq } from '../../styles/theme'

const PAGE_SIZE_OPTIONS = [10, 25, 50]

const Bar = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
  margin-bottom: 10px;

  ${mq('laptop')} {
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

const FilterGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  align-items: center;
`

const selectSx = { minWidth: 120, backgroundColor: theme.colors.surface }
const searchSx = { minWidth: 220, backgroundColor: theme.colors.surface }

const ClearButton = styled(Button)`
  min-height: 40px;
  padding: 0 ${theme.spacing.md};
  white-space: nowrap;

  &:disabled {
    color: ${theme.colors.textMuted};
    border-color: ${theme.colors.border};
    background: ${theme.colors.surfaceMuted};
    opacity: 1;
  }
`

const FILTER_FIELDS = [
  { key: 'business', label: 'Business' },
  { key: 'company', label: 'Company' },
  { key: 'location', label: 'Location' },
  { key: 'plant', label: 'Plant' },
]

const UserTableToolbar = ({
  pageSize,
  onPageSizeChange,
  filters,
  filterOptions,
  onFilterChange,
  searchTerm,
  onSearchChange,
  onClearAll,
}) => {
  const hasActiveFilters = Boolean(searchTerm) || Object.values(filters).some(Boolean)

  return (
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

      <FilterGroup>
        {FILTER_FIELDS.map(({ key, label }) => (
          <TextField
            key={key}
            select
            size="small"
            label={label}
            value={filters[key]}
            onChange={(event) => onFilterChange(key, event.target.value)}
            sx={selectSx}
          >
            <MenuItem value="">All</MenuItem>
            {filterOptions[key].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        ))}

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

        <ClearButton
          type="button"
          variant="secondary"
          onClick={onClearAll}
          disabled={!hasActiveFilters}
        >
          Clear All
          <CloseRoundedIcon fontSize="small" />
        </ClearButton>
      </FilterGroup>
    </Bar>
  )
}

UserTableToolbar.propTypes = {
  pageSize: PropTypes.number.isRequired,
  onPageSizeChange: PropTypes.func.isRequired,
  filters: PropTypes.object.isRequired,
  filterOptions: PropTypes.object.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  searchTerm: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  onClearAll: PropTypes.func.isRequired,
}

export default UserTableToolbar
