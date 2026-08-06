import type { SupabaseClient } from "@supabase/supabase-js";
import type { CaseFormPayload } from "@/lib/types";
export async function persistCaseBundle(admin:SupabaseClient,caseId:string,payload:CaseFormPayload,userId:string,action:string){
  const outputs=[{case_id:caseId,review_type:'ORDINARY_AI',...payload.ordinary_review,review_date:payload.ordinary_review.review_date||null},{case_id:caseId,review_type:'LIHUO',...payload.lihuo_review,review_date:payload.lihuo_review.review_date||null}];
  const {error:o}=await admin.from('review_outputs').upsert(outputs,{onConflict:'case_id,review_type'});if(o)throw o;
  const {error:g}=await admin.from('general_review_states').upsert({case_id:caseId,...payload.general_review_states},{onConflict:'case_id'});if(g)throw g;
  if(payload.case.case_type==='MEDICAL_PAPER_REVIEW'&&payload.medical_review_state){const {error:m}=await admin.from('medical_review_states').upsert({case_id:caseId,...payload.medical_review_state},{onConflict:'case_id'});if(m)throw m;}else{await admin.from('medical_review_states').delete().eq('case_id',caseId);}
  const {error:c}=await admin.from('comparison_summaries').upsert({case_id:caseId,...payload.comparison_summary},{onConflict:'case_id'});if(c)throw c;
  await admin.from('audit_logs').insert({actor_id:userId,action,entity_type:'CASE',entity_id:caseId,metadata:{publication_status:payload.case.publication_status,case_type:payload.case.case_type}});
}
