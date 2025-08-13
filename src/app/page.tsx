"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/utils/auth";
import { getUser } from "@/utils/auth";
import FullScreenLoader from "@/components/FullScreenLoader";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const token = getToken();

    if (!token) {
      router.replace("/login");
      return;
    }

    const checkRole = async () => {
      try {
        const user = getUser();

        if (!user) {
          router.replace("/login");
          return;
        }

        if (user.role === "ADMIN") {
          router.replace("/admin");
        } else {
          router.replace("/user");
        }
      } catch {
        router.replace("/login");
      }
    };

    checkRole();
  }, [router]);

  return <FullScreenLoader loading />;
}
