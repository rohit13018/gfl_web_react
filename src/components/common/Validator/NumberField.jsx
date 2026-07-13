import { useId } from 'react'
import PropTypes from 'prop-types'
import { NumberField as BaseNumberField } from '@base-ui/react/number-field'
import IconButton from '@mui/material/IconButton'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'
import InputLabel from '@mui/material/InputLabel'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

function SSRInitialFilled() {
  return null
}
SSRInitialFilled.muiName = 'Input'

export default function NumberField({
  id: idProp,
  error,
  helperText,
  variant = 'outlined',
  onBlur,
  ...other
}) {
  const generatedId = useId()
  const id = idProp ?? generatedId
  const { label, size = 'medium', ...restProps } = other

  return (
    <BaseNumberField.Root
      {...restProps}
      render={(rootProps, state) => (
        <FormControl
          size={size}
          ref={rootProps.ref}
          disabled={state.disabled}
          required={state.required}
          error={error}
          variant={variant}
          fullWidth
        >
          {rootProps.children}
        </FormControl>
      )}
    >
      <SSRInitialFilled />
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <BaseNumberField.Input
        id={id}
        render={(inputProps, state) => (
          <OutlinedInput
            aria-describedby={`${id}-helper-text`}
            label={label}
            inputRef={inputProps.ref}
            value={state.inputValue}
            onBlur={(e) => {
              inputProps.onBlur?.(e)
              onBlur?.(e)
            }}
            onChange={inputProps.onChange}
            onKeyUp={inputProps.onKeyUp}
            onKeyDown={inputProps.onKeyDown}
            onFocus={inputProps.onFocus}
            slotProps={{ input: inputProps }}
            endAdornment={
              <InputAdornment
                position="end"
                sx={{
                  flexDirection: 'column',
                  maxHeight: 'unset',
                  alignSelf: 'stretch',
                  borderLeft: '1px solid',
                  borderColor: 'divider',
                  ml: 0,
                  '& button': {
                    py: 0,
                    flex: 1,
                    borderRadius: 0.5,
                  },
                }}
              >
                <BaseNumberField.Increment
                  render={<IconButton size={size} aria-label="Increase" />}
                >
                  <KeyboardArrowUpIcon
                    fontSize={size}
                    sx={{ transform: 'translateY(2px)' }}
                  />
                </BaseNumberField.Increment>
                <BaseNumberField.Decrement
                  render={<IconButton size={size} aria-label="Decrease" />}
                >
                  <KeyboardArrowDownIcon
                    fontSize={size}
                    sx={{ transform: 'translateY(-2px)' }}
                  />
                </BaseNumberField.Decrement>
              </InputAdornment>
            }
            sx={{ pr: 0, '& input': { textAlign: 'left' } }}
          />
        )}
      />
      <FormHelperText id={`${id}-helper-text`} sx={{ ml: 0, '&:empty': { mt: 0 } }}>
        {helperText}
      </FormHelperText>
    </BaseNumberField.Root>
  )
}

NumberField.propTypes = {
  id: PropTypes.string,
  error: PropTypes.bool,
  helperText: PropTypes.node,
  variant: PropTypes.oneOf(['outlined', 'filled', 'standard']),
  onBlur: PropTypes.func,
}
