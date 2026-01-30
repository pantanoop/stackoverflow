import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Answer {
  id: number;
  questionId: number;
  description: string;
  userId: string;
  text: string;
  userid: string;
  upvote?: number;
  downvote?: number;
  createdAt: string;
  updatedAt: string;
  isValid?: boolean;
}

interface AnswerState {
  answer: Answer | null;
  answers: Answer[];
  //   total: number;
  //   page: number;
  //   limit: number;
  loading: boolean;
  error: string | null;
}

const initialState: AnswerState = {
  answer: null,
  answers: [],
  //   total: 0,
  //   page: 1,
  //   limit: 5,
  loading: false,
  error: null,
};

// export const fetcAnswers = createAsyncThunk(
//   "questions/fetchAnswers",
//   async ({ limit, page }: { limit: number; page: number }) => {
//     const response = await axios.get(
//       `${API_BASE_URL}/answers?limit=${limit}&page=${page}`,
//     );

//     const data = response.data || {};
//     return {
//       questions: Array.isArray(data.questions) ? data.questions : [],
//       total: data.total || 0,
//       page: data.page || 1,
//       limit: data.limit || limit,
//     };
//   },
// );

export const fetchAnswersByQusetionId = createAsyncThunk(
  "questions/fetchAnswersByQusetionId",
  async ({ id }: { id: number }) => {
    console.log(id, "slice in fetch answers");
    const response = await axios.get(`${API_BASE_URL}/answers/${id}`);

    const data = response.data || {};
    return {
      question: data ? data : null,
    };
  },
);

export const PostAnswer = createAsyncThunk(
  "questions/addAnswer",
  async (answerData: any) => {
    console.log("add answer in slice:", answerData);
    const response = await axios.post(`${API_BASE_URL}/answers`, answerData);
    return response.data;
  },
);

const answerSlice = createSlice({
  name: "answers",
  initialState,
  reducers: {
    resetAnswers: (state) => {
      state.answers = [];
      //   state.page = 1;
      //   state.total = 0;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      //   .addCase(fetchQuestions.pending, (state) => {
      //     state.loading = true;
      //     state.error = null;
      //   })
      //   .addCase(
      //     fetchQuestions.fulfilled,
      //     (state, action: PayloadAction<any>) => {
      //       state.loading = false;
      //       state.questions = [...state.questions, ...action.payload.questions];
      //       state.total = action.payload.total;
      //       state.page = action.payload.page;
      //       state.limit = action.payload.limit;
      //     },
      //   )
      //   .addCase(fetchQuestions.rejected, (state, action) => {
      //     state.loading = false;
      //     state.error = action.error.message || "Failed to fetch questions";
      //   })
      .addCase(PostAnswer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(PostAnswer.fulfilled, (state, action: PayloadAction<Answer>) => {
        state.loading = false;
        state.answer = action.payload;
        console.log(state.answer, "slice");
      })
      .addCase(PostAnswer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to post answer";
      })
      .addCase(fetchAnswersByQusetionId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAnswersByQusetionId.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.answers = [...state.answers, action.payload];
        },
      )
      .addCase(fetchAnswersByQusetionId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to add question";
      });
  },
});

export const { resetAnswers } = answerSlice.actions;
export default answerSlice.reducer;
