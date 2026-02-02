import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const voteQuestionOrAnswer = createAsyncThunk(
  "vote/voteEntity",
  async ({
    userId,
    entityType,
    entityId,
    voteType,
  }: {
    userId: string;
    entityType: "question" | "answer";
    entityId: number;
    voteType: "upvote" | "downvote";
  }) => {
    // console.log("Voting hit slice:", userId, entityId, entityType, voteType);

    const response = await axios.post(`${API_BASE_URL}/votes`, {
      userId,
      entityType,
      entityId,
      voteType,
    });

    return {
      entityType,
      entityId,
      voteType: response.data.voteType || null,
      message: response.data.message,
    };
  },
);
