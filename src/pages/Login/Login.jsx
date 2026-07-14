import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from '@emotion/styled'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import Validator from '../../components/common/Validator/Validator'
import Button from '../../components/common/Button/Button'
import useAuth from '../../hooks/useAuth'
import { ROUTES } from '../../utils/constants'
import userLockIcon from '../../assets/icons/user-lock.png'
import gflLogo from '../../assets/logos/gfl.png'
import gfclLogo from '../../assets/logos/gfcl.png'
import inoxgflLogo from '../../assets/logos/inoxgfl.png'
import { theme, mq } from '../../styles/theme'
import { pageBackground } from '../../styles/backgroundStyles'

const INITIAL_FORM = { email: '', password: '' }

const fieldSx = {
  '& .MuiOutlinedInput-root': { borderRadius: '2px' },
}

const Page = styled.div`
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  background: ${theme.colors.pageBg};
  ${pageBackground}

  ${mq('laptop')} {
    flex-direction: row;
  }
`

const FormPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: ${theme.spacing.xl} ${theme.spacing.lg};
  box-sizing: border-box;

  ${mq('tablet')} {
    padding: ${theme.spacing.xl} 64px;
  }
`

const FormCenter = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const FormCard = styled.form`
  width: 100%;
  max-width: 380px;
`

const IconBadge = styled.img`
  width: 52px;
  height: auto;
  margin-bottom: ${theme.spacing.md};
`

const Title = styled.h1`
  margin: 0 0 ${theme.spacing.xs};
  font-size: 24px;
  font-weight: 700;
  color: ${theme.colors.text};
`

const Subtitle = styled.p`
  margin: 0 0 ${theme.spacing.lg};
  font-size: 14px;
  color: ${theme.colors.textMuted};
`

const ErrorBanner = styled.div`
  margin-bottom: ${theme.spacing.md};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.radii.sm};
  background: ${theme.colors.dangerBg};
  color: ${theme.colors.danger};
  font-size: 14px;
`

const FieldWrapper = styled.div`
  margin-bottom: ${theme.spacing.md};
`

const SubmitButton = styled(Button)`
  margin-top: ${theme.spacing.sm};
  width: auto;
  padding-left: ${theme.spacing.xl};
  padding-right: ${theme.spacing.lg};
  border-radius: 16px;
`

const Footer = styled.p`
  margin: ${theme.spacing.xl} 0 0;
  font-size: 12px;
  color: ${theme.colors.textMuted};
`

const HeroPanel = styled.div`
  display: none;

  ${mq('laptop')} {
    display: flex;
    flex-direction: column;
    flex: 1;
    align-items: center;
    position: relative;
    overflow: hidden;
    background: linear-gradient(160deg, ${theme.colors.navy} 0%, ${theme.colors.navyDark} 100%);
    color: #fff;
    padding: ${theme.spacing.xl} ${theme.spacing.xl} 0;
    margin: ${theme.spacing.lg} ${theme.spacing.lg} ${theme.spacing.lg} 0;
    border-radius: ${theme.radii.xl};
  }
`

const HeroHeading = styled.h2`
  font-size: 28px;
  line-height: 1.3;
  font-weight: 700;
  max-width: 480px;
  text-align: center;
  margin: 0 0 ${theme.spacing.md};

  ${mq('desktop')} {
    font-size: 32px;
  }
`

const AccentBlue = styled.span`
  color: #38bdf8;
`

const AccentGreen = styled.span`
  color: #4ade80;
`

const HeroSubtitle = styled.p`
  max-width: 500px;
  color: ${theme.colors.heroTextMuted};
  font-size: 15px;
  text-align: center;
  margin: 0;
