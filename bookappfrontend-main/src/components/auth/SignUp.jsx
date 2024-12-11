import React, { useReducer, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { LoadingButton } from "@mui/lab";
import { UserSignUp } from "../../api/auth.api";
import { titleCase } from "../../utils/stringUtils";
import { Snackbar } from "@mui/material";
import MuiAlert from '@mui/material/Alert';

const initialCreds = {
  phone: "",
  password: "",
  ph_err: false,
  ph_err_msg: "",
  pw_err: false,
  acc_type: "user",
};
function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

function credReducer(state, action) {
  switch (action.type) {
    case "SET_PHONE":
      let ph_err = false;
      if (!/^\d+$/.test(action.payload)) {
        ph_err = true;
        state = { ...state, ph_err, ph_err_msg: "*Cannot Contain Alphabets" };
      } else {
        state = { ...state, phone: action.payload, ph_err, ph_err_msg: "" };
      }
      return state;
    case "SET_PASSWORD":
      let pw_err = false;
      state = { ...state, password: action.payload, pw_err };
      return state;
    case "RESET_CREDS":
      return initialCreds;
  }
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function SignUp() {
    const [showpopup, setShowpopup] = useState(false)
    const [serverityalert, setSeverity] = useState("error")
    const [alertMsg, setAlertMsg] = useState("")
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoggingIn, setIsLogginIn] = useState(false);
  const [creds, setCreds] = useReducer(credReducer, initialCreds);


  const handleSubmit = async(event) => {
      event.preventDefault();
      setIsLogginIn(true);

    const data = new FormData(event.currentTarget);
    let response = await UserSignUp(data.get("Username"), data.get("phone"),data.get("email"),data.get("password"));
   
    if (response.success) {
    
      // navigate to home page
      setAlertMsg(titleCase("Account Created SuccessFully"));
      navigate("/", { replace: true })
    }
    else {
      // show the error
      console.log(response);
      setSeverity("error")
      setAlertMsg(titleCase(response.error.message))
      setShowpopup(true)
      setIsLogginIn(false)
    }
    setIsLogginIn(false)
    
  };

  return (
    <>
    <Snackbar open={showpopup} autoHideDuration={6000} onClose={(event) => {
          setShowpopup(false)
        }} >
          <MuiAlert severity={serverityalert} variant='filled' onClose={(event) => {
            setShowpopup(false)
          }}>
            {alertMsg}
          </MuiAlert>
        </Snackbar>
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            LOGO
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="Username"
                  required
                  fullWidth
                  id="Username"
                  label="Username"
                  autoFocus
                  variant="standard"
                  type="text"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  name="phone"
                  id="phone"
                  fullWidth
                  label="Phone Number"
                  helperText={creds.ph_err_msg}
                  error={creds.ph_err}
                  onChange={(event) => {
                    setCreds({
                      type: "SET_PHONE",
                      payload: event.target.value,
                    });
                  }}
                  variant="standard"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  variant="standard"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  variant="standard"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox value="allowExtraEmails" color="primary" />
                  }
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />
              </Grid>
            </Grid>
            <LoadingButton
                loading={isLoggingIn}
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Register
            </LoadingButton>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/auth" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
    </>
  );
}
