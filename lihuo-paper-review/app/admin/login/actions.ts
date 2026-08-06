"use server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { adminEmailAllowlist } from "@/lib/env";

export async function login(formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  if (!adminEmailAllowlist().has(email)) redirect("/admin/login?error=not_allowed");
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect(`/admin/login?error=${encodeURIComponent(error.message)}`);
  redirect("/admin");
}

export async function logout() { const supabase = await createClient(); await supabase.auth.signOut(); redirect("/admin/login"); }
