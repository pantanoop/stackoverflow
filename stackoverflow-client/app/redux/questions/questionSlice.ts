import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { voteQuestionOrAnswer } from "@/app/redux/votes/voteSlice";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Question {
  id: number;
  title: string;
  description: string;
  tags: string[];
  type: "draft" | "public";
  userid: string;
  isBanned?: boolean;
  username: string;
  createdAt: string;
  upvotes: number;
  downvotes: number;
  myVote: "upvote" | "downvote" | null;
}

interface QuestionsState {
  question: Question | null;
  questions: Question[];
  total: number;
  page: number;
  limit: number;
  loading: boolean;
  error: string | null;
}

const initialState: QuestionsState = {
  question: null,
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
      questions: Array.isArray(data.formattedQuestions)
        ? data.formattedQuestions.map((q: any) => ({
            ...q,
            upvotes: q.upvotes || 0,
            downvotes: q.downvotes || 0,
            myVote: q.myVote || null,
          }))
        : [],
      total: data.total || 0,
      page: data.page || 1,
      limit: data.limit || limit,
    };
  },
);

export const fetchQuestionsAdmin = createAsyncThunk(
  "questions/fetchQuestionsAdmin",
  async ({ limit, page }: { limit: number; page: number }) => {
    const response = await axios.get(
      `${API_BASE_URL}/questions/admin?limit=${limit}&page=${page}`,
    );

    const data = response.data || {};
    return {
      questions: Array.isArray(data.formattedQuestions)
        ? data.formattedQuestions.map((q: any) => ({
            ...q,
            upvotes: q.upvotes || 0,
            downvotes: q.downvotes || 0,
            myVote: q.myVote || null,
          }))
        : [],
      total: data.total || 0,
      page: data.page || 1,
      limit: data.limit || limit,
    };
  },
);

export const fetchQuestionsDraft = createAsyncThunk(
  "questions/fetchQuestionsDraft",
  async (id: string | undefined) => {
    const response = await axios.get(`${API_BASE_URL}/questions/draft/${id}`);

    const data = response.data || {};
    return {
      questions: Array.isArray(data.formattedQuestions)
        ? data.formattedQuestions.map((q: any) => ({
            ...q,
            upvotes: q.upvotes || 0,
            downvotes: q.downvotes || 0,
            myVote: q.myVote || null,
          }))
        : [],
      total: data.total || 0,
      page: data.page || 1,
      limit: data.limit || 10,
    };
  },
);

export const fetchQuestionById = createAsyncThunk(
  "questions/fetchQuestionById",
  async ({ id }: { id: number }) => {
    // console.log(id, "slice");
    const response = await axios.get(`${API_BASE_URL}/questions/${id}`);
    const q = response.data || {};
    return {
      question: {
        ...q,
        upvotes: q.upvotes || 0,
        downvotes: q.downvotes || 0,
        myVote: q.myVote || null,
      },
    };
  },
);

export const toggleQuestionBan = createAsyncThunk(
  "questions/ban",
  async (id: number) => {
    // console.log(id, "slice");
    const response = await axios.patch(`${API_BASE_URL}/questions/${id}/ban`);
    const q = response.data || {};
    return {
      question: {
        ...q,
        upvotes: q.upvotes || 0,
        downvotes: q.downvotes || 0,
        myVote: q.myVote || null,
      },
    };
  },
);

export const addQuestion = createAsyncThunk(
  "questions/addQuestion",
  async (questionData: any) => {
    const response = await axios.post(
      `${API_BASE_URL}/questions`,
      questionData,
    );
    const q = response.data;
    return {
      ...q,
      upvotes: q.upvotes || 0,
      downvotes: q.downvotes || 0,
      myVote: q.myVote || null,
    };
  },
);

// Update existing question
export const updateQuestion = createAsyncThunk(
  "questions/updateQuestion",
  async (questionData: {
    questionId: number;
    userid: string;
    title: string;
    description: string;
    tags: string[];
    type: "draft" | "public";
  }) => {
    const response = await axios.patch(
      `${API_BASE_URL}/questions/${questionData.questionId}`,
      questionData,
    );
    const q = response.data;
    return {
      ...q,
      upvotes: q.upvotes || 0,
      downvotes: q.downvotes || 0,
      myVote: q.myVote || null,
    };
  },
);

