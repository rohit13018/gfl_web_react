import { useState } from 'react'
import PropTypes from 'prop-types'
import Modal from '../common/Modal/Modal'
import Validator from '../common/Validator/Validator'
import useValidate from '../../hooks/useValidate'
import { MASTER_TYPES, formatMasterType } from '../../services/masterService'
import { Form, Grid, ErrorBanner, Actions, CancelButton, SubmitButton } from './formModalStyles'

const TYPE_OPTIONS = MASTER_TYPES.map((type) => ({ value: type, label: formatMasterType(type) }))

const STATUS_OPTIONS = [
  { value: 'Active', label: 'Active' },
  { value: 'Inactive', label: 'Inactive' },
]

const FIELD_NAMES = ['type', 'name']

const INITIAL_FORM = {
  type: '',
  name: '',
  status: 'Active',
}

const MODE_CONFIG = {
  create: { title: 'Add New Master', submitLabel: 'Save' },
  edit: { title: 'Update Master', submitLabel: 'Update' },
}

// Stored types are mixed case, while the select options use the API's lowercase enum.
const buildFormValues = (master) => {
  if (!master) return INITIAL_FORM

  return {
    type: master.type?.toLowerCase() ?? '',
    name: master.name ?? '',
    status: master.status ?? 'Active',
  }
}

// Older records can carry a type outside the enum (e.g. "Division"); add it so the select can show it.
const getTypeOptions = (type) =>
  !type || TYPE_OPTIONS.some((option) => option.value === type)
    ? TYPE_OPTIONS
    : [...TYPE_OPTIONS, { value: type, label: formatMasterType(type) }]

// Mounted only while open, so state starts fresh each time without a reset effect.
const MasterFormModal = ({ mode, master, onClose, onSubmit, isSubmitting, error }) => {
  const [formValues, setFormValues] = useState(() => buildFormValues(master))
  const [initialFormValues] = useState(() => buildFormValues(master))
  const { register, validateAll } = useValidate()
  const isEdit = mode === 'edit'
  const { title, submitLabel } = MODE_CONFIG[mode]
  const isUnchanged =
    isEdit &&
    formValues.name.trim() === initialFormValues.name.trim() &&
    formValues.status === initialFormValues.status

  const handleChange = (field) => (event) => {
    setFormValues((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (isUnchanged) return
    if (!validateAll(FIELD_NAMES)) return

    const payload = { name: formValues.name.trim(), isActive: formValues.status === 'Active' }
    // The type is locked while editing, and the PUT body (per swagger) doesn't take one.
    onSubmit(isEdit ? payload : { type: formValues.type, ...payload })
  }

  return (
    <Modal open onClose={onClose} title={title}>
      <Form onSubmit={handleSubmit} noValidate>
        {error && <ErrorBanner>{error}</ErrorBanner>}

        <Grid>
          <Validator
            ref={register('type')}
            select
            label="Category Type"
            name="type"
            placeholder="Select"
            required
            disabled={isEdit}
            options={getTypeOptions(formValues.type)}
            value={formValues.type}
            onChange={handleChange('type')}
          />
          <Validator
            ref={register('name')}
            type="text"
            label="Category Name"
            placeholder="Enter name"
            name="name"
            required
            value={formValues.name}
            onChange={handleChange('name')}
          />
          <Validator
            select
            label="Status"
            name="status"
            options={STATUS_OPTIONS}
            value={formValues.status}
            onChange={handleChange('status')}
          />
        </Grid>

        <Actions>
          <CancelButton type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </CancelButton>
          <SubmitButton
            type="submit"
            variant="gradient"
            isLoading={isSubmitting}
            disabled={isUnchanged}
          >
            {submitLabel}
          </SubmitButton>
        </Actions>
      </Form>
    </Modal>
  )
}

MasterFormModal.propTypes = {
  mode: PropTypes.oneOf(['create', 'edit']).isRequired,
  master: PropTypes.shape({
    type: PropTypes.string,
    name: PropTypes.string,
    status: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
  error: PropTypes.string,
}

export default MasterFormModal
