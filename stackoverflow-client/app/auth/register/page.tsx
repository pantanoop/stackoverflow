"use client";
import { useState } from "react";
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
  Box,
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
      console.log(userData, "userdata");

      await dispatch(registerUser(userData));

      if (currentUser) {
        const res = await createUserWithEmailAndPassword(
          auth,
          data.email,
          data.password,
        );
        const user = res.user;
        console.log(user, "response from register email firebase");
        setOpenSnackbar(true);
        setTimeout(() => router.push("/questions"), 1200);
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
      console.log(user, "social auth");
      const userData = {
        userid: user.uid,
        email: user.email,
        username: user.displayName,
      };
      await dispatch(registerUser(userData));
      console.log(currentUser);
      if (currentUser) {
        setOpenSnackbar(true);
        setTimeout(() => router.push("/questions"), 1200);
      }
      // if (!currentUser) {
      //   const user = firebase.auth().currentUser;
      //   if (user) {
      //     user
      //       .delete()
      //       .then(() => {
      //         console.log("user deleted successfully");
      //       })
      //       .catch((error) => {
      //         console.error("Social Auth Error:", error);
      //       });
      //   }
      // }
    } catch (error) {
      console.error("Social Auth Error:", error);
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
        <Typography variant="h5" mt={2}>
          Connect With people
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit(handleRegister)}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
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

          <Button variant="contained" type="submit" fullWidth sx={{ mt: 1 }}>
            Register
          </Button>

          <Divider sx={{ my: 1 }}>OR</Divider>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<GoogleIcon />}
              onClick={() => handleSocialAuth(googleProvider)}
            >
              Continue with Google
            </Button>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<GitHubIcon />}
              onClick={() => handleSocialAuth(githubProvider)}
              sx={{ color: "#24292e", borderColor: "#24292e" }}
            >
              Continue with GitHub
            </Button>
          </Box>
        </Box>

        <Typography align="center" mt={3}>
          Existing user?{" "}
          <MuiLink component={Link} href="/auth/login">
            Login
          </MuiLink>
        </Typography>
      </Card>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity="success">Success! Redirecting... 🎉</Alert>
      </Snackbar>
    </Box>
  );
}

export default Register;
