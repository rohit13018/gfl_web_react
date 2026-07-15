import styled from '@emotion/styled'
import PropTypes from 'prop-types'
import SummaryCard from './SummaryCard'
import { SUMMARY_CARDS } from './summaryCardsConfig'
import { CARD_ICONS } from './cardIcons'
import { theme, mq } from '../../styles/theme'

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${theme.spacing.md};
  margin-bottom: 20px;

  ${mq('tablet')} {
    grid-template-columns: repeat(2, 1fr);
  }

  ${mq('laptop')} {
    grid-template-columns: repeat(4, 1fr);
  }
`

const SummaryCards = ({ summary, activeCard, onCardSelect }) => (
  <Grid>
    {SUMMARY_CARDS.map((card) => (
      <SummaryCard
        key={card.key}
        label={card.label}
        value={summary[card.key] ?? 0}
        gradient={card.gradient}
        icon={CARD_ICONS[card.icon]}
        isSelected={activeCard ? card.key === activeCard : card.key === 'total'}
        onClick={() => onCardSelect(card.key)}
      />
    ))}
  </Grid>
)

SummaryCards.propTypes = {
  summary: PropTypes.shape({
    total: PropTypes.number,
    active: PropTypes.number,
    inactive: PropTypes.number,
    new: PropTypes.number,
  }).isRequired,
  activeCard: PropTypes.string.isRequired,
  onCardSelect: PropTypes.func.isRequired,
}

export default SummaryCards
