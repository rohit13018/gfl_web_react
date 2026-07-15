import { createElement } from 'react'
import StatusChip from '../components/Dashboard/StatusChip'
import RowActions from '../components/Dashboard/RowActions'

const formatValueList = (value) => (Array.isArray(value) ? value.join(', ') : value)

export const getDashboardColumns = ({ onView, onEdit }) => [
  {
    field: 'email',
    headerName: 'User Email',
    flex: 1.4,
    minWidth: 200,
    sortable: true,
  },
  {
    field: 'business',
    headerName: 'Business',
    flex: 1,
    minWidth: 130,
    sortable: true,
    valueFormatter: formatValueList,
  },
  {
    field: 'company',
    headerName: 'Company',
    flex: 1.3,
    minWidth: 160,
    sortable: true,
    valueFormatter: formatValueList,
  },
  {
    field: 'location',
    headerName: 'Location',
    flex: 0.9,
    minWidth: 110,
    sortable: true,
    valueFormatter: formatValueList,
  },
  {
    field: 'plant',
    headerName: 'Plant',
    flex: 0.9,
    minWidth: 110,
    sortable: true,
    valueFormatter: formatValueList,
  },
  {
    field: 'persona',
    headerName: 'Persona',
    flex: 1.2,
    minWidth: 150,
    sortable: true,
    valueFormatter: formatValueList,
  },
  {
    field: 'status',
    headerName: 'Status',
    flex: 0.8,
    minWidth: 100,
    sortable: true,
    renderCell: (params) => createElement(StatusChip, { status: params.value }),
  },
  {
    field: 'action',
    headerName: 'Action',
    flex: 0.8,
    minWidth: 110,
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params) => createElement(RowActions, { row: params.row, onView, onEdit }),
  },
]
