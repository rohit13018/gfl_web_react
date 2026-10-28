import { useState } from 'react'
import styled from '@emotion/styled'
import PropTypes from 'prop-types'
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
import MasterTableToolbar from '../../components/Dashboard/MasterTableToolbar'
import MasterFormModal from '../../components/Dashboard/MasterFormModal'
import { getDashboardColumns } from '../../services/dashboardColumns'
import { getMasterColumns } from '../../services/masterColumns'
import useUserTable from '../../hooks/useUserTable'
import useMasterTable from '../../hooks/useMasterTable'
import { theme, mq } from '../../styles/theme'
import { pageBackground } from '../../styles/backgroundStyles'

/* Spacing: 12px top, 30px sides (laptop+), 24px below the grid. */
const Wrapper = styled.div`
  flex: 1;
  padding: 12px ${theme.spacing.md} ${theme.spacing.lg};
  background: ${theme.colors.pageBg};
  ${pageBackground}

  ${mq('tablet')} {
    padding: 12px ${theme.spacing.lg} ${theme.spacing.lg};
  }

  ${mq('laptop')} {
    padding: 12px 30px ${theme.spacing.lg};
  }
`

const TopBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${theme.spacing.sm};
  margin-bottom: 12px;
`

const Title = styled.h1`
  font-weight: 600;
  font-size: 22px;
  line-height: 100%;
  letter-spacing: 0;
  color: ${theme.colors.text};
  /* 12px wrapper padding + 4px = 16px from the header */
  margin: 4px 0 0;
`

const AddButton = styled(Button)`
  border-radius: ${theme.radii.md};
`

const TableCard = styled.div`
  overflow-x: auto;
`

const ErrorBanner = styled.div`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.radii.sm};
  background: ${theme.colors.dangerBg};
  color: ${theme.colors.danger};
  font-size: 14px;
  margin-bottom: ${theme.spacing.sm};
`

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: ${theme.spacing.lg} 0;
`

const masterErrorMessage = (err, mode) => {
  if (err?.status === 409) return 'A master with this category type and name already exists.'
  return mode === 'edit'
    ? 'Unable to update master. Please try again.'
    : 'Unable to create master. Please try again.'
}

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
  height: 'auto',
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

// Each grid sizes to its rows but never past the visible screen; beyond that its rows
// scroll inside it so the pagination footer stays in view. The offsets are the space
// above (header, title, cards, toolbar) and below (page padding) the grid.
const UserGridFrame = styled.div`
  display: flex;
  flex-direction: column;
  max-height: max(420px, calc(100svh - 300px));
`

const MasterGridFrame = styled.div`
  display: flex;
  flex-direction: column;
  max-height: max(320px, calc(100svh - 330px));

  ${mq('tablet')} {
    max-height: max(320px, calc(100svh - 200px));
  }
`

// Five columns fit in less width than the users grid before needing to scroll sideways.
const masterGridSx = { ...gridSx, minWidth: 600 }

