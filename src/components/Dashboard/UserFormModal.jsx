import { useState } from 'react'
import styled from '@emotion/styled'
import PropTypes from 'prop-types'
import Modal from '../common/Modal/Modal'
import Validator from '../common/Validator/Validator'
import Button from '../common/Button/Button'
import useValidate from '../../hooks/useValidate'
import { theme, mq } from '../../styles/theme'

const STATUS_OPTIONS = [
  { value: 'Active', label: 'Active' },
  { value: 'Inactive', label: 'Inactive' },
]

const FIELD_NAMES = ['email', 'business', 'company', 'location', 'plant', 'persona']

const INITIAL_FORM = {
  email: '',
  business: '',
  company: [],
  location: '',
  plant: '',
  persona: '',
  status: 'Active',
}

const MODE_CONFIG = {
  create: { title: 'Add User', submitLabel: 'Create User' },
  edit: { title: 'Update User', submitLabel: 'Update User' },
  view: { title: 'View User', submitLabel: null },
}

const toOptions = (values = []) => values.map((value) => ({ value, label: value }))

const serializeForm = (values) =>
  JSON.stringify({
    ...values,
    company: [...values.company.map((option) => option.value)].sort(),
  })

const buildFormValues = (user) => {
  if (!user) return INITIAL_FORM
  const companies = Array.isArray(user.company) ? user.company : user.company ? [user.company] : []

  return {
    email: user.email ?? '',
    business: user.business ?? '',
    company: toOptions(companies),
    location: user.location ?? '',
    plant: user.plant ?? '',
    persona: user.persona ?? '',
    status: user.status ?? 'Active',
  }
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${theme.spacing.md};

  ${mq('tablet')} {
    grid-template-columns: repeat(2, 1fr);
  }
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
`

const SubmitButton = styled(Button)`
  border-radius: ${theme.radii.md};
`

// Mounted only while the modal is open (see Dashboard), so this state
// starts fresh every time it's opened without needing a reset effect.
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

  const handleCompanyChange = (nextValue) => {
    setFormValues((prev) => ({ ...prev, company: nextValue }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (isReadOnly || isUnchanged) return
    if (!validateAll(FIELD_NAMES)) return
    onSubmit({
      ...formValues,
      company: formValues.company.map((option) => option.value),
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
            disabled={isReadOnly}
            value={formValues.email}
            onChange={handleChange('email')}
          />
          <Validator
            ref={register('business')}
            select
            label="Business"
            name="business"
            required
            disabled={isReadOnly}
            options={toOptions(filterOptions.business)}
            value={formValues.business}
            onChange={handleChange('business')}
          />
          <Validator
            ref={register('company')}
            autocomplete
            label="Company"
            name="company"
            required
            disabled={isReadOnly}
            options={toOptions(filterOptions.company)}
            value={formValues.company}
            onChange={handleCompanyChange}
          />
          <Validator
            ref={register('location')}
            select
            label="Location"
            name="location"
            required
            disabled={isReadOnly}
            options={toOptions(filterOptions.location)}
            value={formValues.location}
            onChange={handleChange('location')}
          />
          <Validator
            ref={register('plant')}
            select
            label="Plant"
            name="plant"
            required
            disabled={isReadOnly}
            options={toOptions(filterOptions.plant)}
            value={formValues.plant}
            onChange={handleChange('plant')}
          />
          <Validator
            ref={register('persona')}
            select
            label="Persona"
            name="persona"
            required
            disabled={isReadOnly}
            options={toOptions(filterOptions.persona)}
            value={formValues.persona}
            onChange={handleChange('persona')}
          />
          <Validator
            select
            label="Status"
            name="status"
            disabled={isReadOnly}
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

UserFormModal.propTypes = {
  mode: PropTypes.oneOf(['create', 'edit', 'view']).isRequired,
  user: PropTypes.shape({
    email: PropTypes.string,
    business: PropTypes.string,
    company: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
    location: PropTypes.string,
    plant: PropTypes.string,
    persona: PropTypes.string,
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
