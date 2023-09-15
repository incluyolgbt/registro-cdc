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
import moment from 'moment';
import DialogActions from '@mui/material/DialogActions';
import AddToCal from './AddToCal';

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
          <DialogTitle id='alert-dialog-title'>¡Todo listo!</DialogTitle>
        </Box>

        <DialogContent sx={{ marginBottom: 2 }}>
          <div style={{ textAlign: 'center' }}>
            <DialogContentText id='alert-dialog-description'>
              Hemos recibido tus preguntas. <br />
              ¡Nos vemos en el Círculo de Confianza!
            </DialogContentText>
          </div>
          <div style={{ textAlign: 'center', marginTop: '15px' }}>
            <AddToCal />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default function QuestionForm() {
  const [nameError, setNameError] = useState(false);
  const [questionsError, setQuestionsError] = useState(false);
  const [anonCheck, setAnonCheck] = useState(true);

  const [open, setOpen] = useState(false);

  const brStyle = { marginTop: '10px', marginBottom: '10px' };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    let errorFlag = false;

    const form = {
      name: data.get('firstName'),
      questions: data.get('questions'),
    };

    if (!anonCheck && !form.name) {
      setNameError(true);
      errorFlag = true;
    }

    if (!form.questions) {
      setQuestionsError(true);
      errorFlag = true;
    }

    if (errorFlag) {
      return;
    }

    fetch(
      'https://incluyocdc-default-rtdb.firebaseio.com/registro/preguntas.json',
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
          <span style={{ textAlign: 'center' }}>
            <Typography component='h1' variant='h5'>
              ¡Envíanos tus preguntas para el Círculo de Confianza!
            </Typography>
          </span>

          <span style={{ textAlign: 'center', marginTop: '10px' }}>
            <Typography component='h1' variant='subtitle1' style={brStyle}>
              <b>
                ¿Qué es eso que siempre quisite saber sobre relaciones queer?
                Puede ser una pregunta para que entre todes contestemos desde
                nuestra experiencia comunitaria, o puede ser una pregunta
                dirijida a les expertes en salud mental que nos acompañarán.
              </b>
              <br />
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
                <FormControlLabel
                  control={
                    <Checkbox
                      value='anonCheck'
                      color='primary'
                      checked={anonCheck}
                      onChange={() => {
                        setAnonCheck(!anonCheck);
                      }}
                    />
                  }
                  label={<span>Deseo preguntar de manera anónima.</span>}
                />
              </Grid>

              {anonCheck === false && (
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
              )}

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id='questions'
                  label='Escribe aquí tus preguntas'
                  name='questions'
                  autoComplete='questions'
                  multiline
                  rows={4}
                  required
                  error={questionsError}
                  helperText='Para cada pregunta, 
                    por favor indica si está dirigida 
                    a la comunidad o a las personas expertas 
                    en salud mental.'
                />
              </Grid>
            </Grid>

            <Button
              type='submit'
              fullWidth
              variant='contained'
              sx={{ mt: 3, mb: 2 }}
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