`

const LogoShowcase = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 597px;
  height: 424px;
  box-sizing: border-box;
  background: #fff;
  border-top-right-radius: 212px;
  padding: ${theme.spacing.xl} 96px ${theme.spacing.xl} ${theme.spacing.xl};
  display: flex;
  flex-direction: column;
  justify-content: center;

  &::before,
  &::after {
    content: '';
    position: absolute;
    pointer-events: none;
    border-top: 2px solid rgba(255, 255, 255, 0.5);
    border-right: 2px solid rgba(255, 255, 255, 0.5);
  }

  &::before {
    top: -15px;
    right: -21px;
    bottom: -24px;
    left: -24px;
    border-top-right-radius: 212px;
  }

  &::after {
    top: -32px;
    right: -45px;
    bottom: -48px;
    left: -48px;
    border-top-right-radius: 212px;
  }
`

const LogoStack = styled.div`
  position: relative;
  width: 482px;
  height: 364px;
`

const GflLogoImg = styled.img`
  position: absolute;
  top: 0px;
  left: 0px;
  width: 147px;
  height: 94px;
  object-fit: contain;
`

const GfclLogoImg = styled.img`
  position: absolute;
  top: 137px;
  left: 143px;
  width: 339px;
  height: 87px;
  object-fit: contain;
`

const InoxgflLogoImg = styled.img`
  position: absolute;
  top: 279px;
  left: 0px;
  width: 250px;
  height: 85px;
  object-fit: contain;
`

const Login = () => {
  const [formValues, setFormValues] = useState(INITIAL_FORM)
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const emailRef = useRef(null)
  const passwordRef = useRef(null)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (field) => (event) => {
    setFormValues((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitError('')

    const isEmailValid = emailRef.current.validate()
    const isPasswordValid = passwordRef.current.validate()
    if (!isEmailValid || !isPasswordValid) return

    setIsSubmitting(true)
    try {
      await login(formValues)
      navigate(ROUTES.DASHBOARD, { replace: true })
    } catch (error) {
      setSubmitError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Page>
      <FormPanel>
        <FormCenter>
          <FormCard onSubmit={handleSubmit} noValidate>
            <IconBadge src={userLockIcon} alt="" />
            <Title>Login into account</Title>
            <Subtitle>Enter your email and password to access your account.</Subtitle>

            {submitError && <ErrorBanner>{submitError}</ErrorBanner>}

            <FieldWrapper>
              <Validator
                ref={emailRef}
                type="email"
                label="Email address"
                id="outlined-basic" 
                variant="outlined"
                name="email"
                required
                value={formValues.email}
                onChange={handleChange('email')}
                sx={fieldSx}
              />
            </FieldWrapper>

            <FieldWrapper>
              <Validator
                ref={passwordRef}
                type="password"
                label="Password"
                name="password"
                placeholder="Enter your password"
                required
                value={formValues.password}
                onChange={handleChange('password')}
                sx={fieldSx}
              />
            </FieldWrapper>

            <SubmitButton type="submit" variant="gradient" isLoading={isSubmitting}>
              LOG IN <ArrowForwardIcon fontSize="small" />
            </SubmitButton>
          </FormCard>
        </FormCenter>

        <Footer>Copyright © {new Date().getFullYear()} Gujarat Fluorochemicals Limited (GFL)</Footer>
      </FormPanel>

      <HeroPanel>
        <HeroHeading>
          Effortlessly manage <AccentBlue>GFL&apos;s users</AccentBlue> and{' '}
          <AccentGreen>access</AccentGreen> for the CXO app.
        </HeroHeading>
        <HeroSubtitle>
          Assign personas, companies, locations and plant-level permissions with complete
          administrative control.
        </HeroSubtitle>

        <LogoShowcase>
          <LogoStack>
            <GflLogoImg src={gflLogo} alt="Gujarat Fluorochemicals Limited" />
            <GfclLogoImg src={gfclLogo} alt="GFCL EV Products Limited" />
            <InoxgflLogoImg src={inoxgflLogo} alt="An INOXGFL Group Company" />
          </LogoStack>
        </LogoShowcase>
      </HeroPanel>
    </Page>
  )
}

export default Login