// Serves both header nav routes, /dashboard (users) and /masters. Staying one
// component keeps each table's loaded data and paging when switching between them.
const Dashboard = ({ view = 'users' }) => {
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
  const masterTable = useMasterTable()

  const [modalMode, setModalMode] = useState(null) // 'create' | 'edit' | 'view' | null
  const [selectedUser, setSelectedUser] = useState(null)
  const [isSubmittingUser, setIsSubmittingUser] = useState(false)
  const [userFormError, setUserFormError] = useState('')

  const [masterModalMode, setMasterModalMode] = useState(null) // 'create' | 'edit' | null
  const [selectedMaster, setSelectedMaster] = useState(null)
  const [isSubmittingMaster, setIsSubmittingMaster] = useState(false)
  const [masterFormError, setMasterFormError] = useState('')

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

  const handleOpenAddMaster = () => {
    setMasterFormError('')
    setSelectedMaster(null)
    setMasterModalMode('create')
  }

  const handleEditMaster = (row) => {
    setMasterFormError('')
    setSelectedMaster(row)
    setMasterModalMode('edit')
  }

  const handleCloseMasterModal = () => {
    if (isSubmittingMaster) return
    setMasterModalMode(null)
    setSelectedMaster(null)
  }

  const handleSubmitMaster = async (formValues) => {
    setIsSubmittingMaster(true)
    setMasterFormError('')
    try {
      if (masterModalMode === 'edit') {
        await masterTable.updateMaster(selectedMaster._id, formValues)
      } else {
        await masterTable.addMaster(formValues)
      }
      setMasterModalMode(null)
      setSelectedMaster(null)
    } catch (err) {
      setMasterFormError(masterErrorMessage(err, masterModalMode))
    } finally {
      setIsSubmittingMaster(false)
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

  const masterColumns = getMasterColumns({ onEdit: handleEditMaster })

  return (
    <MainLayout>
      <Wrapper>
        <TopBar>
          <Title>Welcome back, {user?.name?.split(' ')[0] || 'Admin'}!</Title>
          {view === 'users' ? (
            <AddButton variant="gradient" onClick={handleOpenAddUser}>
              <AddRoundedIcon fontSize="small" /> Add New User
            </AddButton>
          ) : (
            <AddButton variant="gradient" onClick={handleOpenAddMaster}>
              <AddRoundedIcon fontSize="small" /> Add New Master
            </AddButton>
          )}
        </TopBar>

        {view === 'users' ? (
          <>
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
                <UserGridFrame>
                  <DataGrid
                    rows={rows}
                    columns={columns}
                    getRowId={(row) => row._id ?? row.id}
                    initialState={{ sorting: { sortModel: [{ field: 'status', sort: 'asc' }] } }}
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    pageSizeOptions={[10, 25, 50]}
                    disableRowSelectionOnClick
                    rowHeight={44}
                    columnHeaderHeight={44}
                    scrollbarSize={0}
                    slots={gridSlots}
                    slotProps={{
                      footer: { paginationModel, onPaginationModelChange: setPaginationModel, rowCount },
                    }}
                    sx={gridSx}
                  />
                </UserGridFrame>
              )}
            </TableCard>
          </>
        ) : (
          <>
            <MasterTableToolbar
              pageSize={masterTable.paginationModel.pageSize}
              onPageSizeChange={(pageSize) =>
                masterTable.setPaginationModel((prev) => ({ ...prev, pageSize, page: 0 }))
              }
              searchTerm={masterTable.searchTerm}
              onSearchChange={masterTable.onSearchChange}
            />

            <TableCard>
              {masterTable.error && <ErrorBanner>{masterTable.error}</ErrorBanner>}

              {masterTable.isLoading ? (
                <LoaderWrapper>
                  <Loader />
                </LoaderWrapper>
              ) : (
                <MasterGridFrame>
                  <DataGrid
                    rows={masterTable.rows}
                    columns={masterColumns}
                    getRowId={(row) => row._id}
                    paginationModel={masterTable.paginationModel}
                    onPaginationModelChange={masterTable.setPaginationModel}
                    pageSizeOptions={[10, 25, 50]}
                    disableRowSelectionOnClick
                    rowHeight={44}
                    columnHeaderHeight={44}
                    scrollbarSize={0}
                    slots={gridSlots}
                    slotProps={{
                      footer: {
                        paginationModel: masterTable.paginationModel,
                        onPaginationModelChange: masterTable.setPaginationModel,
                        rowCount: masterTable.rowCount,
                      },
                    }}
                    sx={masterGridSx}
                  />
                </MasterGridFrame>
              )}
            </TableCard>
          </>
        )}
      </Wrapper>

      {modalMode && (
        <UserFormModal
          mode={modalMode}
          user={selectedUser}
          onClose={handleCloseUserModal}
          onSubmit={handleSubmitUser}
          isSubmitting={isSubmittingUser}
          error={userFormError}
        />
      )}

      {masterModalMode && (
        <MasterFormModal
          mode={masterModalMode}
          master={selectedMaster}
          onClose={handleCloseMasterModal}
          onSubmit={handleSubmitMaster}
          isSubmitting={isSubmittingMaster}
          error={masterFormError}
        />
      )}
    </MainLayout>
  )
}

Dashboard.propTypes = {
  view: PropTypes.oneOf(['users', 'masters']),
}

export default Dashboard
