"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/hooks/hooks";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SearchIcon from "@mui/icons-material/Search";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOutlinedIcon from "@mui/icons-material/ThumbDownOutlined";

import {
  AppBar,
  Toolbar,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Stack,
  Card,
  Chip,
  CircularProgress,
  Divider,
  Container,
  Alert,
  Snackbar,
  Box,
} from "@mui/material";

import { fetchQuestionById } from "@/app/redux/questions/questionSlice";
import {
  fetchAnswersByQusetionId,
  PostAnswer,
  resetAnswers,
  updateAnswer,
} from "@/app/redux/answers/answerSlice";
import { fetchReplies, postReply } from "../../redux/replies/replyAnswer";
import TextEditor from "@/app/components/Editor/TextEditor";
import { voteQuestionOrAnswer } from "../../redux/votes/voteSlice";

import "./questionPage.css";

const AnswerSchema = z.object({
  answer: z.string().min(10).max(2000),
});

type AnswerData = z.infer<typeof AnswerSchema>;

export default function QuestionPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  const { question, loading } = useAppSelector((state) => state.questions);
  const { answers } = useAppSelector((state) => state.ans);
  const { replies } = useAppSelector((state) => state.replies);
  const { currentUser } = useAppSelector((state) => state.authenticator);

  const [editingAnswerId, setEditingAnswerId] = useState<number | null>(null);
  const [editedAnswer, setEditedAnswer] = useState("");
  const [saving, setSaving] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openReplyEditor, setOpenReplyEditor] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    if (id) {
      dispatch(resetAnswers());
      dispatch(fetchQuestionById({ id }));
      dispatch(fetchAnswersByQusetionId({ id }));
    }
  }, [dispatch, id]);

  useEffect(() => {
    answers.forEach((a) => dispatch(fetchReplies(a.id)));
  }, [answers, dispatch]);

  const { control, handleSubmit, reset } = useForm<AnswerData>({
    resolver: zodResolver(AnswerSchema),
    defaultValues: { answer: "" },
  });

  const onSubmit = async (data: AnswerData) => {
    await dispatch(
      PostAnswer({ questionId: id, userId: currentUser?.userid, ...data }),
    );
    reset();
    setOpenSnackbar(true);
  };

  const handleVote = (
    voteType: "upvote" | "downvote",
    entityId: number,
    entityType: "question" | "answer",
  ) => {
    if (!currentUser) return router.push("/auth/login");
    dispatch(
      voteQuestionOrAnswer({
        userId: currentUser.userid,
        entityType,
        entityId,
        voteType,
      }),
    );
  };

  const handleReplySubmit = async (
    answerId: number,
    parentReplyId?: number,
  ) => {
    if (!currentUser) return router.push("/auth/login");
    await dispatch(
      postReply({
        answerId,
        parentReplyId,
        text: replyText,
        userId: currentUser.userid,
        username: currentUser.username,
      }),
    );
    setReplyText("");
    setOpenReplyEditor(null);
  };

  const renderReplies = (repliesList: any[], answerId: number) => {
    return repliesList.map((r) => (
      <Box
        key={r.id}
        ml={r.parentReplyId ? 6 : 0}
        mt={1}
        sx={{
          borderLeft: r.parentReplyId ? "2px solid #eee" : "none",
          pl: 2,
          backgroundColor: r.parentReplyId ? "#fafafa" : "transparent",
          borderRadius: 1,
          p: 1,
        }}
      >
        <Typography variant="subtitle2" color="text.secondary">
          {r.username} • {new Date(r.createdAt).toLocaleString()}
        </Typography>
        <Typography sx={{ mt: 0.5 }}>{r.text}</Typography>
        <Button size="small" onClick={() => setOpenReplyEditor(r.id)}>
          Reply
        </Button>
        {openReplyEditor === r.id && (
          <Box mt={1}>
            <TextEditor value={replyText} onChange={setReplyText} />
            <Button
              size="small"
              variant="contained"
              sx={{ mt: 1 }}
              onClick={() => handleReplySubmit(answerId, r.id)}
            >
              Post Reply
            </Button>
          </Box>
        )}
        {r.childReplies && renderReplies(r.childReplies, answerId)}
      </Box>
    ));
  };

  if (loading || !question) {
    return (
      <div className="so-loading">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="so-main-wrapper">
      <AppBar position="static" className="so-navbar">
        <Toolbar className="so-toolbar">
          <div className="so-logo" onClick={() => router.push("/questions")}>
            stack<span>overflow</span>
          </div>

          <div className="so-search">
            <TextField
              size="small"
              fullWidth
              placeholder="Search..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </div>

          <Button
            className="so-ask-btn"
            onClick={() =>
              currentUser
                ? router.push("/questions/ask")
                : router.push("/auth/login")
            }
          >
            Ask Question
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg">
        <div className="so-question-header">
          <Typography variant="h5">{question.title}</Typography>
        </div>

        <Divider />

        <div className="so-question-body">
          <div className="so-vote-column">
            <IconButton onClick={() => handleVote("upvote", id, "question")}>
              <ThumbUpOutlinedIcon />
            </IconButton>

            <Typography className="so-vote-count">
              {question.upvotes - question.downvotes}
            </Typography>

            <IconButton onClick={() => handleVote("downvote", id, "question")}>
              <ThumbDownOutlinedIcon />
            </IconButton>
          </div>

          <div className="so-content-column">
            <div
              className="so-description"
              dangerouslySetInnerHTML={{ __html: question.description }}
            />

            <div className="so-tag-row">
              {question.tags?.map((tag: string) => (
                <Chip key={tag} label={tag} className="so-tag" size="small" />
              ))}
            </div>

            <div className="so-user-info">
              asked by <b>{question.username}</b>
            </div>
          </div>
        </div>

        <div className="so-answer-section">
          <Typography variant="h6">{answers.length} Answers</Typography>

          {answers.map((a: any) => (
            <Card key={a.id} className="so-answer-card">
              <div className="so-answer-layout">
                {" "}
                <div className="so-content-column">
                  {currentUser?.userid === a.userId && (
                    <IconButton
                      className="so-edit-icon"
                      onClick={() => {
                        setEditingAnswerId(a.id);
                        setEditedAnswer(a.answer);
                      }}
                    >
                      <EditOutlinedIcon fontSize="small" />
                    </IconButton>
                  )}

                  {editingAnswerId === a.id ? (
                    <>
                      <TextEditor
                        value={editedAnswer}
                        onChange={setEditedAnswer}
                      />
                      <Stack direction="row" spacing={1} mt={1}>
                        <Button
                          size="small"
                          variant="contained"
                          className="so-small-btn"
                          onClick={async () => {
                            setSaving(true);
                            await dispatch(
                              updateAnswer({
                                answerId: a.id,
                                userId: currentUser?.userid,
                                answer: editedAnswer,
                              }),
                            );
                            setSaving(false);
                            setEditingAnswerId(null);
                          }}
                        >
                          Save
                        </Button>
                        <Button
                          size="small"
                          onClick={() => setEditingAnswerId(null)}
                        >
                          Cancel
                        </Button>
                      </Stack>
                    </>
                  ) : (
                    <div
                      className="so-description"
                      dangerouslySetInnerHTML={{ __html: a.answer }}
                    />
                  )}

                  <div className="so-user-info">
                    answered by <b>{a.username}</b>
                  </div>
                </div>
              </div>

              <Stack direction="row" spacing={1} mt={1}>
                <Button
                  size="small"
                  color={a.myVote === "upvote" ? "primary" : "default"}
                  onClick={() => handleVote("upvote", a.id, "answer")}
                >
                  <ThumbUpOutlinedIcon /> {a.upvotes || 0}
                </Button>
                <Button
                  size="small"
                  color={a.myVote === "downvote" ? "error" : "default"}
                  onClick={() => handleVote("downvote", a.id, "answer")}
                >
                  <ThumbDownOutlinedIcon /> {a.downvotes || 0}
                </Button>
                <Button size="small" onClick={() => setOpenReplyEditor(a.id)}>
                  Reply
                </Button>
              </Stack>

              {openReplyEditor === a.id && (
                <Box mt={1}>
                  <TextEditor value={replyText} onChange={setReplyText} />
                  <Button
                    size="small"
                    variant="contained"
                    sx={{ mt: 1 }}
                    onClick={() => handleReplySubmit(a.id)}
                  >
                    Post Reply
                  </Button>
                </Box>
              )}

              {replies
                .filter((r) => r.answerId === a.id && !r.parentReplyId)
                .map((r) => renderReplies([r], a.id))}
            </Card>
          ))}
        </div>

        <Card className="so-post-answer">
          <Typography variant="h6">Your Answer</Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="answer"
              control={control}
              render={({ field }) => (
                <TextEditor value={field.value} onChange={field.onChange} />
              )}
            />
            <Button type="submit" variant="contained" className="so-submit-btn">
              Post Answer
            </Button>
          </form>
        </Card>
      </Container>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity="success">Answer posted successfully 🚀</Alert>
      </Snackbar>
    </div>
  );
}
