import { redirect } from "next/navigation";
import { adminEmailAllowlist } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export async function getCurrentAdmin() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user?.email) return null;
  const email = data.user.email.toLowerCase();
  if (!adminEmailAllowlist().has(email)) return null;
  const { data: adminRecord } = await supabase
    .from("admin_users")
    .select("user_id,email")
    .eq("user_id", data.user.id)
    .maybeSingle();
  if (!adminRecord) return null;
  return { user: data.user, adminRecord };
}

export async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login?error=unauthorized");
  return admin;
}
