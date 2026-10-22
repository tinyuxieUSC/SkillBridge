import {json,configured} from './_shared/security.mjs';
export default async(req)=>req.method==='GET'?json({configured:configured(),requires_code:true,service:'skillbridge-studio-pro',backend:'netlify-functions',model:process.env.SKILLBRIDGE_MODEL||'gemini-3.5-flash-lite'}):json({error:'Method not allowed'},405);
export const config={path:'/api/status'};
