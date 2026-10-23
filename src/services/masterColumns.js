import { createElement } from 'react'
import StatusChip from '../components/Dashboard/StatusChip'
import RowActions from '../components/Dashboard/RowActions'

// Rows arrive pre-sorted (newest first) and numbered, so sorting is off to keep Sr. No. in order.
export const getMasterColumns = ({ onEdit }) => [
  {
    field: 'srNo',
    headerName: 'Sr. No.',
    flex: 1,
    minWidth: 80,
    sortable: false,
  },
  {
    field: 'typeLabel',
    headerName: 'Category Type',
    flex: 1,
    minWidth: 150,
    sortable: false,
  },
  {
    field: 'name',
    headerName: 'Category Name',
    flex: 1,
    minWidth: 180,
    sortable: false,
  },
  {
    field: 'status',
    headerName: 'Status',
    flex: 0.75,
    minWidth: 100,
    sortable: false,
    renderCell: (params) => createElement(StatusChip, { status: params.value }),
  },
  {
    field: 'action',
    headerName: 'Action',
    flex: 0.5,
    minWidth: 90,
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params) =>
      createElement(RowActions, { row: params.row, rowLabel: params.row.name, onEdit }),
  },
]
