import React from 'react';
import {
  Switch as MuiSwitch,
  FormControlLabel,
  FormGroup,
  Checkbox as MuiCheckbox,
  Radio as MuiRadio,
  RadioGroup as MuiRadioGroup,
  FormControl,
  FormLabel,
  ToggleButton,
  ToggleButtonGroup as MuiToggleButtonGroup,
} from '@mui/material';

// Reusable Switch component
export function Switch({ checked, onChange, label, ...props }) {
  return (
    <FormControlLabel
      control={<MuiSwitch className="switch" checked={checked} onChange={onChange} {...props} />}
      label={label}
    />
  );
}

// Reusable ToggleButtonGroup component
export function ToggleButtonGroup({ value, onChange, options = [], exclusive = true, ...props }) {
  return (
    <MuiToggleButtonGroup
      value={value}
      exclusive={exclusive}
      onChange={onChange}
      {...props}
    >
      {options.map((opt) => (
        <ToggleButton className="toggle-button" key={opt.value} value={opt.value}>
          {opt.label}
        </ToggleButton>
      ))}
    </MuiToggleButtonGroup>
  );
}

// Reusable CheckboxGroup component
export function CheckboxGroup({ options = [], checked = {}, onChange }) {
  return (
    <FormGroup>
      {options.map((opt) => (
        <FormControlLabel
          key={opt.value}
          control={
            <MuiCheckbox
              className="checkbox"
              checked={!!checked[opt.value]}
              onChange={onChange}
              name={opt.value}
            />
          }
          label={opt.label}
        />
      ))}
    </FormGroup>
  );
}

// Reusable RadioGroup component
export function RadioGroup({ value, onChange, options = [], label, row = true, ...props }) {
  return (
    <FormControl component="fieldset">
      {label && <FormLabel component="legend">{label}</FormLabel>}
      <MuiRadioGroup
        row={row}
        value={value}
        onChange={onChange}
        {...props}
      >
        {options.map((opt) => (
          <FormControlLabel
            key={opt.value}
            value={opt.value}
            control={<MuiRadio className="radio" />}
            label={opt.label}
          />
        ))}
      </MuiRadioGroup>
    </FormControl>
  );
}

const SelectionElements = () => {
  const [toggleValue, setToggleValue] = React.useState(true);
  const [checked, setChecked] = React.useState({
    option1: false,
    option2: true,
  });
  const [selectedRadio, setSelectedRadio] = React.useState('a');
  const [alignment, setAlignment] = React.useState('left');

  const handleCheckboxChange = (event) => {
    setChecked({
      ...checked,
      [event.target.name]: event.target.checked,
    });
  };

  const handleToggleChange = (event, newAlignment) => {
    if (newAlignment !== null) setAlignment(newAlignment);
  };

  return (
    <>
      <Box className="section">
        <Typography className="heading-secondary">Toggle (Switch)</Typography>
        <FormControlLabel
          control={
            <Switch
              className="switch"
              checked={toggleValue}
              onChange={() => setToggleValue(prev => !prev)}
            />
          }
          label={toggleValue ? 'On' : 'Off'}
        />
      </Box>

      <Box className="section">
        <Typography className="heading-secondary">Toggle Button Group</Typography>
        <ToggleButtonGroup
          value={alignment}
          exclusive
          onChange={handleToggleChange}
          aria-label="text alignment"
        >
          <ToggleButton className="toggle-button" value="left">Left</ToggleButton>
          <ToggleButton className="toggle-button" value="center">Center</ToggleButton>
          <ToggleButton className="toggle-button" value="right">Right</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box className="section">
        <Typography className="heading-secondary">Checkboxes</Typography>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                className="checkbox"
                checked={checked.option1}
                onChange={handleCheckboxChange}
                name="option1"
              />
            }
            label="Option 1"
          />
          <FormControlLabel
            control={
              <Checkbox
                className="checkbox"
                checked={checked.option2}
                onChange={handleCheckboxChange}
                name="option2"
              />
            }
            label="Option 2"
          />
        </FormGroup>
      </Box>

      <Box className="section">
        <Typography className="heading-secondary">Radio Buttons</Typography>
        <FormControl component="fieldset">
          <FormLabel component="legend">Select an Option</FormLabel>
          <RadioGroup
            row
            value={selectedRadio}
            onChange={(e) => setSelectedRadio(e.target.value)}
          >
            <FormControlLabel 
              value="a" 
              control={<Radio className="radio" />}
              label="Choice A" 
            />
            <FormControlLabel 
              value="b" 
              control={<Radio className="radio" />}
              label="Choice B" 
            />
            <FormControlLabel 
              value="c" 
              control={<Radio className="radio" />}
              label="Choice C" 
            />
          </RadioGroup>
        </FormControl>
      </Box>
    </>
  );
};

export default SelectionElements; 