"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
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
  CircularProgress,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";

import { fetchTags } from "@/app/redux/tags/tagSlice";
import {
  fetchQuestionById,
  updateQuestion,
} from "@/app/redux/questions/questionSlice";
import TextEditor from "@/app/components/Editor/TextEditor";

import "./editPage.css";

const EditQuestionSchema = z.object({
  title: z
    .string()
    .max(55)
    .refine((val) => val.replace(/\s/g, "").length >= 15, {
      message: "Title must have at least 15 characters (excluding spaces)",
    }),
  description: z.string().max(2000),
  tags: z.array(z.string()).min(1, { message: "Select at least 1 tag" }),
  type: z.enum(["draft", "public"]),
});

type EditQuestionData = z.infer<typeof EditQuestionSchema>;

export default function EditQuestion() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const questionId = Number(params.id);

  const { currentUser } = useAppSelector((state) => state.authenticator);
  const { question, loading } = useAppSelector((state) => state.questions);
  const { tags } = useAppSelector((state) => state.tags);

  const [openSnackbar, setOpenSnackbar] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditQuestionData>({
    resolver: zodResolver(EditQuestionSchema),
    defaultValues: { title: "", description: "", tags: [], type: "draft" },
  });

  useEffect(() => {
    dispatch(fetchTags());
    dispatch(fetchQuestionById({ id: questionId }));
  }, [dispatch, questionId]);

  useEffect(() => {
    if (question) {
      reset({
        title: question.title,
        description: question.description,
        tags: question.tags || [],
        type: question.type || "draft",
      });
    }
  }, [question, reset]);

  const onSubmit = (data: EditQuestionData) => {
    dispatch(
      updateQuestion({
        questionId,
        userid: currentUser?.userid!,
        ...data,
      }),
    );
    setOpenSnackbar(true);
    setTimeout(() => router.push(`/questions`), 1200);
  };

  if (loading) {
    return (
      <div className="so-loading">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="so-edit-wrapper">
      <div className="so-edit-container">
        <Typography variant="h5" className="so-edit-header">
          Edit your question
        </Typography>

        <Card className="so-edit-card">
          <div className="so-form-section">
            <Typography className="so-section-title">Title</Typography>
            <Typography className="so-section-desc">
              Update the title to better describe your question
            </Typography>

            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  placeholder="Edit your question title"
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
              Question details
            </Typography>
            <Typography className="so-section-desc">
              Improve or clarify your question description
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
              Modify tags to better categorize your question
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
                  onChange={(_, newValue) => field.onChange(newValue)}
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Update tags"
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
                Update question
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
            Back to <Link href={`/questions/${questionId}`}>Question</Link>
          </div>
        </Card>
      </div>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity="success">Question updated successfully ✨</Alert>
      </Snackbar>
    </div>
  );
}
