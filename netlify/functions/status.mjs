import {json,ready,verified} from './_shared/common.mjs';
export default async (req)=>{
 if(req.method==='GET')return json({configured:ready(),requires_code:true});
 if(req.method==='POST'){
  if(!ready())return json({error:'Configure API key and team access code on Netlify.'},503);
  if(!verified(req))return json({error:'Incorrect team access code.'},401);
  return json({ai_enabled:true});
 }
 return json({error:'Method not allowed.'},405);
};
export const config={path:'/api/status'};
