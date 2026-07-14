import styled from '@emotion/styled'
import PropTypes from 'prop-types'
import Loader from '../Loader/Loader'
import { theme } from '../../../styles/theme'

const StyledButton = styled('button', {
  shouldForwardProp: (prop) => !['variant', 'isLoading'].includes(prop),
})`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.xs};
  min-height: 44px;
  padding: 0 ${theme.spacing.lg};
  border-radius: ${(props) => (props.variant === 'gradient' ? theme.radii.md : theme.radii.sm)};
  border: 1px solid transparent;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition:
    background-color ${theme.transitionFast},
    opacity ${theme.transitionFast};

  ${(props) =>
    props.variant === 'gradient' &&
    `
      background: linear-gradient(90deg, ${theme.colors.gradientFrom}, ${theme.colors.gradientTo});
      color: #fff;
    `}

  ${(props) =>
    props.variant === 'secondary' &&
    `
      background: transparent;
      min-height: 36px;
      border-color: ${theme.colors.border};
      color: ${theme.colors.text};
    `}

  ${(props) =>
    props.variant === 'danger' &&
    `
      background: ${theme.colors.danger};
      color: #fff;
    `}

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }

  &:not(:disabled):hover {
    opacity: 0.9;
  }
`

const Button = ({
  type = 'button',
  variant = 'secondary',
  isLoading = false,
  disabled = false,
  children,
  ...props
}) => (
  <StyledButton type={type} variant={variant} disabled={disabled || isLoading} {...props}>
    {isLoading ? <Loader size="small" /> : children}
  </StyledButton>
)

Button.propTypes = {
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  variant: PropTypes.oneOf(['secondary', 'gradient', 'danger']),
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool,
  children: PropTypes.node,
}

export default Button
