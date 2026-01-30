"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/hooks/hooks";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
  Card,
  Chip,
  CircularProgress,
  Divider,
  Container,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Link from "next/link";
import { fetchQuestionById } from "@/app/redux/questions/questionSlice";

// import { postAnswer } from "@/app/redux/answers/answerSlice";
import TextEditor from "@/app/components/Editor/TextEditor";
import {
  fetchAnswersByQusetionId,
  PostAnswer,
} from "@/app/redux/answers/answerSlice";

const AnswerSchema = z.object({
  answer: z.string().min(10, "Answer must be at least 10 characters").max(2000),
});

type AnswerData = z.infer<typeof AnswerSchema>;

export default function QuestionPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  const { question, loading } = useAppSelector((state) => state.questions);
  const { currentUser } = useAppSelector((state) => state.authenticator);
  const answers = useAppSelector((state) => {
    state.ans.answers;
  });
  console.log(answers);
  console.log(question?.question?.title);
  let que = question?.question;
  console.log(que);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (id) {
      dispatch(fetchQuestionById({ id }));
      dispatch(fetchAnswersByQusetionId({ id }));
    }
  }, [dispatch, id]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AnswerData>({
    resolver: zodResolver(AnswerSchema),
    defaultValues: { answer: "" },
  });

  const onSubmit = (data: AnswerData) => {
    console.log("Submitting Answer:", data);
    dispatch(
      PostAnswer({ questionId: id, userId: currentUser?.userid, ...data }),
    );
    reset();
  };

  const handleLogin = () => router.push("/auth/login");
  const handleRegister = () => router.push("/auth/register");
  const handleAskQuestion = () =>
    currentUser ? router.push("/questions/ask") : router.push("/auth/login");
  const handleLogout = () => {
    /* dispatch(logout()); */ router.push("/auth/login");
  };

  if (loading || !question) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <header className="navbar">
        <AppBar
          position="static"
          sx={{ backgroundColor: "#fff", boxShadow: 1 }}
        >
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: "black",
                cursor: "pointer",
              }}
              onClick={() => router.push("/questions")}
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
              {!currentUser ? (
                <>
                  <Button variant="outlined" onClick={handleLogin}>
                    Login
                  </Button>
                  <Button variant="contained" onClick={handleRegister}>
                    Signup
                  </Button>
                </>
              ) : (
                <Button variant="outlined" onClick={handleLogout}>
                  Logout
                </Button>
              )}
              <Button variant="contained" onClick={handleAskQuestion}>
                Ask Question
              </Button>
            </Stack>
          </Toolbar>
        </AppBar>
      </header>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 500 }}
          >
            {que?.title}
          </Typography>

          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Asked{" "}
              <strong>{new Date(que?.createdAt).toLocaleDateString()}</strong>
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Author ID: <strong>{que?.userid}</strong>
            </Typography>
            <Typography variant="caption" color="primary">
              Type: {que?.type}
            </Typography>
          </Stack>

          <Divider sx={{ mb: 3 }} />

          <Typography
            variant="body1"
            sx={{ lineHeight: 1.7, whiteSpace: "pre-wrap", mb: 4 }}
          >
            {que?.description}
          </Typography>

          <Stack direction="row" spacing={1} sx={{ mb: 4 }}>
            {que.tags?.map((tag: string) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                clickable
                sx={{
                  backgroundColor: "#e1ecf4",
                  color: "#39739d",
                  borderRadius: "4px",
                }}
              />
            ))}
          </Stack>
        </Box>

        <Card variant="outlined" sx={{ p: 3, borderLeft: "4px solid #f48225" }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="answer"
              control={control}
              render={({ field }) => (
                <TextEditor value={field.value} onChange={field.onChange} />
              )}
            />
            {/* <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Question Description"
                  multiline
                  rows={8}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  fullWidth
                  margin="normal"
                />
                // <TextEditor
                //   {...field}
                //   label="Question Description"
                //   error={!!errors.description}
                //   helperText={errors.description?.message}
                // />
              )} */}
            {/* /> */}

            <Button
              variant="contained"
              type="submit"
              size="large"
              sx={{
                mt: 2,
                px: 4,
                backgroundColor: "#0a95ff",
                "&:hover": { backgroundColor: "#0074cc" },
              }}
            >
              Post Your Answer
            </Button>
          </form>
        </Card>
        <Card variant="outlined" sx={{ p: 3, borderLeft: "4px solid #f48225" }}>
          (answers ?
            answers?.map((a: any) => (
              <div className="question-card" key={a.id}>
                {/* <h3 onClick={() => router.push(`/questions/${a.id}`)}>{q.title}</h3> */}

                <p>{a?.answer}</p>
              </div>
            ))
        </Card>

        {/* <Typography align="center" mt={4}>
          <Link
            href="/questions"
            style={{ textDecoration: "none", color: "#007bff" }}
          >
            ← Back to all questions
          </Link>
        </Typography> */}
      </Container>
    </>
  );
}
