import { useState } from 'react'
import styled from '@emotion/styled'
import { DataGrid } from '@mui/x-data-grid'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import useAuth from '../../hooks/useAuth'
import MainLayout from '../../layouts/MainLayout/MainLayout'
import Button from '../../components/common/Button/Button'
import Loader from '../../components/common/Loader/Loader'
import SummaryCards from '../../components/Dashboard/SummaryCards'
import UserTableToolbar from '../../components/Dashboard/UserTableToolbar'
import PaginationFooter from '../../components/Dashboard/PaginationFooter'
import SortIcon from '../../components/Dashboard/SortIcon'
import NoRowsOverlay from '../../components/Dashboard/NoRowsOverlay'
import UserFormModal from '../../components/Dashboard/UserFormModal'
import { getDashboardColumns } from '../../services/dashboardColumns'
import useUserTable from '../../hooks/useUserTable'
import { theme, mq } from '../../styles/theme'
import { pageBackground } from '../../styles/backgroundStyles'

/* Spacing: 18px top, 95px sides (laptop+), 40px below the grid. */
const Wrapper = styled.div`
  flex: 1;
  padding: 18px ${theme.spacing.md} 40px;
  background: ${theme.colors.pageBg};
  ${pageBackground}

  ${mq('tablet')} {
    padding: 18px ${theme.spacing.lg} 40px;
  }

  ${mq('laptop')} {
    padding: 18px 95px 40px;
  }
`

const TopBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.md};
`

const Title = styled.h1`
  font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
  font-weight: 600;
  font-size: 22px;
  line-height: 100%;
  letter-spacing: 0;
  color: ${theme.colors.text};
  /* 18px wrapper padding + 6px = 24px from the header */
  margin: 6px 0 0;
`

const AddUserButton = styled(Button)`
  border-radius: ${theme.radii.md};
`

const TableCard = styled.div`
  overflow-x: auto;
`

const ErrorBanner = styled.div`
  padding: ${theme.spacing.md};
  border-radius: ${theme.radii.sm};
  background: ${theme.colors.dangerBg};
  color: ${theme.colors.danger};
  font-size: 14px;
  margin-bottom: ${theme.spacing.md};
`

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: ${theme.spacing.xl} 0;
`

const gridSlots = {
  columnSortedAscendingIcon: SortIcon,
  columnSortedDescendingIcon: SortIcon,
  columnUnsortedIcon: SortIcon,
  noRowsOverlay: NoRowsOverlay,
  noResultsOverlay: NoRowsOverlay,
  footer: PaginationFooter,
}

const gridSx = {
  border: `1px solid ${theme.colors.border}`,
  borderRadius: '8px',
  overflow: 'hidden',
  minWidth: 760,
  // Fixed viewport-based height so rows scroll inside the grid and the empty state keeps its footprint.
  height: 'max(420px, calc(100vh - 360px))',
  // Hide the grid's scrollbar; rows still scroll with wheel/trackpad.
  '& .MuiDataGrid-virtualScroller': {
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': { display: 'none' },
  },
  '& .MuiDataGrid-columnHeaders': {
    backgroundColor: theme.colors.tableHeader,
  },
  '& .MuiDataGrid-columnHeader': {
    backgroundColor: theme.colors.tableHeader,
  },
  '& .MuiDataGrid-columnHeaderTitle': {
    color: '#fff',
    fontWeight: 600,
  },
  '& .MuiDataGrid-iconButtonContainer': {
    visibility: 'visible',
    width: 'auto',
  },
  '& .MuiDataGrid-sortButton': {
    opacity: '1 !important',
    backgroundColor: 'transparent !important',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.15) !important',
    },
  },
  '& .MuiDataGrid-menuIcon, & .MuiDataGrid-menuIconButton': {
    display: 'none',
  },
  '& .MuiDataGrid-columnSeparator': {
    display: 'none',
  },
  '& .MuiDataGrid-cell': {
    borderColor: theme.colors.border,
  },
  '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': {
    outline: 'none',
  },
  '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within': {
    outline: 'none',
  },
}

