import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { voteQuestionOrAnswer } from "@/app/redux/votes/voteSlice";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Answer {
  id: number;
  questionId: number;
  answer: string;
  userId: string;
  username: string;
  createdAt: string;
  updatedAt: string;
  upvotes: number;
  downvotes: number;
  myVote: "upvote" | "downvote" | null;
}

interface AnswerState {
  answer: Answer | null;
  answers: Answer[];
  loading: boolean;
  error: string | null;
}

const initialState: AnswerState = {
  answer: null,
  answers: [],
  loading: false,
  error: null,
};

// Fetch all answers for a question
export const fetchAnswersByQusetionId = createAsyncThunk(
  "answer/fetchAnswersByQusetionId",
  async ({ id }: { id: number }) => {
    const response = await axios.get(`${API_BASE_URL}/answers/${id}`);
    const data = response.data || [];
    return Array.isArray(data)
      ? data.map((a) => ({
          ...a,
          upvotes: a.upvotes || 0,
          downvotes: a.downvotes || 0,
          myVote: a.myVote || null,
        }))
      : [];
  },
);

// Post a new answer
export const PostAnswer = createAsyncThunk(
  "answer/addAnswer",
  async (answerData: any) => {
    const response = await axios.post(`${API_BASE_URL}/answers`, answerData);
    const a = response.data;
    return {
      ...a,
      upvotes: a.upvotes || 0,
      downvotes: a.downvotes || 0,
      myVote: a.myVote || null,
    };
  },
);

// Update an existing answer
export const updateAnswer = createAsyncThunk(
  "answer/updateAnswer",
  async (data: { answerId: number; userId: string; answer: string }) => {
    const response = await axios.patch(
      `${API_BASE_URL}/answers/${data.answerId}`,
      data,
    );
    const a = response.data;
    return {
      ...a,
      upvotes: a.upvotes || 0,
      downvotes: a.downvotes || 0,
      myVote: a.myVote || null,
    };
  },
);

const answerSlice = createSlice({
  name: "answers",
  initialState,
  reducers: {
    resetAnswers: (state) => {
      state.answers = [];
      state.error = null;
    },
    // resetCurrentQuestion: (state) => {
    //   state.question = null;
    // },
  },
  extraReducers: (builder) => {
    builder
      // Post Answer
      .addCase(PostAnswer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(PostAnswer.fulfilled, (state, action: PayloadAction<Answer>) => {
        state.loading = false;
        state.answers.push(action.payload);
      })
      .addCase(PostAnswer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to post answer";
      })

      // Fetch answers by question id
      .addCase(fetchAnswersByQusetionId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAnswersByQusetionId.fulfilled,
        (state, action: PayloadAction<Answer[]>) => {
          state.loading = false;
          state.answers = action.payload;
        },
      )
      .addCase(fetchAnswersByQusetionId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch answers";
      })

      // Update answer
      .addCase(updateAnswer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateAnswer.fulfilled,
        (state, action: PayloadAction<Answer>) => {
          state.loading = false;
          const index = state.answers.findIndex(
            (a) => a.id === action.payload.id,
          );
          if (index !== -1) state.answers[index] = action.payload;
        },
      )
      .addCase(updateAnswer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update answer";
      })

      // Handle votes
      .addCase(voteQuestionOrAnswer.fulfilled, (state, action) => {
        const { entityType, entityId, voteType } = action.payload;

        if (entityType === "answer") {
          const aIndex = state.answers.findIndex((a) => a.id === entityId);
          if (aIndex !== -1) {
            const answer = state.answers[aIndex];

            if (answer.myVote === voteType) {
              // same vote clicked → remove it
              if (voteType === "upvote")
                answer.upvotes = Math.max(0, answer.upvotes - 1);
              else answer.downvotes = Math.max(0, answer.downvotes - 1);
              answer.myVote = null;
            } else {
              // opposite vote clicked → remove previous vote first
              if (answer.myVote === "upvote")
                answer.upvotes = Math.max(0, answer.upvotes - 1);
              if (answer.myVote === "downvote")
                answer.downvotes = Math.max(0, answer.downvotes - 1);

              // then add new vote
              if (voteType === "upvote") answer.upvotes += 1;
              if (voteType === "downvote") answer.downvotes += 1;

              answer.myVote = voteType;
            }
          }
        }
      });
  },
});

export const { resetAnswers } = answerSlice.actions;
export default answerSlice.reducer;
