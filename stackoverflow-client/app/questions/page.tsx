"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import InfiniteScroll from "react-infinite-scroll-component";
import { useAppDispatch, useAppSelector } from "@/app/hooks/hooks";
import {
  fetchQuestions,
  resetQuestions,
} from "../redux/questions/questionSlice";
import "./Questions.css";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Stack,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { logout } from "../redux/auth/authenticateSlice";
import Link from "next/link";
export default function Questions() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { questions, total, loading, page, limit } = useAppSelector(
    (state) => state.questions,
  );
  console.log(questions);
  const { currentUser } = useAppSelector((state) => state.authenticator);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(resetQuestions());
    dispatch(fetchQuestions({ limit: 10, page: 1 }));
  }, [dispatch]);

  const fetchMore = useCallback(() => {
    if (!loading && questions.length < total) {
      dispatch(fetchQuestions({ limit, page: page + 1 }));
    }
  }, [dispatch, loading, questions.length, total, page, limit]);

  const uniqueQuestions = useMemo(() => {
    const map = new Map<number, any>();
    questions.forEach((q) => {
      if (q?.id) map.set(q.id, q);
    });
    return Array.from(map.values());
  }, [questions]);

  const filteredQuestions = uniqueQuestions.filter((q) =>
    (q.title ?? "").toLowerCase().includes(searchTerm.toLowerCase()),
  );

  function handleLogin() {
    if (currentUser) {
      router.push("/questions");
    } else {
      router.push("/auth/login");
    }
  }

  function handleRegister() {
    if (currentUser) {
      router.push("/questions");
    } else {
      router.push("/auth/register");
    }
  }

  function handleLogout() {
    dispatch(logout());
    router.push("/auth/login");
  }

  function handleAskQuestion() {
    if (!currentUser) {
      router.push("/auth/login");
    } else {
      router.push("/questions/ask");
    }
  }

  return (
    <>
      <header className="navbar">
        <AppBar
          position="static"
          sx={{ backgroundColor: "#fff", boxShadow: 1 }}
        >
          <Toolbar sx={{ justifyContent: "space-between", flexWrap: "wrap" }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "black" }}
            >
              Stack Overflow
            </Typography>

            <Box sx={{ flexGrow: 1, maxWidth: 500, mx: 2 }}>
              <TextField
                placeholder="Search Question..."
                size="small"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ backgroundColor: "#f5f5f5", borderRadius: 1 }}
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

            <Stack direction="row" spacing={1}>
              {!currentUser && (
                <>
                  <Button variant="outlined" onClick={handleLogin}>
                    Login
                  </Button>
                  <Button variant="contained" onClick={handleRegister}>
                    Signup
                  </Button>
                </>
              )}
              <Button variant="contained" onClick={handleAskQuestion}>
                Ask Question
              </Button>
              {currentUser && (
                <Button variant="contained" onClick={handleLogout}>
                  Logout
                </Button>
              )}
            </Stack>
          </Toolbar>
        </AppBar>
      </header>

      <main className="page">
        {filteredQuestions.length === 0 && !loading ? (
          <p className="empty">No questions to display</p>
        ) : (
          <InfiniteScroll
            dataLength={filteredQuestions.length}
            next={fetchMore}
            hasMore={filteredQuestions.length < total}
            loader={<div className="loader">No more questions</div>}
          >
            {filteredQuestions.map((q) => (
              <div className="question-card" key={q.id}>
                <h3 onClick={() => router.push(`/questions/${q.id}`)}>
                  {q.title}
                </h3>

                <p>{q.description}</p>
              </div>
            ))}
          </InfiniteScroll>
        )}

        {loading && questions.length === 0 && (
          <div className="loader">Loading...</div>
        )}
      </main>
    </>
  );
}
