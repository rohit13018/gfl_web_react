import { css } from '@emotion/react'
import backgroundImg from '../assets/background.png'

// Brand background image behind content at low opacity, without fading the content.
export const pageBackground = css`
  position: relative;
  isolation: isolate;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    background: url(${backgroundImg}) no-repeat center center / cover;
    opacity: 0.2;
  }
`
