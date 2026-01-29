"use client";

import { useState } from "react";
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
} from "@mui/material";

import "./ask.css";

const AskQuestion = z.object({
  title: z
    .string()
    .min(15, "title must contain 15 charcters min")
    .max(55, "question title can not exceed 55 characters"),
  description: z
    .string()
    .max(2000, "descriptioon of question can not exceed 2000 cgaracters"),
});

type AskQuestionData = z.infer<typeof AskQuestion>;

export default function AddProduct() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const currentUser = useAppSelector(
    (state) => state.authenticator.currentUser,
  );

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AskQuestionData>({
    resolver: zodResolver(AskQuestion),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const handleSaveQuestion = (data: AskQuestionData) => {
    const formData = new FormData();

    formData.append("productname", data.title);
    formData.append("description", data.description);

    // dispatch(addProduct(formData));

    setOpenSnackbar(true);

    setTimeout(() => {
      router.push("/dashboard");
    }, 1200);
  };

  return (
    <>
      <div className="add-product-container">
        <Card variant="outlined" className="add-product-card">
          <Typography variant="h5" className="add-product-title">
            Ask Your Question
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit(handleSaveQuestion)}
            className="add-product-form"
          >
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  value={field.value ?? ""}
                  label="Product Name"
                  error={!!errors.title}
                  helperText={errors.title?.message}
                />
              )}
            />

            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  value={field.value ?? ""}
                  label="Description"
                  multiline
                  rows={10}
                />
              )}
            />

            <Button variant="contained" type="submit" fullWidth>
              Save Question
            </Button>
          </Box>

          <Typography variant="body2" align="center" className="back-link">
            Back to Questions Page? <Link href="/questions">Dashboard</Link>
          </Typography>
        </Card>
      </div>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity="success">Product successfully added 🎉</Alert>
      </Snackbar>
    </>
  );
}
