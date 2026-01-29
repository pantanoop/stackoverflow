"use client";

import { useRouter } from "next/navigation";
import SearchIcon from "@mui/icons-material/Search";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Grid,
} from "@mui/material";

function Questions() {
  const router = useRouter();
  return (
    <AppBar position="static" sx={{ backgroundColor: "white" }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box sx={{ flexGrow: 1, maxWidth: 600, mx: 3 }}>
          <TextField
            placeholder="Search Question..."
            size="small"
            fullWidth
            //   value={searchTerm}
            sx={{ backgroundColor: "white", borderRadius: 1 }}
            //   onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton disabled>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Button
          size="medium"
          variant="contained"
          onClick={() => router.push("/auth/login")}
        >
          Login
        </Button>
        <Button
          size="medium"
          variant="contained"
          onClick={() => router.push("/auth/register")}
        >
          SignUp
        </Button>
        <Button
          size="medium"
          variant="contained"
          onClick={() => router.push("/questions/ask")}
        >
          Ask Question
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Questions;
