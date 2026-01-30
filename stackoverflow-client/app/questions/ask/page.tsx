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
  Box,
  Typography,
  Card,
  Snackbar,
  Alert,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Chip,
  Stack,
  CircularProgress,
} from "@mui/material";
import { fetchTags } from "../../redux/tags/tagSlice";
import { addQuestion } from "@/app/redux/questions/questionSlice";

import "./ask.css";
import TextEditor from "@/app/components/Editor/TextEditor";

const AskQuestionSchema = z.object({
  title: z.string().min(15).max(55),
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
  const { tags, loading } = useAppSelector((state) => state.tags);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [tagOpen, setTagOpen] = useState(false);
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
    console.log(payload, "fgfgfgfg");
    dispatch(addQuestion(payload));
    setOpenSnackbar(true);
    setTimeout(() => router.push("/questions"), 1200);
  };

  return (
    <>
      <div className="add-product-container">
        <Card variant="outlined" className="add-product-card">
          <Typography variant="h5" className="add-product-title">
            Ask Your Question
          </Typography>

          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Question Title"
                  error={!!errors.title}
                  helperText={errors.title?.message}
                  fullWidth
                  margin="normal"
                />
              )}
            />

            {/* <Controller
              name="description"
              control={control}
              render={({ field }) => (
                // <TextField
                //   {...field}
                //   label="Question Description"
                //   multiline
                //   rows={8}
                //   error={!!errors.description}
                //   helperText={errors.description?.message}
                //   fullWidth
                //   margin="normal"
                // />
                <TextEditor
                  {...field}
                  label="Question Description"
                  error={!!errors.description}
                  helperText={errors.description?.message}
                />
              )}
            /> */}

            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextEditor value={field.value} onChange={field.onChange} />
              )}
            />

            <Controller
              name="tags"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth margin="normal" error={!!errors.tags}>
                  <InputLabel>Tags</InputLabel>

                  {loading ? (
                    <Box display="flex" justifyContent="center" p={2}>
                      <CircularProgress size={22} />
                    </Box>
                  ) : (
                    <Select
                      {...field}
                      multiple
                      open={tagOpen}
                      onOpen={() => setTagOpen(true)}
                      onClose={() => setTagOpen(false)}
                      label="Tags"
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            maxHeight: 240,
                          },
                        },
                      }}
                      onChange={(e) => {
                        field.onChange(e);
                        setTagOpen(false);
                      }}
                      renderValue={(selected) => (
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                          {selected.map((value) => (
                            <Chip key={value} label={value} />
                          ))}
                        </Stack>
                      )}
                    >
                      {tags.map((tag: any) => (
                        <MenuItem key={tag.id} value={tag.tagName}>
                          {tag.tagName}
                        </MenuItem>
                      ))}
                    </Select>
                  )}

                  <Typography variant="caption" color="error">
                    {errors.tags?.message}
                  </Typography>
                </FormControl>
              )}
            />

            <Stack direction="row" spacing={2} mt={2}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleSubmit((data) =>
                  onSubmit({ ...data, type: "draft" }),
                )}
              >
                Save Draft
              </Button>

              <Button
                fullWidth
                variant="outlined"
                onClick={handleSubmit((data) =>
                  onSubmit({ ...data, type: "public" }),
                )}
              >
                Ask Public
              </Button>
            </Stack>
          </Box>

          <Typography align="center" mt={2}>
            Back to <Link href="/questions">Questions</Link>
          </Typography>
        </Card>
      </div>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity="success">Question submitted successfully 🚀</Alert>
      </Snackbar>
    </>
  );
}