const Dashboard = () => {
  const { user } = useAuth()
  const {
    rows,
    rowCount,
    isLoading,
    error,
    summary,
    searchTerm,
    onSearchChange,
    filters,
    filterOptions,
    setFilter,
    clearFilters,
    paginationModel,
    setPaginationModel,
    addUser,
    updateUser,
  } = useUserTable()

  const [modalMode, setModalMode] = useState(null) // 'create' | 'edit' | 'view' | null
  const [selectedUser, setSelectedUser] = useState(null)
  const [isSubmittingUser, setIsSubmittingUser] = useState(false)
  const [userFormError, setUserFormError] = useState('')

  const handleOpenAddUser = () => {
    setUserFormError('')
    setSelectedUser(null)
    setModalMode('create')
  }

  const handleViewUser = (row) => {
    setSelectedUser(row)
    setModalMode('view')
  }

  const handleEditUser = (row) => {
    setUserFormError('')
    setSelectedUser(row)
    setModalMode('edit')
  }

  const handleCloseUserModal = () => {
    if (isSubmittingUser) return
    setModalMode(null)
    setSelectedUser(null)
  }

  const handleSubmitUser = async (formValues) => {
    setIsSubmittingUser(true)
    setUserFormError('')
    try {
      if (modalMode === 'edit') {
        await updateUser(selectedUser._id, formValues)
      } else {
        await addUser(formValues)
      }
      setModalMode(null)
      setSelectedUser(null)
    } catch {
      setUserFormError(
        modalMode === 'edit' ? 'Unable to update user. Please try again.' : 'Unable to create user. Please try again.'
      )
    } finally {
      setIsSubmittingUser(false)
    }
  }

  const handleCardSelect = (key) => {
    const next = key === 'total' || filters.card === key ? '' : key
    setFilter('card', next)
  }

  const columns = getDashboardColumns({
    onView: handleViewUser,
    onEdit: handleEditUser,
  })

  return (
    <MainLayout>
      <Wrapper>
        <TopBar>
          <Title>Welcome back, {user?.name?.split(' ')[0] || 'Admin'}!</Title>
          <AddUserButton variant="gradient" onClick={handleOpenAddUser}>
            <AddRoundedIcon fontSize="small" /> Add New User
          </AddUserButton>
        </TopBar>

        <SummaryCards summary={summary} activeCard={filters.card} onCardSelect={handleCardSelect} />

        <UserTableToolbar
          pageSize={paginationModel.pageSize}
          onPageSizeChange={(pageSize) =>
            setPaginationModel((prev) => ({ ...prev, pageSize, page: 0 }))
          }
          filters={filters}
          filterOptions={filterOptions}
          onFilterChange={setFilter}
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          onClearAll={clearFilters}
        />

        <TableCard>
          {error && <ErrorBanner>{error}</ErrorBanner>}

          {isLoading ? (
            <LoaderWrapper>
              <Loader />
            </LoaderWrapper>
          ) : (
            <DataGrid
              rows={rows}
              columns={columns}
              getRowId={(row) => row._id ?? row.id}
              initialState={{ sorting: { sortModel: [{ field: 'status', sort: 'asc' }] } }}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              pageSizeOptions={[10, 25, 50]}
              disableRowSelectionOnClick
              rowHeight={56}
              scrollbarSize={0}
              slots={gridSlots}
              slotProps={{
                footer: { paginationModel, onPaginationModelChange: setPaginationModel, rowCount },
              }}
              sx={gridSx}
            />
          )}
        </TableCard>
      </Wrapper>

      {modalMode && (
        <UserFormModal
          mode={modalMode}
          user={selectedUser}
          onClose={handleCloseUserModal}
          onSubmit={handleSubmitUser}
          filterOptions={filterOptions}
          isSubmitting={isSubmittingUser}
          error={userFormError}
        />
      )}
    </MainLayout>
  )
}

export default Dashboard
