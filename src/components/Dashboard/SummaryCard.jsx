import styled from '@emotion/styled'
import PropTypes from 'prop-types'
import { theme, mq } from '../../styles/theme'
import vectorBg from '../../assets/Vector.png'

const Card = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: ${theme.radii.md};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  min-height: 78px;
  color: #fff;
  background: ${(props) => props.gradient};
  box-shadow: ${theme.shadow};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing.sm};

  ${mq('tablet')} {
    padding: ${theme.spacing.md};
    min-height: 92px;
  }
`

const VectorImg = styled.img`
  position: absolute;
  right: 0;
  bottom: 0;
  width: 62%;
  height: auto;
  pointer-events: none;
  z-index: 0;
`

const TextBlock = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`

const Label = styled.span`
  font-size: 12px;
  font-weight: 500;
  opacity: 0.92;

  ${mq('tablet')} {
    font-size: 13px;
  }
`

const Value = styled.span`
  font-size: 22px;
  font-weight: 700;
  line-height: 1.2;

  ${mq('tablet')} {
    font-size: 26px;
  }
`

const IconImg = styled.img`
  position: relative;
  z-index: 1;
  width: 34px;
  height: 34px;
  object-fit: contain;
  flex-shrink: 0;

  ${mq('tablet')} {
    width: 40px;
    height: 40px;
  }
`

const SummaryCard = ({ label, value, gradient, icon }) => (
  <Card gradient={gradient}>
    <VectorImg src={vectorBg} alt="" />
    <TextBlock>
      <Label>{label}</Label>
      <Value>{value}</Value>
    </TextBlock>
    <IconImg src={icon} alt="" />
  </Card>
)

SummaryCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  gradient: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
}

export default SummaryCard
