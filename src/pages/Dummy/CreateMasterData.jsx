import { useState } from 'react'
import styled from '@emotion/styled'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Validator from '../../components/common/Validator/Validator'
import Button from '../../components/common/Button/Button'
import useValidate from '../../hooks/useValidate'
import masterService from '../../services/masterService'
import { theme } from '../../styles/theme'
import { pageBackground } from '../../styles/backgroundStyles'

const TYPE_OPTIONS = [
  { value: 'business', label: 'Business' },
  { value: 'company', label: 'Company' },
  { value: 'location', label: 'Location' },
  { value: 'plant', label: 'Plant' },
  { value: 'persona', label: 'Persona' },
]

const INITIAL_FORM = {
  type: '',
  name: '',
  code: '',
  description: '',
  isActive: true,
}

const Page = styled.div`
  min-height: 100svh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.lg};
  background: ${theme.colors.pageBg};
  ${pageBackground}
`

const Card = styled.form`
  width: 100%;
  max-width: 420px;
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.lg};
  box-shadow: ${theme.shadow};
  padding: ${theme.spacing.xl};
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`

const Title = styled.h1`
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: ${theme.colors.text};
`

const Banner = styled.div`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.radii.sm};
  font-size: 14px;
  ${(props) =>
    props.variant === 'error'
      ? `background: ${theme.colors.dangerBg}; color: ${theme.colors.danger};`
      : `background: #dcfce7; color: #15803d;`}
`

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: ${theme.spacing.sm};
`

// Standalone test page (not part of the main app flow) for exercising
// masterService.createMasterData directly against POST /web/cxo/master-data.
const CreateMasterData = () => {
  const [formValues, setFormValues] = useState(INITIAL_FORM)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { register, validateAll, reset } = useValidate()

  const handleChange = (field) => (event) => {
    setFormValues((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const handleActiveChange = (event) => {
    setFormValues((prev) => ({ ...prev, isActive: event.target.checked }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')
    if (!validateAll(['type', 'name'])) return

    setIsSubmitting(true)
    try {
      await masterService.createMasterData(formValues)
      setSuccess('Master data created successfully.')
      setFormValues(INITIAL_FORM)
      reset()
    } catch (err) {
      setError(err.message || 'Unable to create master data. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Page>
      <Card onSubmit={handleSubmit} noValidate>
        <Title>Create Master Data</Title>

        {error && <Banner variant="error">{error}</Banner>}
        {success && <Banner variant="success">{success}</Banner>}

        <Validator
          ref={register('type')}
          select
          label="Type"
          name="type"
          required
          options={TYPE_OPTIONS}
          value={formValues.type}
          onChange={handleChange('type')}
        />

        <Validator
          ref={register('name')}
          type="text"
          label="Name"
          name="name"
          placeholder="GFL"
          required
          value={formValues.name}
          onChange={handleChange('name')}
        />

        <Validator
          type="text"
          label="Code"
          name="code"
          placeholder="GFL001"
          value={formValues.code}
          onChange={handleChange('code')}
        />

        <Validator
          type="text"
          label="Description"
          name="description"
          placeholder="Gujarat Fluorochemicals Limited"
          value={formValues.description}
          onChange={handleChange('description')}
        />

        <FormControlLabel
          control={<Checkbox checked={formValues.isActive} onChange={handleActiveChange} />}
          label="Active"
        />

        <Actions>
          <Button type="submit" variant="gradient" isLoading={isSubmitting}>
            Create
          </Button>
        </Actions>
      </Card>
    </Page>
  )
}

export default CreateMasterData
