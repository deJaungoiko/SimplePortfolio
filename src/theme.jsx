import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      light: '#757ce8',
      main: '#3f50b5',
      dark: '#002884',
      contrastText: '#fff',
    },
    secondary: {
      light: '#505050',
      main: '#494949',
      dark: '#1d1d1d',
      contrastText: '#fff',
    },
  },
});
export default theme;