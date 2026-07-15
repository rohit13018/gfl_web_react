import { forwardRef, useCallback, useImperativeHandle, useState } from 'react'
import PropTypes from 'prop-types'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Autocomplete from '@mui/material/Autocomplete'
import Checkbox from '@mui/material/Checkbox'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import NumberField from './NumberField'
import { theme } from '../../../styles/theme'

const checkboxIcon = <CheckBoxOutlineBlankIcon fontSize="small" />
const checkboxCheckedIcon = <CheckBoxIcon fontSize="small" />

const isEmpty = (value) => {
  if (value === undefined || value === null) return true
  if (Array.isArray(value)) return value.length === 0
  return String(value).trim() === ''
}

const leftAlignInput = { style: { textAlign: 'left' } }
const whiteFieldSx = { backgroundColor: theme.colors.surface }
const leftAlignSelectSx = {
  '& .MuiSelect-select': { textAlign: 'left' },
  ...whiteFieldSx,
}

const PATTERNS = {
  email: {
    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Enter a valid email address',
  },
  phone: {
    value: /^\+?[0-9]{7,15}$/,
    message: 'Enter a valid phone number',
  },
  username: {
    value: /^[a-zA-Z0-9_]{3,20}$/,
    message: '3-20 characters: letters, numbers, underscores only',
  },
  password: {
    value: /^(?=.*[A-Z])(?=.*\d).{8,}$/,
    message: 'Min 8 characters, with 1 uppercase letter and 1 number',
  },
}

const runValidation = (value, type, required, min, max, numberField) => {
  if (required && isEmpty(value)) return 'This field is required'
  if (!isEmpty(value)) {
    if (numberField) {
      const num = Number(value)
      if (min !== undefined && num < min) return `Must be at least ${min}`
      if (max !== undefined && num > max) return `Must be at most ${max}`
    }
    const pattern = PATTERNS[type]
    if (pattern && !pattern.value.test(value)) return pattern.message
  }
  return ''
}

