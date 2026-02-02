"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Link as MuiLink } from "@mui/material";
import {
  addCurrentUser,
  socialLogin,
} from "@/app/redux/auth/authenticateSlice";

import { auth, googleProvider, githubProvider } from "../../config/firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  TextField,
  Button,
  Box,
  Typography,
  Card,
  Link,
  IconButton,
  InputAdornment,
  Snackbar,
  Alert,
} from "@mui/material";

import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { useAppDispatch, useAppSelector } from "../../hooks/hooks";

import "./login.css";

const LoginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof LoginSchema>;

function Login() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const { currentUser } = useAppSelector((state) => state.authenticator);

  useEffect(() => {
    if (currentUser) {
      setOpenSnackbar(true);
      const timer = setTimeout(() => {
        router.push("/questions");
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [currentUser, router]);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (data: LoginFormData) => {
    try {
      const res = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password,
      );
      const user = res.user;

      const userData = {
        userid: user.uid ?? Date.now().toLocaleString(),
        email: user.email,
        username: user.displayName,
      };

      dispatch(addCurrentUser(userData));
    } catch (error: any) {
      handleAuthError(error);
    }
  };

  const handleSocialLogin = async (provider: any) => {
    try {
      const res = await signInWithPopup(auth, provider);
      const user = res.user;

      const userData = {
        userid: user.uid,
        email: user.email,
        username: user.displayName,
      };

      dispatch(socialLogin(userData));
    } catch (error) {
      handleAuthError(error);
    }
  };

  const handleAuthError = (error: any) => {
    if (error.code === "auth/user-not-found") {
      setError("email", { type: "manual", message: "Email not registered" });
    } else if (error.code === "auth/wrong-password") {
      setError("password", { type: "manual", message: "Incorrect password" });
    } else if (error.code === "auth/account-exists-with-different-credential") {
      setError("email", {
        type: "manual",
        message: "account-exists-with-different-credential",
      });
    } else {
      setError("email", { type: "manual", message: "Login failed" });
    }
  };

  return (
    <div className="so-login-page">
      <div className="so-login-container">
        <div className="so-logo-area">
          <img
            className="so-logo"
            src="https://upload.wikimedia.org/wikipedia/commons/e/ef/Stack_Overflow_icon.svg"
            alt="logo"
          />
        </div>

        <div className="so-social-buttons">
          <Button
            fullWidth
            variant="outlined"
            className="so-google-btn"
            startIcon={<GoogleIcon />}
            onClick={() => handleSocialLogin(googleProvider)}
          >
            Log in with Google
          </Button>

          <Button
            fullWidth
            variant="contained"
            className="so-github-btn"
            startIcon={<GitHubIcon />}
            onClick={() => handleSocialLogin(githubProvider)}
          >
            Log in with GitHub
          </Button>
        </div>

        <Card className="so-login-card">
          <Box
            component="form"
            onSubmit={handleSubmit(handleLogin)}
            className="so-login-form"
          >
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  variant="outlined"
                  fullWidth
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Password"
                  variant="outlined"
                  fullWidth
                  type={showPassword ? "text" : "password"}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword((s) => !s)}>
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              className="so-login-submit"
            >
              Log in
            </Button>
          </Box>
        </Card>

        <div className="so-login-footer">
          <Typography>
            Don’t have an account?{" "}
            <MuiLink component={Link} href="/auth/register">
              Sign up
            </MuiLink>
          </Typography>
        </div>
      </div>

      <Snackbar open={openSnackbar} autoHideDuration={3000}>
        <Alert severity="success">Logged in successfully!</Alert>
      </Snackbar>
    </div>
  );
}

export default Login;
