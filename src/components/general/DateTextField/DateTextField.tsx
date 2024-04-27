import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import { IconButton, InputAdornment, TextField } from '@mui/material';

const DateTextField = (props: any) => {
  const {
    id,
    label,
    value,
    setOpen,
    helperText,
    error,
    name,
    dataTestId,
    InputProps: { ref } = { ref: null }
  } = props;

  return (
    <TextField
      data-testid={dataTestId}
      id={id}
      ref={ref}
      label={label}
      value={value}
      name={name}
      helperText={helperText}
      error={error}
      autoComplete="off"
      onClick={() => setOpen?.((prev: any) => !prev)}
      sx={{
        '& > .MuiOutlinedInput-root input': {
          caretColor: 'transparent',
          cursor: 'pointer'
        },
        '& > .MuiOutlinedInput-root input::selection': {
          background: 'transparent'
        }
      }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton sx={{ marginRight: '-10px' }}>
              <CalendarTodayOutlinedIcon />
            </IconButton>
          </InputAdornment>)
      }}
    />
  );
};

export default DateTextField;