const Validator = forwardRef(function Validator(
  {
    type = 'text',
    select = false,
    autocomplete = false,
    numberField = false,
    value,
    onChange,
    label,
    name,
    placeholder,
    required = false,
    readOnly = false,
    errorText,
    options = [],
    min,
    max,
    defaultValue,
    validateOnChange = false,
    onErrorChange,
    slotProps: slotPropsOverride,
    sx: sxOverride,
    ...props
  },
  ref
) {
  const [touched, setTouched] = useState(false)
  const [error, setError] = useState('')
  const [passwordVisible, setPasswordVisible] = useState(false)

  const validate = useCallback(
    (nextValue = value) => {
      const message = runValidation(nextValue, type, required, min, max, numberField)
      setTouched(true)
      setError(message)
      onErrorChange?.(message)
      return message === ''
    },
    [value, type, required, min, max, numberField, onErrorChange]
  )

  useImperativeHandle(ref, () => ({
    validate,
    reset: () => {
      setTouched(false)
      setError('')
    },
  }))

  const handleBlur = () => validate()

  const handleValueChange = (nextValue) => {
    if (validateOnChange || touched) validate(nextValue)
  }

  const displayError = errorText || (touched ? error : '')

  // If a placeholder is set, keep the label floated so it doesn't overlap the
  // placeholder text. Otherwise let the label sit inside the field like a
  // placeholder, floating up on focus/fill (default MUI behavior).
  const inputLabelSlotProps = {
    ...(placeholder ? { shrink: true } : {}),
    ...slotPropsOverride?.inputLabel,
  }

  if (select) {
    return (
      <TextField
        select
        name={name}
        label={label}
        required={required}
        value={value}
        onChange={(e) => {
          onChange(e)
          handleValueChange(e.target.value)
        }}
        onBlur={handleBlur}
        error={Boolean(displayError)}
        helperText={displayError || undefined}
        fullWidth
        slotProps={{ input: { readOnly } }}
        sx={{ ...leftAlignSelectSx, ...sxOverride }}
        {...props}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    )
  }

  if (autocomplete) {
    return (
      <Autocomplete
        multiple
        disableCloseOnSelect
        readOnly={readOnly}
        options={options}
        value={value ?? []}
        getOptionLabel={(option) => option.label ?? ''}
        isOptionEqualToValue={(option, val) => option.value === val.value}
        onChange={(_e, nextValue) => {
          onChange(nextValue)
          handleValueChange(nextValue)
        }}
        onBlur={handleBlur}
        slotProps={{
          listbox: {
            sx: {
              maxHeight: 300,
              overflowY: 'auto',
              '& .MuiAutocomplete-option[aria-selected="true"]': {
                backgroundColor: 'transparent',
                '&.Mui-focused': { backgroundColor: 'action.hover' },
              },
            },
          },
        }}
        renderOption={(optionProps, option, { selected }) => {
          const { key, ...rest } = optionProps
          return (
            <li key={key} {...rest}>
              <Checkbox
                icon={checkboxIcon}
                checkedIcon={checkboxCheckedIcon}
                checked={selected}
                sx={{ mr: 1 }}
              />
              {option.label}
            </li>
          )
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            name={name}
            label={label}
            placeholder={placeholder}
            required={required}
            error={Boolean(displayError)}
            helperText={displayError || undefined}
            slotProps={{
              ...params.slotProps,
              htmlInput: { ...params.slotProps?.htmlInput, ...leftAlignInput },
            }}
            sx={whiteFieldSx}
          />
        )}
        fullWidth
        sx={sxOverride}
        {...props}
      />
    )
  }

  if (numberField) {
    return (
      <NumberField
        id={name}
        name={name}
        label={label}
        required={required}
        min={min}
        max={max}
        defaultValue={defaultValue}
        value={value === '' || value === undefined ? null : value}
        onValueChange={(nextValue) => {
          onChange(nextValue)
          handleValueChange(nextValue)
        }}
        onBlur={handleBlur}
        error={Boolean(displayError)}
        helperText={displayError || undefined}
        {...props}
      />
    )
  }

  if (type === 'password') {
    return (
      <TextField
        type={passwordVisible ? 'text' : 'password'}
        name={name}
        label={label}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={(e) => {
          onChange(e)
          handleValueChange(e.target.value)
        }}
        onBlur={handleBlur}
        error={Boolean(displayError)}
        helperText={displayError || undefined}
        fullWidth
        slotProps={{
          ...slotPropsOverride,
          inputLabel: inputLabelSlotProps,
          htmlInput: { ...leftAlignInput, ...slotPropsOverride?.htmlInput },
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label={passwordVisible ? 'Hide password' : 'Show password'}
                  onClick={() => setPasswordVisible((v) => !v)}
                  edge="end"
                  size="small"
                >
                  {passwordVisible ? (
                    <VisibilityOff fontSize="small" />
                  ) : (
                    <Visibility fontSize="small" />
                  )}
                </IconButton>
              </InputAdornment>
            ),
            ...slotPropsOverride?.input,
          },
        }}
        sx={{ ...whiteFieldSx, ...sxOverride }}
        {...props}
      />
    )
  }

  const htmlType = { email: 'email', phone: 'tel' }[type] || 'text'

  return (
    <TextField
      type={htmlType}
      name={name}
      label={label}
      placeholder={placeholder}
      required={required}
      value={value}
      onChange={(e) => {
        onChange(e)
        handleValueChange(e.target.value)
      }}
      onBlur={handleBlur}
      error={Boolean(displayError)}
      helperText={displayError || undefined}
      fullWidth
      slotProps={{
        ...slotPropsOverride,
        inputLabel: inputLabelSlotProps,
        htmlInput: { ...leftAlignInput, readOnly, ...slotPropsOverride?.htmlInput },
      }}
      sx={{ ...whiteFieldSx, ...sxOverride }}
      {...props}
    />
  )
})

Validator.propTypes = {
  type: PropTypes.oneOf(['text', 'email', 'password', 'username', 'phone']),
  select: PropTypes.bool,
  autocomplete: PropTypes.bool,
  numberField: PropTypes.bool,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  readOnly: PropTypes.bool,
  errorText: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.any,
      label: PropTypes.string,
    })
  ),
  min: PropTypes.number,
  max: PropTypes.number,
  defaultValue: PropTypes.any,
  validateOnChange: PropTypes.bool,
  onErrorChange: PropTypes.func,
}

export default Validator
