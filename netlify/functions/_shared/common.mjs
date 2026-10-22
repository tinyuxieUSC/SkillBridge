import {timingSafeEqual} from 'node:crypto';

const headers = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
};
export function json(body,status=200){return new Response(JSON.stringify(body),{status,headers});}
export function ready(){return Boolean(process.env.OPENAI_API_KEY && process.env.SKILLBRIDGE_ACCESS_CODE);}
export function verified(req){
  const expected=process.env.SKILLBRIDGE_ACCESS_CODE||'';
  const given=req.headers.get('X-SkillBridge-Code')||'';
  if(!expected || !given || expected.length>256 || given.length>256) return false;
  const a=Buffer.from(expected);const b=Buffer.from(given);
  return a.length===b.length && timingSafeEqual(a,b);
}
export function checkAccess(req){
  if(!ready())return json({error:'The AI backend is not configured yet. Set OPENAI_API_KEY and SKILLBRIDGE_ACCESS_CODE in Netlify environment variables.'},503);
  if(!verified(req))return json({error:'Incorrect or missing team access code. Enter the code on the SkillBridge website.'},401);
  return null;
}
export async function readBody(req){
  if(!req.headers.get('content-type')?.includes('application/json'))throw new Error('Please send JSON.');
  const raw=await req.text();
  if(raw.length>35000)throw new Error('Input is too large.');
  const data=JSON.parse(raw);
  if(!data||Array.isArray(data)||typeof data!=='object')throw new Error('Expected JSON object.');
  return data;
}
function outputText(result){
 const a=(result.output||[]).filter(x=>x.type==='message').flatMap(x=>(x.content||[]).filter(y=>y.type==='output_text').map(y=>y.text||''));
 if(!a.length)throw new Error('AI returned no structured text.');
 return a.join('');
}
export async function askAI(instructions,payload,format){
 const model=process.env.SKILLBRIDGE_MODEL||'gpt-4o-mini';
 const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),24000);
 try{
  const response=await fetch('https://api.openai.com/v1/responses',{
    method:'POST',signal:controller.signal,
    headers:{'Authorization':`Bearer ${process.env.OPENAI_API_KEY}`,'Content-Type':'application/json'},
    body:JSON.stringify({model,instructions,input:JSON.stringify(payload),store:false,
      text:{format},max_output_tokens:1500})
  });
  if(!response.ok){const err=await response.text();
   if(response.status===429)throw new Error('AI rate limit or quota reached.');
   if(response.status===401)throw new Error('OpenAI API key is invalid.');
   throw new Error(`OpenAI request failed (${response.status}).`);
  }
  return JSON.parse(outputText(await response.json()));
 }finally{clearTimeout(timer);}
}
export function errorResponse(e){
 // Deliberately avoid leaking sensitive provider responses or user content.
 const msg=e instanceof SyntaxError?'Invalid JSON input.':(String(e?.message||'Unexpected error'));
 const status=/large|Invalid|Expected|Please/.test(msg)?400:502;
 return json({error:msg.length>190?msg.slice(0,190):msg},status);
}
