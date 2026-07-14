import styled from '@emotion/styled'
import PropTypes from 'prop-types'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import { theme } from '../../styles/theme'

const PAGE_SIZE_OPTIONS = [10, 25, 50]

const Bar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: ${theme.spacing.sm};
  min-height: 56px;
  padding: ${theme.spacing.md};
  border-top: 1px solid ${theme.colors.border};
  background: ${theme.colors.surface};
  font-size: 14px;
  color: ${theme.colors.textMuted};
`

const RowsPerPage = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
`

const RangeGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
`

const PaginationFooter = ({ paginationModel, onPaginationModelChange, rowCount }) => {
  const { page, pageSize } = paginationModel
  const pageCount = Math.max(1, Math.ceil(rowCount / pageSize))
  const rangeStart = rowCount === 0 ? 0 : page * pageSize + 1
  const rangeEnd = Math.min(rowCount, (page + 1) * pageSize)

  return (
    <Bar>
      <RowsPerPage>
        Rows per page:
        <TextField
          select
          size="small"
          variant="standard"
          value={pageSize}
          onChange={(event) =>
            onPaginationModelChange({ page: 0, pageSize: Number(event.target.value) })
          }
          slotProps={{
            input: { disableUnderline: true },
          }}
        >
          {PAGE_SIZE_OPTIONS.map((size) => (
            <MenuItem key={size} value={size}>
              {size}
            </MenuItem>
          ))}
        </TextField>
      </RowsPerPage>

      <RangeGroup>
        {rangeStart}–{rangeEnd} of {rowCount}
        <IconButton
          size="small"
          disabled={page <= 0}
          onClick={() => onPaginationModelChange({ ...paginationModel, page: page - 1 })}
          aria-label="Previous page"
        >
          <ChevronLeftRoundedIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          disabled={page >= pageCount - 1}
          onClick={() => onPaginationModelChange({ ...paginationModel, page: page + 1 })}
          aria-label="Next page"
        >
          <ChevronRightRoundedIcon fontSize="small" />
        </IconButton>
      </RangeGroup>
    </Bar>
  )
}

PaginationFooter.propTypes = {
  paginationModel: PropTypes.shape({
    page: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
  }).isRequired,
  onPaginationModelChange: PropTypes.func.isRequired,
  rowCount: PropTypes.number.isRequired,
}

export default PaginationFooter
