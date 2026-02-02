"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/hooks/hooks";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  TextField,
  Button,
  Typography,
  Card,
  Snackbar,
  Alert,
  Stack,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";

import { fetchTags } from "../../redux/tags/tagSlice";
import { addQuestion } from "@/app/redux/questions/questionSlice";

import "./ask.css";
import TextEditor from "@/app/components/Editor/TextEditor";

const AskQuestionSchema = z.object({
  title: z
    .string()
    .max(55)
    .refine((val) => val.replace(/\s/g, "").length >= 15, {
      message: "Title must have at least 15 characters (excluding spaces)",
    }),

  description: z.string().max(2000),

  tags: z.array(z.string()).min(1),

  type: z.enum(["draft", "public"]),
});

type AskQuestionData = z.infer<typeof AskQuestionSchema>;

export default function AskQuestion() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const currentUser = useAppSelector(
    (state) => state.authenticator.currentUser,
  );
  const { tags } = useAppSelector((state) => state.tags);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AskQuestionData>({
    resolver: zodResolver(AskQuestionSchema),
    defaultValues: { title: "", description: "", tags: [], type: "draft" },
  });

  useEffect(() => {
    dispatch(fetchTags());
  }, [dispatch]);

  const onSubmit = (data: AskQuestionData) => {
    const payload = { ...data, userid: currentUser?.userid };
    dispatch(addQuestion(payload));
    setOpenSnackbar(true);
    setTimeout(() => router.push("/questions"), 1200);
  };

  return (
    <div className="so-ask-wrapper">
      <div className="so-ask-container">
        <Typography variant="h5" className="so-ask-header">
          Ask a public question
        </Typography>

        <Card className="so-ask-card">
          <div className="so-form-section">
            <Typography className="so-section-title">Title</Typography>
            <Typography className="so-section-desc">
              Be specific and imagine you’re asking a question to another person
            </Typography>

            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  placeholder="e.g. How to center a div in CSS?"
                  error={!!errors.title}
                  helperText={errors.title?.message}
                  fullWidth
                  size="small"
                  className="so-input"
                />
              )}
            />
          </div>

          <div className="so-form-section">
            <Typography className="so-section-title">
              What are the details of your problem?
            </Typography>
            <Typography className="so-section-desc">
              Introduce the problem and expand on what you put in the title
            </Typography>

            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextEditor value={field.value} onChange={field.onChange} />
              )}
            />
          </div>

          <div className="so-form-section">
            <Typography className="so-section-title">Tags</Typography>
            <Typography className="so-section-desc">
              Add up to 5 tags to describe what your question is about
            </Typography>

            <Controller
              name="tags"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  multiple
                  freeSolo
                  options={tags.map((t: any) => t.tagName)}
                  value={field.value}
                  filterSelectedOptions
                  onChange={(_, newValue) => {
                    const normalized = newValue
                      .map((tag: string) => tag.trim().toLowerCase())
                      .slice(0, 5);

                    field.onChange(normalized);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="e.g. javascript react"
                      error={!!errors.tags}
                      helperText={errors.tags?.message}
                      size="small"
                      className="so-input"
                    />
                  )}
                />
              )}
            />
          </div>

          <div className="so-action-section">
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                className="so-primary-btn"
                onClick={handleSubmit((data) =>
                  onSubmit({ ...data, type: "public" }),
                )}
              >
                Post your question
              </Button>

              <Button
                variant="outlined"
                className="so-secondary-btn"
                onClick={handleSubmit((data) =>
                  onSubmit({ ...data, type: "draft" }),
                )}
              >
                Save draft
              </Button>
            </Stack>
          </div>

          <div className="so-back-link">
            Back to <Link href="/questions">Questions</Link>
          </div>
        </Card>
      </div>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity="success">Question submitted successfully 🚀</Alert>
      </Snackbar>
    </div>
  );
}
