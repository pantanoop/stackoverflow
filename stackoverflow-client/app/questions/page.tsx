"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/hooks/hooks";

import {
  fetchQuestions,
  resetCurrentQuestion,
  resetQuestions,
} from "../redux/questions/questionSlice";
import { fetchTags } from "../redux/tags/tagSlice";
import { voteQuestionOrAnswer } from "../redux/votes/voteSlice";
import { logout } from "../redux/auth/authenticateSlice";

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
  Stack,
  Card,
  Chip,
  MenuItem,
  Select,
  Checkbox,
  ListItemText,
  FormControl,
  InputLabel,
} from "@mui/material";

import "./Questions.css";

export default function Questions() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { questions, loading, limit } = useAppSelector(
    (state) => state.questions,
  );
  const { tags } = useAppSelector((state) => state.tags);
  const { currentUser } = useAppSelector((state) => state.authenticator);

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortByNewest, setSortByNewest] = useState(false);
  const [sortByScore, setSortByScore] = useState(false);

  useEffect(() => {
    dispatch(resetCurrentQuestion());
    dispatch(fetchQuestions({ limit: 10, page: 1 }));
    dispatch(fetchTags());
  }, [dispatch]);

  useEffect(() => {
    if (page === 1) return;
    dispatch(fetchQuestions({ limit: 10, page }));
  }, [dispatch, page]);

  const handleScroll = useCallback(() => {
    const nearBottom =
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 200;

    if (nearBottom && !loading && questions.length === limit) {
      setPage((prev) => prev + 1);
    }
  }, [loading, questions.length, limit]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const filteredQuestions = useMemo(() => {
    let list = questions.filter((q) =>
      q.title.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    if (selectedTags.length > 0) {
      list = list.filter((q) =>
        selectedTags.every((tag) => q.tags?.includes(tag)),
      );
    }

    if (sortByScore) {
      list = [...list].sort(
        (a, b) => b.upvotes - b.downvotes - (a.upvotes - a.downvotes),
      );
    } else if (sortByNewest) {
      list = [...list].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    }

    return list;
  }, [questions, searchTerm, selectedTags, sortByNewest, sortByScore]);

  const handleVote = (voteType: "upvote" | "downvote", entityId: number) => {
    if (!currentUser) return router.push("/auth/login");

    dispatch(
      voteQuestionOrAnswer({
        userId: currentUser.userid,
        entityType: "question",
        entityId,
        voteType,
      }),
    );
  };

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
          <span className="so-title">StackOverflow</span>
        </div>

        <div className="so-search">
          <TextField
            size="small"
            fullWidth
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
            <Button onClick={() => dispatch(logout())}>Logout</Button>
          )}
        </div>
      </header>

      <div className="so-main-layout">
        <aside className="so-sidebar">
          <Typography className="so-sidebar-title">Filter</Typography>

          <FormControl size="small" fullWidth>
            <InputLabel>Tags</InputLabel>
            <Select
              multiple
              value={selectedTags}
              label="Tags"
              renderValue={(selected) => selected.join(", ")}
              onChange={(e) => setSelectedTags(e.target.value as string[])}
            >
              {tags.map((tag: any) => (
                <MenuItem key={tag.id} value={tag.tagName}>
                  <Checkbox checked={selectedTags.includes(tag.tagName)} />
                  <ListItemText primary={tag.tagName} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <div className="so-sort-buttons">
            <Button
              variant={sortByNewest ? "contained" : "outlined"}
              onClick={() => setSortByNewest((v) => !v)}
            >
              Newest
            </Button>

            <Button
              variant={sortByScore ? "contained" : "outlined"}
              onClick={() => setSortByScore((v) => !v)}
            >
              Highest Score
            </Button>
          </div>
        </aside>

        <main className="so-content">
          <Typography variant="h5" className="so-question-header">
            All Questions
          </Typography>

          {filteredQuestions.map((q) => (
            <Card key={q.id} className="so-question-card">
              <div className="so-card-layout">
                <div className="so-vote-section">
                  <span className="so-vote-number">
                    {q.upvotes - q.downvotes}
                  </span>
                  <span className="so-vote-text">votes</span>
                </div>

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
                </div>

                <div className="so-right-panel">
                  <div className="so-vote-buttons">
                    <Button
                      size="small"
                      onClick={() => handleVote("upvote", q.id)}
                    >
                      <ThumbUpOutlinedIcon /> {q.upvotes}
                    </Button>

                    <Button
                      size="small"
                      onClick={() => handleVote("downvote", q.id)}
                    >
                      <ThumbDownOutlinedIcon /> {q.downvotes}
                    </Button>
                  </div>

                  <Typography className="so-post-info">
                    asked by {q.username}
                  </Typography>
                </div>
              </div>
            </Card>
          ))}

          {loading && <div className="so-loading">Loading...</div>}
        </main>
      </div>
    </div>
  );
}
