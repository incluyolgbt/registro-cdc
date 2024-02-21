import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import PhoneInput from 'react-phone-number-input';
import Avatar from '@mui/material/Avatar';
import CheckIcon from '@mui/icons-material/Check';
import { green } from '@mui/material/colors';
import 'react-phone-number-input/style.css';
import moment from 'moment-timezone';
import AddToCal from './AddToCal';

const theme = createTheme();
const urlParams = new URLSearchParams(window.location.search);

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

const CustomTextField = React.forwardRef((props, ref) => (
  <TextField
    required
    fullWidth
    id='phone'
    name='phone'
    label='¿Cuál es tu número de WhatsApp?'
    inputRef={ref}
    type='tel'
    error={props.phoneError}
    defaultValue={urlParams.get('phone')}
  />
));

const AlertDialog = (props) => {
  return (
    <div>
      <Dialog
        open={props.open}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        onClose={() => {}}
      >
        <Box
          sx={{
            marginTop: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: green[500] }}>
            <CheckIcon />
          </Avatar>
          <DialogTitle id='alert-dialog-title'>¡Nos vemos pronto!</DialogTitle>
        </Box>

        <DialogContent sx={{ marginBottom: 2 }}>
          <DialogContentText id='alert-dialog-description'>
            Gracias por confirmar tu asistencia, recibimos tu registro con
            éxito.
          </DialogContentText>
          <div style={{ textAlign: 'center', marginTop: '15px' }}>
            <AddToCal />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default function WorkshopSignUp() {
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [privacyCheck, setPrivacyCheck] = useState(false);
  const [disableSend, setDisableSend] = useState(true);
  const [countryCode, setCountryCode] = useState('+52');
  const [source, setSource] = useState('');
  const [open, setOpen] = useState(false);

  const brStyle = { marginTop: '10px', marginBottom: '10px' };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    let errorFlag = false;

    const form = {
      name: data.get('firstName'),
      email: data.get('email'),
      pronouns: data.get('pronouns'),
      phone: data.get('phone'),
      source: source,
    };

    if (!form.name) {
      setNameError(true);
      errorFlag = true;
    }

    if (!form.email) {
      setEmailError(true);
      errorFlag = true;
    }

    if (!form.phone) {
      setPhoneError(true);
      errorFlag = true;
    }

    if (errorFlag) {
      return;
    }

    form.phone = form.countryCode.replace('+', '') + form.phone;

    fetch(
      'https://incluyocdc-default-rtdb.firebaseio.com/registro-directorio.json',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      }
    )
      .then((response) => response.json())
      .then(() => {
        setOpen(true);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sourceParam = urlParams.get('source');
    setSource(sourceParam);
  }, []);

  useEffect(() => {
    if (privacyCheck) {
      setDisableSend(false);
    } else {
      setDisableSend(true);
    }
  }, [privacyCheck]);

  return (
    <ThemeProvider theme={theme}>
      <Container component='main' maxWidth='sm'>
        <CssBaseline />

        <Box
          sx={{
            marginTop: 6,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* <img src="./LogoIncluyoWeb.png" alt="Logo" width="50%" /> */}

          <span style={{ textAlign: 'center' }}>
            <Typography component='h1' variant='h4'>
              Presentación del Directorio de Salud Mental LGBTQ+
            </Typography>
          </span>

          <span style={{ textAlign: 'center', marginTop: '10px' }}>
            <Typography component='h1' variant='subtitle1' style={brStyle}>
              <b>
                Acompáñanos a la presentación oficial del proyecto más reciente
                de Incluyo: el direcotrio que buscará ayudar a personas LGBTQ+ a
                conectar con profesionistas de la salud mental con perspectiva
                de diversidad.
              </b>
              <br />
            </Typography>
          </span>

          <span style={{ textAlign: 'center', margin: '5px' }}>
            <Typography component='h1' variant='subtitle1'>
              29 de febrero de 2024, 5:00 PM (Hora CDMX)
              <br />
              Auditorio CUCSH Belenes.
              <br />
              Av. José Parres Arias 150, San José del Bajío, Zapopan, Jal.
            </Typography>
          </span>

          <Box
            component='form'
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id='firstName'
                  name='firstName'
                  label='¿Cuál es tu nombre?'
                  autoComplete='given-name'
                  error={nameError}
                  defaultValue={urlParams.get('name')}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id='pronouns'
                  label='¿Cuáles son tus pronombres?'
                  name='pronouns'
                  autoComplete='pronouns'
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id='email'
                  label='¿Cuál es tu correo electrónico?'
                  name='email'
                  autoComplete='email'
                  type='email'
                  error={emailError}
                  defaultValue={urlParams.get('email')}
                />
              </Grid>

              <Grid item xs={12}>
                <PhoneInput
                  international
                  countryCallingCodeEditable={false}
                  defaultCountry='MX'
                  value={countryCode}
                  onChange={setCountryCode}
                  style={{ fontSize: '25px' }}
                  phoneError={phoneError}
                  inputComponent={CustomTextField}
                />
              </Grid>

              <Grid item xs={12}>
                <span style={{ color: 'gray' }}>
                  Te enviaremos un recordatorio y la ubicación del evento por
                  WhatsApp. No compartiremos tu información con nadie.
                </span>
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      value='acceptPrivacy'
                      color='primary'
                      onChange={() => {
                        setPrivacyCheck(!privacyCheck);
                      }}
                    />
                  }
                  label={
                    <span>
                      He leido y acepto el{' '}
                      <a
                        href='https://docs.google.com/document/d/1VqW2c53X3JGKDNXPf1Gujp6CL9p6TsB_H03PrZ5Bd54/edit?usp=sharing'
                        target='_blank'
                      >
                        Aviso de Privacidad
                      </a>
                      .
                    </span>
                  }
                />
              </Grid>
            </Grid>

            <Button
              type='submit'
              fullWidth
              variant='contained'
              sx={{ mt: 3, mb: 2 }}
              disabled={disableSend}
            >
              Confirmar mi asistencia
            </Button>

            <AlertDialog open={open} setOpen={setOpen} />
          </Box>
        </Box>

        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}
