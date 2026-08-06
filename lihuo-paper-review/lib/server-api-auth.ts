import { NextResponse } from "next/server";
import { adminEmailAllowlist } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
export async function requireAdminApi(){const supabase=await createClient();const {data,error}=await supabase.auth.getUser();const user=data.user;if(error||!user?.email)return {ok:false as const,response:NextResponse.json({error:'Unauthorized'},{status:401})};if(!adminEmailAllowlist().has(user.email.toLowerCase()))return {ok:false as const,response:NextResponse.json({error:'Forbidden'},{status:403})};const rec=await supabase.from('admin_users').select('user_id').eq('user_id',user.id).maybeSingle();if(!rec.data)return {ok:false as const,response:NextResponse.json({error:'Admin record missing'},{status:403})};return {ok:true as const,user};}
