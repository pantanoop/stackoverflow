"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/hooks/hooks";

import {
  fetchQuestions,
  PostDaftPublic,
  resetCurrentQuestion,
  resetQuestions,
} from "../../../app/redux/questions/questionSlice";
import { fetchTags } from "../../redux/tags/tagSlice";
// import { voteQuestionOrAnswer } from "../redux/votes/voteSlice";
import { logout } from "../../redux/auth/authenticateSlice";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOutlinedIcon from "@mui/icons-material/ThumbDownOutlined";
import SearchIcon from "@mui/icons-material/Search";

import {
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Card,
  Chip,
} from "@mui/material";

import "./Questions.css";
import { fetchQuestionsDraft } from "@/app/redux/questions/questionSlice";

export default function MyQuestions() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { questions, loading, limit } = useAppSelector(
    (state) => state.questions,
  );

  const { currentUser } = useAppSelector((state) => state.authenticator);

  // const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(resetCurrentQuestion());
    dispatch(fetchQuestionsDraft(currentUser?.userid));
    dispatch(fetchTags());
  }, [dispatch]);

  async function handlePostPublic(id: any) {
    console.log(id, "id in my questions page");
    await dispatch(PostDaftPublic(id));
    dispatch(fetchQuestionsDraft(currentUser?.userid));
  }

  return (
    <div className="so-page">
      <header className="so-header">
        <div className="so-header-left">
          <img
            className="so-logo"
            src="https://upload.wikimedia.org/wikipedia/commons/e/ef/Stack_Overflow_icon.svg"
            alt="logo"
            onClick={() => router.push("/questions")}
          />
          <span className="so-title" onClick={() => router.push("/questions")}>
            StackOverflow
          </span>
        </div>

        <div className="so-search">
          <TextField
            size="small"
            fullWidth
            placeholder="Search questions..."
            // value={searchTerm}
            // onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </div>

        <div className="so-header-actions">
          {!currentUser && (
            <>
              <Button onClick={() => router.push("/auth/login")}>Log in</Button>
              <Button
                variant="contained"
                onClick={() => router.push("/auth/register")}
              >
                Sign up
              </Button>
            </>
          )}

          <Button
            variant="contained"
            onClick={() =>
              currentUser
                ? router.push("/questions/ask")
                : router.push("/auth/login")
            }
          >
            Ask Question
          </Button>

          {currentUser && (
            <>
              <Button
                variant="contained"
                onClick={() => router.push(`/questions/myQuestions`)}
              >
                My Questions
              </Button>
              <Button onClick={() => dispatch(logout())}>Logout</Button>
            </>
          )}
        </div>
      </header>

      <div className="so-main-layout">
        <main className="so-content">
          <Typography variant="h5" className="so-question-header">
            All Questions
          </Typography>

          {questions.map((q) => (
            <Card key={q.id} className="so-question-card">
              <div className="so-card-layout">
                <div className="so-question-main">
                  {currentUser?.userid === q.userid && (
                    <IconButton
                      size="small"
                      className="so-edit-btn"
                      onClick={() => router.push(`/questions/edit/${q.id}`)}
                    >
                      <EditOutlinedIcon fontSize="small" />
                    </IconButton>
                  )}

                  <Typography
                    className="so-question-title"
                    onClick={() => router.push(`/questions/${q.id}`)}
                  >
                    {q.title}
                  </Typography>

                  <Typography
                    className="so-question-desc"
                    dangerouslySetInnerHTML={{ __html: q.description }}
                  />

                  <div className="so-tag-row">
                    {q.tags?.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        className="so-tag"
                      />
                    ))}
                  </div>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ mt: 4 }}
                    onClick={() => handlePostPublic(q.id)}
                  >
                    Post Public
                  </Button>
                </div>
              </div>
            </Card>
          ))}

          {loading && <div className="so-loading">No more Questions...</div>}
        </main>
      </div>
    </div>
  );
}
