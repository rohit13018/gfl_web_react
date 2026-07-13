import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'
import PropTypes from 'prop-types'

const SIZE_MAP = { small: 16, medium: 22, large: 28 }

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`

const Spinner = styled('span', {
  shouldForwardProp: (prop) => prop !== 'size',
})`
  display: inline-block;
  width: ${(props) => SIZE_MAP[props.size]}px;
  height: ${(props) => SIZE_MAP[props.size]}px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: #fff;
  animation: ${spin} 0.7s linear infinite;
`

const Loader = ({ size = 'medium' }) => (
  <Spinner size={size} role="status" aria-label="Loading" />
)

Loader.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
}

export default Loader
