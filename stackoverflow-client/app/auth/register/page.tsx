"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "../../redux/auth/authenticateSlice";

import { Link as MuiLink } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { auth, googleProvider, githubProvider } from "../../config/firebase";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";

import {
  TextField,
  Button,
  Typography,
  Link,
  Card,
  Snackbar,
  Alert,
  IconButton,
  InputAdornment,
  Divider,
} from "@mui/material";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";

import "./register.css";

const RegistrationSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .regex(/^\S+$/, "Username cannot contain spaces"),
    email: z.string().email("Must be a valid email"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(/^\S*$/, "Password cannot contain spaces"),
    confirmpassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmpassword, {
    path: ["confirmpassword"],
    message: "Passwords do not match",
  });

type RegistrationSchemaType = z.infer<typeof RegistrationSchema>;

function Register() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { currentUser } = useAppSelector((state) => state.authenticator);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
  } = useForm<RegistrationSchemaType>({
    resolver: zodResolver(RegistrationSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmpassword: "",
    },
  });

  const handleRegister = async (data: RegistrationSchemaType) => {
    try {
      const userData = {
        userid: Date.now().toLocaleString(),
        email: data.email,
        username: data.username,
      };

      dispatch(registerUser(userData));

      if (currentUser) {
        await createUserWithEmailAndPassword(auth, data.email, data.password);
      }
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        setError("email", {
          type: "manual",
          message: "Email already registered",
        });
      } else {
        setError("email", { type: "manual", message: "Registration failed" });
      }
    }
  };

  const handleSocialAuth = async (provider: any) => {
    try {
      const res = await signInWithPopup(auth, provider);
      const user = res.user;

      const userData = {
        userid: user.uid,
        email: user.email,
        username: user.displayName,
      };

      dispatch(registerUser(userData));
    } catch (error) {
      console.error("Social Auth Error:", error);
    }
  };

  return (
    <div className="so-register-page">
      <div className="so-register-container">
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
            onClick={() => handleSocialAuth(googleProvider)}
          >
            Sign up with Google
          </Button>

          <Button
            fullWidth
            variant="contained"
            className="so-github-btn"
            startIcon={<GitHubIcon />}
            onClick={() => handleSocialAuth(githubProvider)}
          >
            Sign up with GitHub
          </Button>
        </div>

        <Card className="so-register-card">
          <form
            onSubmit={handleSubmit(handleRegister)}
            className="so-register-form"
          >
            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Username"
                  error={!!errors.username}
                  helperText={errors.username?.message}
                  fullWidth
                />
              )}
            />

            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  fullWidth
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
                  type={showPassword ? "text" : "password"}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  fullWidth
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

            <Controller
              name="confirmpassword"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  error={!!errors.confirmpassword}
                  helperText={errors.confirmpassword?.message}
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword((s) => !s)}
                        >
                          {showConfirmPassword ? (
                            <Visibility />
                          ) : (
                            <VisibilityOff />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />

            <Button
              variant="contained"
              type="submit"
              fullWidth
              className="so-register-submit"
            >
              Sign up
            </Button>

            <Divider className="so-divider">OR</Divider>

            <Typography className="so-footer-text">
              Already have an account?{" "}
              <MuiLink component={Link} href="/auth/login">
                Log in
              </MuiLink>
            </Typography>
          </form>
        </Card>
      </div>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity="success">Success! Redirecting...</Alert>
      </Snackbar>
    </div>
  );
}

export default Register;
