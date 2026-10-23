import styled from '@emotion/styled'
import Button from '../common/Button/Button'
import { theme, mq } from '../../styles/theme'

// Shared layout for the dashboard's add/edit form modals.

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`

/* One column on mobile, two from tablet up; minmax(0, 1fr) stops chips widening a column. */
export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${theme.spacing.lg} ${theme.spacing.md};

  ${mq('tablet')} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`

export const ErrorBanner = styled.div`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.radii.sm};
  background: ${theme.colors.dangerBg};
  color: ${theme.colors.danger};
  font-size: 14px;
`

export const Actions = styled.div`
  display: flex;
  justify-content: ${(props) => (props.singleAction ? 'flex-end' : 'space-between')};
  gap: ${theme.spacing.sm};
`

export const CancelButton = styled(Button)`
  min-width: 148px;
  min-height: 42px;
  border: none;
  border-radius: ${theme.radii.sm};
  background: #efefef;
  color: ${theme.colors.textMuted};
  font-weight: 500;
`

export const SubmitButton = styled(Button)`
  min-width: 148px;
  min-height: 42px;
  border-radius: ${theme.radii.sm};
  font-weight: 500;
`
