"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  toggleUserBan,
} from "../../../redux/auth/authenticateSlice";
import {
  Typography,
  Switch,
  CircularProgress,
  Paper,
  Button,
} from "@mui/material";
import { useRouter } from "next/navigation";

import "./UserList.css";

const LIMIT = 5;

export default function UsersList() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { users, total, loading } = useSelector(
    (state: any) => state.authenticator,
  );
  console.log(users, "ui ");

  const [page, setPage] = useState(1);

  const observer = useRef<IntersectionObserver | null>(null);
  const hasMore = users?.length < total;

  const lastUserRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading || !hasMore) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore],
  );

  useEffect(() => {
    dispatch(fetchUsers({ page, limit: LIMIT }) as any);
  }, [dispatch, page]);

  function handleToggleBan(userid: number) {
    dispatch(toggleUserBan(userid) as any);
  }

  return (
    <div className="users-container">
      <div className="users-header">
        <Typography variant="h5">👤 Users</Typography>
        <Button
          variant="outlined"
          onClick={() => router.push("/dashboard/admin")}
        >
          Home
        </Button>
      </div>

      <div className="users-list">
        {users?.map((user: any, index: number) => {
          const isLast = index === users?.length - 1;

          return (
            <Paper
              key={`${user.userid}-${index}`}
              ref={isLast ? lastUserRef : null}
              className={`user-card ${user.isBanned ? "banned" : ""}`}
            >
              <div className="user-info">
                <Typography fontWeight="bold">{user.username}</Typography>
                <Typography variant="body2">{user.useremail}</Typography>
                <Typography variant="caption">Role: User</Typography>
              </div>

              {user.role !== "admin" && (
                <div className="user-action">
                  <Typography variant="body2">
                    {user.isBanned ? "Banned" : "Active"}
                  </Typography>
                  <Switch
                    checked={user.isBanned || false}
                    onChange={() => handleToggleBan(user.userid)}
                  />
                </div>
              )}
            </Paper>
          );
        })}
      </div>

      {loading && (
        <div className="loader">
          <CircularProgress />
        </div>
      )}

      {!hasMore && !loading && (
        <Typography align="center" mt={2}>
          No more users
        </Typography>
      )}
    </div>
  );
}
