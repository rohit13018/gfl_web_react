import { useState } from 'react'
import PropTypes from 'prop-types'
import Modal from '../common/Modal/Modal'
import Validator from '../common/Validator/Validator'
import useValidate from '../../hooks/useValidate'
import useMasterOptions from '../../hooks/useMasterOptions'
import { Form, Grid, ErrorBanner, Actions, CancelButton, SubmitButton } from './formModalStyles'

const STATUS_OPTIONS = [
  { value: 'Active', label: 'Active' },
  { value: 'Inactive', label: 'Inactive' },
]

const FIELD_NAMES = ['email', 'business', 'company', 'location', 'plant', 'persona']

const MULTI_FIELDS = ['business', 'company', 'location', 'plant', 'persona']

const INITIAL_FORM = {
  email: '',
  business: [],
  company: [],
  location: [],
  plant: [],
  persona: [],
  status: 'Active',
}

const MODE_CONFIG = {
  create: { title: 'Add New User', submitLabel: 'Create User' },
  edit: { title: 'Update User', submitLabel: 'Update User' },
  view: { title: 'View User', submitLabel: null },
}

const toOptions = (values = []) => values.map((value) => ({ value, label: value }))

// Older records may hold a plain string where a multi-select array is expected.
const toValueList = (value) => (Array.isArray(value) ? value : value ? [value] : [])

const serializeForm = (values) =>
  JSON.stringify({
    ...values,
    ...Object.fromEntries(
      MULTI_FIELDS.map((field) => [
        field,
        values[field].map((option) => option.value).sort(),
      ])
    ),
  })

const buildFormValues = (user) => {
  if (!user) return INITIAL_FORM

  return {
    email: user.email ?? '',
    business: toOptions(toValueList(user.business)),
    company: toOptions(toValueList(user.company)),
    location: toOptions(toValueList(user.location)),
    plant: toOptions(toValueList(user.plant)),
    persona: toOptions(toValueList(user.persona)),
    status: user.status ?? 'Active',
  }
}

// Mounted only while open, so state starts fresh each time without a reset effect.
const UserFormModal = ({ mode, user, onClose, onSubmit, isSubmitting, error }) => {
  const [formValues, setFormValues] = useState(() => buildFormValues(user))
  const [initialFormValues] = useState(() => buildFormValues(user))
  const { register, validateAll } = useValidate()
  const masterOptions = useMasterOptions()
  const isReadOnly = mode === 'view'
  const { title, submitLabel } = MODE_CONFIG[mode]
  const isUnchanged =
    mode === 'edit' && serializeForm(formValues) === serializeForm(initialFormValues)

  const handleChange = (field) => (event) => {
    setFormValues((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const handleMultiChange = (field) => (nextValue) => {
    setFormValues((prev) => ({ ...prev, [field]: nextValue }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (isReadOnly || isUnchanged) return
    if (!validateAll(FIELD_NAMES)) return
    onSubmit({
      ...formValues,
      ...Object.fromEntries(
        MULTI_FIELDS.map((field) => [
          field,
          formValues[field].map((option) => option.value),
        ])
      ),
    })
  }

  return (
    <Modal open onClose={onClose} title={title}>
      <Form onSubmit={handleSubmit} noValidate>
        {error && <ErrorBanner>{error}</ErrorBanner>}

        <Grid>
          <Validator
            ref={register('email')}
            type="email"
            label="User Email"
            placeholder="john.doe@gfl.co.in"
            name="email"
            required
            readOnly={isReadOnly}
            value={formValues.email}
            onChange={handleChange('email')}
          />
          <Validator
            ref={register('business')}
            autocomplete
            label="Business"
            name="business"
            readOnly={isReadOnly}
            options={toOptions(masterOptions.business)}
            value={formValues.business}
            onChange={handleMultiChange('business')}
          />
          <Validator
            ref={register('company')}
            autocomplete
            label="Company"
            name="company"
            readOnly={isReadOnly}
            options={toOptions(masterOptions.company)}
            value={formValues.company}
            onChange={handleMultiChange('company')}
          />
          <Validator
            ref={register('location')}
            autocomplete
            label="Location"
            name="location"
            readOnly={isReadOnly}
            options={toOptions(masterOptions.location)}
            value={formValues.location}
            onChange={handleMultiChange('location')}
          />
          <Validator
            ref={register('plant')}
            autocomplete
            label="Plant"
            name="plant"
            readOnly={isReadOnly}
            options={toOptions(masterOptions.plant)}
            value={formValues.plant}
            onChange={handleMultiChange('plant')}
          />
          <Validator
            ref={register('persona')}
            autocomplete
            label="Persona"
            name="persona"
            readOnly={isReadOnly}
            options={toOptions(masterOptions.persona)}
            value={formValues.persona}
            onChange={handleMultiChange('persona')}
          />
          <Validator
            select
            label="Status"
            name="status"
            readOnly={isReadOnly}
            options={STATUS_OPTIONS}
            value={formValues.status}
            onChange={handleChange('status')}
          />
        </Grid>

        <Actions singleAction={isReadOnly}>
          <CancelButton type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
            {isReadOnly ? 'Close' : 'Cancel'}
          </CancelButton>
          {!isReadOnly && (
            <SubmitButton
              type="submit"
              variant="gradient"
              isLoading={isSubmitting}
              disabled={isUnchanged}
            >
              {submitLabel}
            </SubmitButton>
          )}
        </Actions>
      </Form>
    </Modal>
  )
}

const stringOrList = PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)])

UserFormModal.propTypes = {
  mode: PropTypes.oneOf(['create', 'edit', 'view']).isRequired,
  user: PropTypes.shape({
    email: PropTypes.string,
    business: stringOrList,
    company: stringOrList,
    location: stringOrList,
    plant: stringOrList,
    persona: stringOrList,
    status: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
  error: PropTypes.string,
}

export default UserFormModal
