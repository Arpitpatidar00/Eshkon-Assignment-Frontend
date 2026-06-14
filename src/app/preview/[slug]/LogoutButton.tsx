"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleLogout} aria-label="Sign out">
      <LogOut className="mr-2 h-4 w-4" />
      Sign Out
    </Button>
  );
}
