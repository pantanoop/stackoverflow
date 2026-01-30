import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
export interface Question {
  id: number;
  title: string;
  description: string;
  tags: string[];
  type: "draft" | "public";
  userid: string;
  createdAt: string;
}

interface QuestionsState {
  questions: Question[];
  total: number;
  page: number;
  limit: number;
  loading: boolean;
  error: string | null;
}

const initialState: QuestionsState = {
  questions: [],
  total: 0,
  page: 1,
  limit: 5,
  loading: false,
  error: null,
};

export const fetchQuestions = createAsyncThunk(
  "questions/fetchQuestions",
  async ({ limit, page }: { limit: number; page: number }) => {
    const response = await axios.get(
      `${API_BASE_URL}/questions?limit=${limit}&page=${page}`,
    );

    const data = response.data || {};
    return {
      questions: Array.isArray(data.questions) ? data.questions : [],
      total: data.total || 0,
      page: data.page || 1,
      limit: data.limit || limit,
    };
  },
);

export const addQuestion = createAsyncThunk(
  "questions/addQuestion",
  async (questionData: any) => {
    console.log("add q in slice:", questionData);
    const response = await axios.post(
      `${API_BASE_URL}/questions`,
      questionData,
    );
    return response.data;
  },
);

const questionsSlice = createSlice({
  name: "questions",
  initialState,
  reducers: {
    resetQuestions: (state) => {
      state.questions = [];
      state.page = 1;
      state.total = 0;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchQuestions.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.questions = [...state.questions, ...action.payload.questions];
          state.total = action.payload.total;
          state.page = action.payload.page;
          state.limit = action.payload.limit;
        },
      )
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch questions";
      })
      .addCase(addQuestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        addQuestion.fulfilled,
        (state, action: PayloadAction<Question>) => {
          state.loading = false;
          state.questions = [action.payload, ...state.questions];
          state.total += 1;
        },
      )
      .addCase(addQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to add question";
      });
  },
});

export const { resetQuestions } = questionsSlice.actions;
export default questionsSlice.reducer;
