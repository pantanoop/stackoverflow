"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Link as MuiLink } from "@mui/material";
import {
  addCurrentUser,
  googleLogin,
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
      console.log(user);
      const userData = {
        userid: user.uid ?? Date.now().toLocaleString(),
        email: user.email,
        username: user.displayName,
      };
      console.log(currentUser);
      dispatch(addCurrentUser(userData));

      if (currentUser) {
        setOpenSnackbar(true);
        setTimeout(() => router.push("/questions"), 1000);
      }
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

      dispatch(googleLogin(userData));
      console.log(currentUser);
      if (currentUser) {
        setOpenSnackbar(true);
        setTimeout(() => router.push("/questions"), 1000);
      }
    } catch (error) {
      console.error("Social login failed", error);
    }
  };

  const handleAuthError = (error: any) => {
    if (error.code === "auth/user-not-found") {
      setError("email", { type: "manual", message: "Email not registered" });
    } else if (error.code === "auth/wrong-password") {
      setError("password", { type: "manual", message: "Incorrect password" });
    } else {
      setError("email", { type: "manual", message: "Login failed" });
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        width: "100vw",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f5f5f5",
      }}
    >
      <Card
        variant="outlined"
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 350,
          minHeight: 500,
          display: "flex",
          flexDirection: "column",
          alignContent: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h5" mt={1}>
          Welcome to StackOverflow
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit(handleLogin)}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                variant="standard"
                label="Email"
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
                variant="standard"
                label="Password"
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

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Login
          </Button>

          <Typography textAlign="center" variant="body2" sx={{ my: 1 }}>
            OR
          </Typography>

          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            onClick={() => handleSocialLogin(googleProvider)}
          >
            Continue with Google
          </Button>

          <Button
            fullWidth
            variant="outlined"
            startIcon={<GitHubIcon />}
            onClick={() => handleSocialLogin(githubProvider)}
            sx={{ mt: 1, color: "#24292e", borderColor: "#24292e" }}
          >
            Continue with GitHub
          </Button>
        </Box>
        <Typography align="center" mt={3}>
          New user?{" "}
          <MuiLink component={Link} href="/auth/register">
            Register
          </MuiLink>
        </Typography>
      </Card>

      <Snackbar open={openSnackbar} autoHideDuration={3000}>
        <Alert severity="success">Logged in successfully!</Alert>
      </Snackbar>
    </Box>
  );
}

export default Login;
