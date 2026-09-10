import { useState } from 'react'
import styled from '@emotion/styled'
import PropTypes from 'prop-types'
import Modal from '../common/Modal/Modal'
import Validator from '../common/Validator/Validator'
import Button from '../common/Button/Button'
import useValidate from '../../hooks/useValidate'
import { theme } from '../../styles/theme'

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
  create: { title: 'Add User', submitLabel: 'Create User' },
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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  min-height: 100%;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${theme.spacing.md};
`

const ErrorBanner = styled.div`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.radii.sm};
  background: ${theme.colors.dangerBg};
  color: ${theme.colors.danger};
  font-size: 14px;
`

const Actions = styled.div`
  display: flex;
  justify-content: ${(props) => (props.singleAction ? 'flex-end' : 'space-between')};
  gap: ${theme.spacing.sm};
  margin-top: auto;
`

const SubmitButton = styled(Button)`
  border-radius: ${theme.radii.md};
`

// Mounted only while open, so state starts fresh each time without a reset effect.
const UserFormModal = ({ mode, user, onClose, onSubmit, filterOptions, isSubmitting, error }) => {
  const [formValues, setFormValues] = useState(() => buildFormValues(user))
  const [initialFormValues] = useState(() => buildFormValues(user))
  const { register, validateAll } = useValidate()
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
    <Modal open onClose={onClose} title={title} height="min(600px, 90vh)">
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
            required
            readOnly={isReadOnly}
            options={toOptions(filterOptions.business)}
            value={formValues.business}
            onChange={handleMultiChange('business')}
          />
          <Validator
            ref={register('company')}
            autocomplete
            label="Company"
            name="company"
            required
            readOnly={isReadOnly}
            options={toOptions(filterOptions.company)}
            value={formValues.company}
            onChange={handleMultiChange('company')}
          />
          <Validator
            ref={register('location')}
            autocomplete
            label="Location"
            name="location"
            required
            readOnly={isReadOnly}
            options={toOptions(filterOptions.location)}
            value={formValues.location}
            onChange={handleMultiChange('location')}
          />
          <Validator
            ref={register('plant')}
            autocomplete
            label="Plant"
            name="plant"
            required
            readOnly={isReadOnly}
            options={toOptions(filterOptions.plant)}
            value={formValues.plant}
            onChange={handleMultiChange('plant')}
          />
          <Validator
            ref={register('persona')}
            autocomplete
            label="Persona"
            name="persona"
            required
            readOnly={isReadOnly}
            options={toOptions(filterOptions.persona)}
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
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
            {isReadOnly ? 'Close' : 'Cancel'}
          </Button>
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
  filterOptions: PropTypes.shape({
    business: PropTypes.arrayOf(PropTypes.string),
    company: PropTypes.arrayOf(PropTypes.string),
    location: PropTypes.arrayOf(PropTypes.string),
    plant: PropTypes.arrayOf(PropTypes.string),
    persona: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  isSubmitting: PropTypes.bool,
  error: PropTypes.string,
}

export default UserFormModal
