import React from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import '../App.css';

const Search = ({ value, onChange, placeholder = 'Search...', ...props }) => (
  <TextField
    className="input-field dashboard-search"
    variant="outlined"
    placeholder={placeholder}
    size="small"
    value={value}
    onChange={onChange}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <SearchIcon />
        </InputAdornment>
      )
    }}
    {...props}
  />
);

export default Search; 