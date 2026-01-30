"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppSelector } from "../../hooks/hooks";

export default function AskQuestionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { currentUser } = useAppSelector((state) => state.authenticator);

  useEffect(() => {
    if (!currentUser) router.replace("/auth/login");
  }, [currentUser, router]);

  if (!currentUser) return null;

  return children;
}
