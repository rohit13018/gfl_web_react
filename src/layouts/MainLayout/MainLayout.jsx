import styled from '@emotion/styled'
import PropTypes from 'prop-types'
import Header from '../../components/common/Header/Header'

const Shell = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100svh;
`

const Content = styled.main`
  flex: 1;
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
`

const MainLayout = ({ children }) => (
  <Shell>
    <Header />
    <Content>{children}</Content>
  </Shell>
)

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default MainLayout
