// app/page.tsx
import { User } from "@/types/user";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const userCookie = cookieStore.get("user")?.value;

  if (!token || !userCookie) {
    redirect("/login");
  }

  let user: User;
  try {
    user = JSON.parse(userCookie);
  } catch {
    redirect("/login");
  }

  if (user.role === "ADMIN") {
    redirect("/admin");
  } else if(user.role == 'USER') {
    redirect("/user");
  }
  else{
    redirect('/login');
  }
}
