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
import UserFormModal from '../../components/Dashboard/UserFormModal'
import DeleteUserModal from '../../components/Dashboard/DeleteUserModal'
import { getDashboardColumns } from '../../services/dashboardColumns'
import useUserTable from '../../hooks/useUserTable'
import { theme, mq } from '../../styles/theme'
import { pageBackground } from '../../styles/backgroundStyles'

const Wrapper = styled.div`
  padding: ${theme.spacing.lg} ${theme.spacing.md};
  background: ${theme.colors.pageBg};
  ${pageBackground}

  ${mq('tablet')} {
    padding: ${theme.spacing.xl} ${theme.spacing.lg};
  }

  ${mq('laptop')} {
    padding: ${theme.spacing.xl} ${theme.spacing.lg};
  }
`

const TopBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.lg};
`

const Title = styled.h1`
  font-size: 22px;
  color: ${theme.colors.text};
  margin: 0;

  ${mq('tablet')} {
    font-size: 28px;
  }
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
  footer: PaginationFooter,
}

const gridSx = {
  border: `1px solid ${theme.colors.border}`,
  borderRadius: '8px',
  overflow: 'hidden',
  minWidth: 760,
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
    deleteUser,
  } = useUserTable()

  const [modalMode, setModalMode] = useState(null) // 'create' | 'edit' | 'view' | null
  const [selectedUser, setSelectedUser] = useState(null)
  const [isSubmittingUser, setIsSubmittingUser] = useState(false)
  const [userFormError, setUserFormError] = useState('')

  const [deleteTarget, setDeleteTarget] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

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
        await updateUser(selectedUser.id, formValues)
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

  const handleRequestDelete = (row) => {
    setDeleteError('')
    setDeleteTarget(row)
  }

  const handleCloseDelete = () => {
    if (isDeleting) return
    setDeleteTarget(null)
  }

  const handleConfirmDelete = async () => {
    setIsDeleting(true)
    setDeleteError('')
    try {
      await deleteUser(deleteTarget.id)
      setDeleteTarget(null)
    } catch {
      setDeleteError('Unable to delete user. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  const columns = getDashboardColumns({
    onView: handleViewUser,
    onEdit: handleEditUser,
    onDelete: handleRequestDelete,
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

        <SummaryCards summary={summary} />

        <TableCard>
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

          {error && <ErrorBanner>{error}</ErrorBanner>}

          {isLoading ? (
            <LoaderWrapper>
              <Loader />
            </LoaderWrapper>
          ) : (
            <DataGrid
              rows={rows}
              columns={columns}
              getRowId={(row) => row.id}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              pageSizeOptions={[10, 25, 50]}
              disableRowSelectionOnClick
              rowHeight={56}
              autoHeight
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

      {deleteTarget && (
        <DeleteUserModal
          user={deleteTarget}
          onClose={handleCloseDelete}
          onConfirm={handleConfirmDelete}
          isSubmitting={isDeleting}
          error={deleteError}
        />
      )}
    </MainLayout>
  )
}

export default Dashboard
