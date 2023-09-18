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
import Closed from './Closed';

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
          <DialogTitle id='alert-dialog-title'>Registro enviado</DialogTitle>
        </Box>

        <DialogContent sx={{ marginBottom: 2 }}>
          <DialogContentText id='alert-dialog-description'>
            Hemos recibido tu registro. En breve te estaremos contactando por
            WhatsApp para enviarte los datos de acceso al Círculo de Confianza.
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default function SignUp() {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const [nameError, setNameError] = useState(false);
  const [ageError, setAgeError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [privacyCheck, setPrivacyCheck] = useState(false);
  const [disableSend, setDisableSend] = useState(true);
  const [countryCode, setCountryCode] = useState('+52');
  const [source, setSource] = useState('');

  const [open, setOpen] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    let errorFlag = false;

    const form = {
      name: data.get('firstName'),
      age: data.get('age'),
      countryCode: countryCode,
      phone: data.get('phone'),
      source: source,
    };

    if (!form.name) {
      setNameError(true);
      errorFlag = true;
    }

    if (!form.age) {
      setAgeError(true);
      errorFlag = true;
    }

    if (!form.phone) {
      setPhoneError(true);
      errorFlag = true;
    }

    if (errorFlag) {
      console.log('ERROR');
      return;
    }

    if (form.countryCode === '+54') {
      form.countryCode = '+549';
    }

    form.phone = form.countryCode.replace('+', '') + form.phone;

    fetch('https://incluyocdc-default-rtdb.firebaseio.com/registro.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    })
      .then((response) => response.json())
      .then(() => {
        setOpen(true);
      })
      .then(() => {
        const ACCESS_TOKEN = process.env.REACT_APP_WAPP_KEY;
        const templateName = 'incluyo_cdc_confirmation';
        const args = [
          {
            type: 'body',
            parameters: [
              {
                type: 'text',
                text: 'amigue',
              },
              {
                type: 'text',
                text: process.env.REACT_APP_DATE,
              },
              {
                type: 'text',
                text: process.env.REACT_APP_TIME,
              },
              {
                type: 'text',
                text: process.env.REACT_APP_ZOOM_ID,
              },
              {
                type: 'text',
                text: process.env.REACT_APP_ZOOM_PW,
              },
            ],
          },
          {
            type: 'button',
            sub_type: 'url',
            index: 0,
            parameters: [
              {
                type: 'text',
                text: process.env.REACT_APP_ZOOM_URL,
              },
            ],
          },
        ];
        sendTemplateRemiders([[form.name, form.phone]], {
          token: ACCESS_TOKEN,
          templateName,
          args,
          firstArgIsName: true,
        });
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  // ************* WAAP API *************

  const generatePromise = (number, token, templateName, args) => {
    const body = {
      messaging_product: 'whatsapp',
      to: number,
      type: 'template',
      template: {
        name: templateName,
        language: {
          code: 'es',
        },
        components: args,
      },
    };

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    };

    return fetch(
      'https://graph.facebook.com/v15.0/107979732160205/messages',
      options
    );
  };

  const sendTemplateRemiders = (contacts, callParams) => {
    let { token, templateName, args, firstArgIsName } = callParams;

    const numbers = contacts.map((row) => row[1]);

    let errorCount = 0;

    const result = numbers.reduce((acc, number, i) => {
      let statusCode;

      const resp = acc
        .then(() => {
          if (firstArgIsName) {
            args[0].parameters[0].text = contacts[i][0];
          }
          return generatePromise(number, token, templateName, args);
        })
        .then((response) => {
          statusCode = response.status;
          return response.json();
        })

        .then((response) => {
          // TEMP
          if (statusCode !== 200) {
            console.log(`${response.error.message}`);
            errorCount += 1;
          } else {
            const args2 = [
              {
                type: 'body',
                parameters: [
                  {
                    type: 'text',
                    text: 'Relaciones Queer',
                  },
                ],
              },
            ];
            return generatePromise(
              number,
              token,
              'incluyo_submit_question',
              args2
            );
          }
        })
        .then((response) => {
          if (statusCode !== 200) {
            console.log(`${response.error.message}`);
            errorCount += 1;
          } else {
            generatePromise(number, token, 'incluyo_support_disclamer', []);
          }
        })
        .catch((err) => console.log(err));
      return resp;
    }, Promise.resolve());

    result.then(() => {
      console.log(
        `Mensaje enviado a ${numbers.length - errorCount} de ${
          numbers.length
        } contactos.`
      );
    });

    return result;
  };

  // ************* WAAP API *************

  useEffect(() => {
    fetch('https://incluyocdc-default-rtdb.firebaseio.com/cdcInfo.json')
      .then((response) => response.json())
      .then((data) => {
        setDate(data.date);
        setTime(data.time);
      });

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

  if (process.env.REACT_APP_OPEN !== 'true') {
    return <Closed />;
  }

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
              Registro - Círculo de Confianza
            </Typography>
          </span>

          <span style={{ textAlign: 'center', marginTop: '10px' }}>
            <Typography component='h1' variant='subtitle1'>
              <b>
                Únete a nuestro espacio seguro digital para personas jóvenes
                LGBTQ+, organizado por Incluyo.
              </b>
              <br />
            </Typography>
          </span>

          <span style={{ textAlign: 'center', margin: '5px' }}>
            <Typography component='h1' variant='subtitle1'>
              Fecha: {date}
              <br />
              Hora: {time}
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
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id='age'
                  label='¿Qué edad tienes?'
                  name='age'
                  autoComplete='age'
                  type='tel'
                  error={ageError}
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
                  Te enviaremos los datos de acceso a la sesión de Zoom a través
                  de WhatsApp. No compartiremos tu número con nadie.
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
              Enviar
            </Button>

            <AlertDialog open={open} setOpen={setOpen} />
          </Box>
        </Box>

        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}