export const PostDaftPublic = createAsyncThunk(
  "questions/updateQuestionPublic",
  async (id: number) => {
    const response = await axios.patch(
      `${API_BASE_URL}/questions/markPublic/${id}`,
    );
    const q = response.data;
    return {
      ...q,
      upvotes: q.upvotes || 0,
      downvotes: q.downvotes || 0,
      myVote: q.myVote || null,
    };
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
    resetCurrentQuestion: (state) => {
      state.question = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Questions
      .addCase(fetchQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchQuestions.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.questions = action.payload.questions;
          state.total = action.payload.total;
          state.page = action.payload.page;
          state.limit = action.payload.limit;
        },
      )
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch questions";
      })
      .addCase(fetchQuestionsAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchQuestionsAdmin.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.questions = action.payload.questions;
          state.total = action.payload.total;
          state.page = action.payload.page;
          state.limit = action.payload.limit;
        },
      )
      .addCase(fetchQuestionsAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch questions";
      })

      .addCase(fetchQuestionsDraft.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchQuestionsDraft.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.questions = action.payload.questions;
          state.total = action.payload.total;
          state.page = action.payload.page;
          state.limit = action.payload.limit;
        },
      )
      .addCase(fetchQuestionsDraft.rejected, (state, action) => {
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
      })
      .addCase(toggleQuestionBan.fulfilled, (state, action) => {
        console.log(action.payload);
        const updated = action.payload;

        const index = state.questions.findIndex((q) => q.id === updated?.id);

        if (index !== -1) {
          state.questions[index].isBanned = updated.isBanned;
        }
      })

      // Fetch single question
      .addCase(fetchQuestionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuestionById.fulfilled, (state, action) => {
        state.loading = false;
        // console.log(action.payload);
        state.question = action.payload.question;
      })
      .addCase(fetchQuestionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch question";
      })
      .addCase(PostDaftPublic.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        PostDaftPublic.fulfilled,
        (state, action: PayloadAction<Question>) => {
          state.loading = false;
          state.question = action.payload;

          const index = state.questions.findIndex(
            (q) => q.id === action.payload.id,
          );
          if (index !== -1) state.questions[index] = action.payload;
        },
      )
      .addCase(PostDaftPublic.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update question";
      })

      // Update Question
      .addCase(updateQuestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateQuestion.fulfilled,
        (state, action: PayloadAction<Question>) => {
          state.loading = false;
          state.question = action.payload;

          const index = state.questions.findIndex(
            (q) => q.id === action.payload.id,
          );
          if (index !== -1) state.questions[index] = action.payload;
        },
      )
      .addCase(updateQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update question";
      })
      .addCase(voteQuestionOrAnswer.fulfilled, (state, action) => {
        const { entityType, entityId, voteType } = action.payload;

        if (entityType === "question") {
          const qIndex = state.questions.findIndex((q) => q.id === entityId);
          if (qIndex !== -1) {
            const question = state.questions[qIndex];

            if (question.myVote === voteType) {
              // Same vote clicked again → remove vote
              if (voteType === "upvote")
                question.upvotes = Math.max(0, question.upvotes - 1);
              else question.downvotes = Math.max(0, question.downvotes - 1);
              question.myVote = null;
            } else {
              // Opposite vote clicked → remove previous vote first
              if (question.myVote === "upvote")
                question.upvotes = Math.max(0, question.upvotes - 1);
              if (question.myVote === "downvote")
                question.downvotes = Math.max(0, question.downvotes - 1);

              // Add new vote
              if (voteType === "upvote") question.upvotes += 1;
              if (voteType === "downvote") question.downvotes += 1;

              question.myVote = voteType;
            }
          }
        }
      });
  },
});

export const { resetQuestions, resetCurrentQuestion } = questionsSlice.actions;
export default questionsSlice.reducer;
