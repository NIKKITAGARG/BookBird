import React, { useReducer, useState } from "react";
import { useDispatch } from "react-redux";
import {
  Container,
  Box,
  TextField,
  Typography,
  Button,
  Avatar,
  ThemeProvider,
  createTheme,
  Grid,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
// apis
import { Userlogin, sendOtp } from "../../api/auth.api";
// actions
import { setUserData } from "../../reducer/userdata.reducer";
import { titleCase } from "../../utils/stringUtils";
import { useLocation, useNavigate } from "react-router-dom";
import Link from "@mui/material/Link";
import CssBaseline from "@mui/material/CssBaseline";

const initialCreds = {
  phone: "",
  password: "",
  ph_err: false,
  ph_err_msg: "",
  pw_err: false,
  acc_type: "user",
};

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

/* open-book 2 */
const defaultTheme = createTheme();

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [creds, setCreds] = useReducer(credReducer, initialCreds);
  const [showpopup, setShowpopup] = useState(false);
  const [serverityalert, setSeverity] = useState("error");
  const [alertMsg, setAlertMsg] = useState("");
  const [isLoggingIn, setIsLogginIn] = useState(false);
  const passDisplay=location.pathname=="/auth"?"Block":"none";

  async function handelLogin(event) {
    setIsLogginIn(true);
    // TODO : validations
    let response = await Userlogin(creds.phone, creds.password);
    if (response.success) {
      dispatch(setUserData(response.result));
      // navigate to home page
      navigate("/", { replace: true });
    } else {
      // show the error
      setSeverity("error");
      setAlertMsg(titleCase(response.msg));
      setShowpopup(true);
    }
    setIsLogginIn(false);
  }

  async function handelSendOtp(){
    setIsLogginIn(true);
    console.log(creds.phone);

    let response = await sendOtp(creds.phone);
    
    if(response.success){
    
      setSeverity("success");
      setAlertMsg(titleCase("password reset link has been sent to registered email."));
      setShowpopup(true);
      
      setTimeout(() => {
        navigate("/auth");
    }, 2000);
    }
    else{
      setSeverity("error");
      setAlertMsg(titleCase(response.error.message))
      setShowpopup(true);
    }
    setIsLogginIn(false);
  }

  

  return (
    <>
      <Snackbar
        open={showpopup}
        autoHideDuration={6000}
        onClose={(event) => {
          setShowpopup(false);
        }}
      >
        
        <MuiAlert
          severity={serverityalert}
          variant="filled"
          onClose={(event) => {
            setShowpopup(false);
          }}
        >
          {alertMsg}
        </MuiAlert>
      </Snackbar>
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 12,
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

            <form
              onSubmit={(event) => {
                event.preventDefault();
                if(location.pathname=="/auth") handelLogin();
                else handelSendOtp();
              }}
            >
              <Grid container spacing={2} sx={{marginTop:4}}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Phone Number"
                    id="phone"
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
                <Grid item xs={12} sm={6} sx={{display:passDisplay}}>
                  <TextField
                  fullWidth
                    label="Password"
                    error={creds.pw_err}
                    type="password"
                    variant="standard"
                    onChange={(event) => {
                      setCreds({
                        type: "SET_PASSWORD",
                        payload: event.target.value,
                      });
                    }}
                  />
                </Grid>
              </Grid>
                    
              <LoadingButton
                loading={isLoggingIn}
                variant="contained"
                type="submit"
                sx={{ mt: 5, mb: 2 }}
                fullWidth
              >
                
                {location.pathname=="/auth"?"Login":"Send Otp"}
              </LoadingButton>

             
             
            <Grid container justifyContent="flex-end" sx={{marginTop:2 , visibility: location.pathname=="/auth"?"block":"hidden"}}>
                <Grid item xs={12}>
                 
                  <Link href="/auth/register-user" variant="body2">
                    Dont have an account? Sign Up
                  </Link>
                </Grid>
                <Grid item xs={12}>

                <Link href="/auth/reset-pass" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
              </Grid>
            </form>
          </Box>
        </Container>
      </ThemeProvider>
    </>
  );
};

export default Login;
