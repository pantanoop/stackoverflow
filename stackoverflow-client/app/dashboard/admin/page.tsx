"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/hooks/hooks";

import {
  fetchQuestions,
  fetchQuestionsAdmin,
  resetCurrentQuestion,
  resetQuestions,
  toggleQuestionBan,
} from "../../redux/questions/questionSlice";
import { fetchTags } from "../../redux/tags/tagSlice";
import { voteQuestionOrAnswer } from "../../redux/votes/voteSlice";
import { logout } from "../../redux/auth/authenticateSlice";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
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
  Switch,
} from "@mui/material";

import "./Questions.css";

export default function AdminDashboard() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { questions, loading, limit } = useAppSelector(
    (state) => state.questions,
  );
  const { tags } = useAppSelector((state) => state.tags);
  const { currentUser } = useAppSelector((state) => state.authenticator);

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  //   const [selectedTags, setSelectedTags] = useState<string[]>([]);
  //   const [sortByNewest, setSortByNewest] = useState(false);
  //   const [sortByScore, setSortByScore] = useState(false);

  useEffect(() => {
    dispatch(resetQuestions());
    dispatch(fetchQuestionsAdmin({ limit: 10, page: 1 }));
    dispatch(fetchTags());
  }, [dispatch]);

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

  async function handleToggleBan(id: number) {
    await dispatch(toggleQuestionBan(id) as any);
    await dispatch(fetchQuestionsAdmin({ limit: 10, page: 1 }));
  }

  //   const filteredQuestions = useMemo(() => {
  //     let list = questions.filter((q) =>
  //       q.title.toLowerCase().includes(searchTerm.toLowerCase()),
  //     );

  //     if (selectedTags.length > 0) {
  //       list = list.filter((q) =>
  //         selectedTags.every((tag) => q.tags?.includes(tag)),
  //       );
  //     }

  //     if (sortByScore) {
  //       list = [...list].sort(
  //         (a, b) => b.upvotes - b.downvotes - (a.upvotes - a.downvotes),
  //       );
  //     } else if (sortByNewest) {
  //       list = [...list].sort(
  //         (a, b) =>
  //           new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  //       );
  //     }

  //     return list;
  //   }, [questions, searchTerm, selectedTags, sortByNewest, sortByScore]);

  //   const handleVote = (voteType: "upvote" | "downvote", entityId: number) => {
  //     if (!currentUser) return router.push("/auth/login");

  //     dispatch(
  //       voteQuestionOrAnswer({
  //         userId: currentUser.userid,
  //         entityType: "question",
  //         entityId,
  //         voteType,
  //       }),
  //     );
  //   };
  // console.log(questions, "jehfjh");

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
          <Button
            variant="contained"
            onClick={() =>
              currentUser
                ? router.push("/dashboard/admin")
                : router.push("/auth/login")
            }
          >
            Admin Dashboard
          </Button>

          <Button
            variant="contained"
            onClick={() =>
              currentUser
                ? router.push(`/questions/myQuestions`)
                : router.push("/auth/login")
            }
          >
            My Questions
          </Button>

          {currentUser && (
            <Button onClick={() => dispatch(logout())}>Logout</Button>
          )}
        </div>
      </header>

      <div className="so-main-layout">
        <aside className="so-sidebar">
          <Button
            variant={"contained"}
            onClick={() => router.push("admin/userlist")}
          >
            User List
          </Button>
        </aside>

        <main className="so-content">
          <Typography variant="h5" className="so-question-header">
            All Questions
          </Typography>

          {questions.map((q) => (
            <Card key={q.id} className="so-question-card">
              <div className="so-card-layout">
                <div className="so-vote-section">
                  <span className="so-vote-number">
                    {q.upvotes - q.downvotes}
                  </span>
                  <span className="so-vote-text">votes</span>
                </div>

                <div className="so-question-main">
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
                      onClick={() => router.push(`/questions/edit/${q.id}`)}
                    >
                      <EditOutlinedIcon fontSize="small" />
                    </Button>
                    <Button size="small" onClick={() => handleToggleBan(q.id)}>
                      <Typography variant="body2">
                        {q.isBanned ? "Banned" : "Unbanned"}
                      </Typography>
                      <DeleteIcon
                        sx={{ color: q.isBanned ? "Red" : "green" }}
                      />
                    </Button>
                  </div>

                  <Typography className="so-post-info" sx={{ mt: 4 }}>
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
