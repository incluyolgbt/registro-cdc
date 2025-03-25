import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import PhoneInput from "react-phone-number-input";
import Avatar from "@mui/material/Avatar";
import CheckIcon from "@mui/icons-material/Check";
import { green } from "@mui/material/colors";
import "react-phone-number-input/style.css";
import Closed from "./Closed";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import FormHelperText from "@mui/material/FormHelperText";

const theme = createTheme();

const Copyright = (props) => {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://incluyo.lgbt/">
        Incluyo
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
};

const CustomTextField = React.forwardRef((props, ref) => (
  <TextField
    required
    fullWidth
    id="phone"
    name="phone"
    label="¿Cuál es tu número de WhatsApp?"
    inputRef={ref}
    type="tel"
    error={props.phoneError}
  />
));

const AlertDialog = (props) => {
  return (
    <div>
      <Dialog
        open={props.open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        onClose={() => {}}
      >
        <Box
          sx={{
            marginTop: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: green[500] }}>
            <CheckIcon />
          </Avatar>
          <DialogTitle id="alert-dialog-title">Registro enviado</DialogTitle>
        </Box>

        <DialogContent sx={{ marginBottom: 2 }}>
          <DialogContentText id="alert-dialog-description">
            Hemos recibido tu registro. En breve te estaremos contactando por
            WhatsApp para enviarte la ubicación o datos de acceso al Círculo de
            Cofianza.
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default function SignUp() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const [nameError, setNameError] = useState(false);
  const [ageError, setAgeError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [modalityError, setModalityError] = useState(false);
  const [privacyCheck, setPrivacyCheck] = useState(false);
  const [disableSend, setDisableSend] = useState(true);
  const [countryCode, setCountryCode] = useState("+52");
  const [source, setSource] = useState("");

  const [open, setOpen] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    let errorFlag = false;

    const form = {
      name: data.get("firstName"),
      age: data.get("age"),
      countryCode: countryCode,
      phone: data.get("phone"),
      modality: data.get("modality"),
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

    if (!form.modality) {
      setModalityError(true);
      errorFlag = true;
    }

    if (errorFlag) {
      console.log("ERROR");
      return;
    }

    if (form.countryCode === "+54") {
      form.countryCode = "+549";
    }

    form.phone = form.countryCode.replace("+", "") + form.phone;

    fetch(
      "https://incluyocdc-default-rtdb.firebaseio.com/registro-queer-talks.json",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      }
    )
      .then((response) => response.json())
      .then(() => {
        setOpen(true);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    fetch("https://incluyocdc-default-rtdb.firebaseio.com/cdcInfo.json")
      .then((response) => response.json())
      .then((data) => {
        setDate(data.date);
        setTime(data.time);
      });

    const urlParams = new URLSearchParams(window.location.search);
    const sourceParam = urlParams.get("source");
    setSource(sourceParam);
  }, []);

  useEffect(() => {
    if (privacyCheck) {
      setDisableSend(false);
    } else {
      setDisableSend(true);
    }
  }, [privacyCheck]);

  if (process.env.REACT_APP_OPEN !== "true") {
    return <Closed />;
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />

        <Box
          sx={{
            marginTop: 6,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img src="./LogoIncluyoWeb.png" alt="Logo" width="50%" />

          <span style={{ textAlign: "center", marginTop: "10px" }}>
            <Typography component="h1" variant="h5">
              Registro - Queer Talks
            </Typography>
          </span>

          <span style={{ textAlign: "center", marginTop: "10px" }}>
            <Typography component="h1" variant="subtitle1">
              <b>
                Únete a nuestro espacio seguro para personas LGBTQ+, organizado
                por Incluyo.
              </b>
              <br />
            </Typography>
          </span>

          <span style={{ textAlign: "center", margin: "5px" }}>
            <Typography component="h1" variant="subtitle1">
              Fecha: {date}
              <br />
              Hora: {time}
            </Typography>
          </span>

          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="firstName"
                  name="firstName"
                  label="¿Cuál es tu nombre?"
                  autoComplete="given-name"
                  error={nameError}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="age"
                  label="¿Qué edad tienes?"
                  name="age"
                  autoComplete="age"
                  type="tel"
                  error={ageError}
                />
              </Grid>

              <Grid item xs={12}>
                <PhoneInput
                  international
                  countryCallingCodeEditable={false}
                  defaultCountry="MX"
                  value={countryCode}
                  onChange={setCountryCode}
                  style={{ fontSize: "25px" }}
                  phoneError={phoneError}
                  inputComponent={CustomTextField}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl required error={modalityError}>
                  <FormLabel>¿En qué modalidad participarás?</FormLabel>
                  <RadioGroup name="modality" row>
                    <FormControlLabel
                      value="presencial"
                      control={<Radio />}
                      label="Presencial en GDL"
                    />
                    <FormControlLabel
                      value="virtual"
                      control={<Radio />}
                      label="Virtual por Meet"
                    />
                  </RadioGroup>
                  <FormHelperText>
                    {modalityError && "Selecciona una modalidad."}
                  </FormHelperText>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <span style={{ color: "gray" }}>
                  Te enviaremos la ubicación de nuestro espacio seguro o los
                  datos de acceso a la sesión de Meet a través de WhatsApp. No
                  compartiremos tu número con nadie.
                </span>
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      value="acceptPrivacy"
                      color="primary"
                      onChange={() => {
                        setPrivacyCheck(!privacyCheck);
                      }}
                    />
                  }
                  label={
                    <span>
                      He leido y acepto el{" "}
                      <a
                        href="https://docs.google.com/document/d/1VqW2c53X3JGKDNXPf1Gujp6CL9p6TsB_H03PrZ5Bd54/edit?usp=sharing"
                        target="_blank"
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
              type="submit"
              fullWidth
              variant="contained"
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
