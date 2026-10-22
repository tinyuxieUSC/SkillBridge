import {timingSafeEqual} from 'node:crypto';
const HEAD={'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'};
export function json(o,status=200){return new Response(JSON.stringify(o),{status,headers:HEAD})}
export function configured(){return Boolean(process.env.GEMINI_API_KEY && process.env.SKILLBRIDGE_ACCESS_CODE)}
export function auth(req){if(!configured())return json({error:'Gemini backend not configured. Set GEMINI_API_KEY and SKILLBRIDGE_ACCESS_CODE in Netlify; redeploy.'},503);const a=Buffer.from(String(process.env.SKILLBRIDGE_ACCESS_CODE)),b=Buffer.from(req.headers.get('X-SkillBridge-Code')||'');if(a.length===0||a.length>256||a.length!==b.length||!timingSafeEqual(a,b))return json({error:'Team access code is missing or incorrect.'},401);return null}
export async function body(req){if(!req.headers.get('content-type')?.includes('application/json'))throw new Error('Expected JSON request.');const txt=await req.text();if(txt.length>32000)throw new Error('Request is too long');const v=JSON.parse(txt);if(!v||typeof v!=='object'||Array.isArray(v))throw new Error('Invalid JSON object');return v}
export function publicError(err){let msg=String(err?.message||'AI temporarily unavailable').slice(0,200);return json({error:msg},/request|too long|Invalid|Expected/i.test(msg)?400:502)}
