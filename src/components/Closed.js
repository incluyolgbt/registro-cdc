import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import 'react-phone-number-input/style.css';

const theme = createTheme();

const Copyright = (props) => {
  return (
    <Typography
      variant='body2'
      color='text.secondary'
      align='center'
      {...props}
    >
      {'Copyright © '}
      <Link color='inherit' href='https://incluyo.lgbt/'>
        Incluyo
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
};

export default function Closed() {
  return (
    <ThemeProvider theme={theme}>
      <Container component='main' maxWidth='xs'>
        <CssBaseline />

        <Box
          sx={{
            marginTop: 6,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <img src='./LogoIncluyoWeb.png' alt='Logo' width='50%' />

          <span style={{ textAlign: 'center', marginTop: '10px' }}>
            <Typography component='h1' variant='h5'>
              ¡Registro cerrado!
            </Typography>
          </span>

          <span style={{ textAlign: 'center', marginTop: '10px' }}>
            <Typography component='h1' variant='subtitle1'>
              Gracias por acompañarnos en nuestros <b>Círculos de Confianza</b>,
              nos vemos en 2023 para seguir construyendo espacios seguros. 🏳️‍🌈🏳️‍⚧️
              <br />
            </Typography>
          </span>
        </Box>

        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}
