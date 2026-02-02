// redux/replies/replySlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Fetch replies for an answer
export const fetchReplies = createAsyncThunk(
  "replies/fetchReplies",
  async (answerId: number) => {
    const res = await axios.get(`${API_BASE_URL}/answer-replies/${answerId}`);
    return res.data;
  },
);

// Post a new reply
export const postReply = createAsyncThunk(
  "replies/postReply",
  async (data: {
    answerId: number;
    parentReplyId?: number;
    text: string;
    userId: string;
    username: string;
  }) => {
    const res = await axios.post(`${API_BASE_URL}/answer-replies`, data);
    return res.data;
  },
);

interface Reply {
  id: number;
  answerId: number;
  parentReplyId?: number | null;
  text: string;
  userId: string;
  username: string;
  createdAt: string;
  updatedAt: string;
  childReplies?: Reply[];
}

interface ReplyState {
  replies: Reply[];
  loading: boolean;
}

const initialState: ReplyState = { replies: [], loading: false };

const replySlice = createSlice({
  name: "replies",
  initialState,
  reducers: {
    resetReplies: (state) => {
      state.replies = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReplies.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchReplies.fulfilled,
        (state, action: PayloadAction<Reply[]>) => {
          state.loading = false;
          state.replies = action.payload;
        },
      )
      .addCase(fetchReplies.rejected, (state) => {
        state.loading = false;
      })
      .addCase(postReply.fulfilled, (state, action: PayloadAction<Reply>) => {
        const reply = action.payload;
        if (reply.parentReplyId) {
          // Nested reply
          const parent = findReply(state.replies, reply.parentReplyId);
          if (parent) {
            parent.childReplies = parent.childReplies || [];
            parent.childReplies.push(reply);
          }
        } else {
          state.replies.push(reply);
        }
      });
  },
});

function findReply(replies: Reply[], id: number): Reply | null {
  for (const r of replies) {
    if (r.id === id) return r;
    if (r.childReplies) {
      const found = findReply(r.childReplies, id);
      if (found) return found;
    }
  }
  return null;
}

export const { resetReplies } = replySlice.actions;
export default replySlice.reducer;
