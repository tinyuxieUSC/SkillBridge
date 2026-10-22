import {timingSafeEqual} from 'node:crypto';

const headers = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
};
export function json(body,status=200){return new Response(JSON.stringify(body),{status,headers});}
export function ready(){return Boolean(process.env.GEMINI_API_KEY && process.env.SKILLBRIDGE_ACCESS_CODE);}
export function verified(req){
  const expected=process.env.SKILLBRIDGE_ACCESS_CODE||'';
  const given=req.headers.get('X-SkillBridge-Code')||'';
  if(!expected || !given || expected.length>256 || given.length>256)return false;
  const a=Buffer.from(expected), b=Buffer.from(given);
  return a.length===b.length && timingSafeEqual(a,b);
}
export function checkAccess(req){
  if(!ready())return json({error:'The AI backend is not configured yet. Set GEMINI_API_KEY and SKILLBRIDGE_ACCESS_CODE in Netlify environment variables.'},503);
  if(!verified(req))return json({error:'Incorrect or missing team access code. Enter your access code on the SkillBridge website.'},401);
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
export async function askAI(instructions,payload,format){
  // Free-tier eligible by model pricing, subject to account quotas and availability.
  const model=process.env.SKILLBRIDGE_MODEL||'gemini-3.5-flash-lite';
  if(!/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(model))throw new Error('Invalid Gemini model setting.');
  const controller=new AbortController(), timer=setTimeout(()=>controller.abort(),25000);
  try{
    const response=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,{
      method:'POST',signal:controller.signal,
      headers:{'x-goog-api-key':process.env.GEMINI_API_KEY,'Content-Type':'application/json'},
      body:JSON.stringify({
        systemInstruction:{parts:[{text:instructions}]},
        contents:[{role:'user',parts:[{text:JSON.stringify(payload)}]}],
        generationConfig:{
          maxOutputTokens:2300,
          responseFormat:{text:{mimeType:'application/json',schema:format.schema}}
        }
      })
    });
    if(!response.ok){
      const failure=await response.json().catch(()=>({}));
      const reason=String(failure.error?.message||'');
      if(/API key not valid|API_KEY_INVALID|API key expired/i.test(reason))throw new Error('Gemini API key is invalid or expired. Replace GEMINI_API_KEY in Netlify and redeploy.');
      if(/responseFormat|response_format|Unknown name/i.test(reason))throw new Error('Gemini request format is unsupported by this API.');
      if(/billing|location|country|region/i.test(reason))throw new Error('Gemini is unavailable for this project billing configuration or region.');
      if(response.status===429)throw new Error('Gemini free-tier usage limit reached. Try again when your quota resets.');
      if(response.status===401||response.status===403)throw new Error('Gemini key invalid, access denied, or model not available to this project.');
      if(response.status===404)throw new Error('Gemini model unavailable. Set SKILLBRIDGE_MODEL to another available free-tier model.');
      if(response.status===503)throw new Error('Gemini is temporarily unavailable. Try again later.');
      throw new Error(`Gemini request failed (${response.status}).`);
    }
    const data=await response.json();
    const raw=(data.candidates||[]).flatMap(c=>c.content?.parts||[]).map(p=>p.text||'').join('');
    if(!raw)throw new Error('Gemini returned no readable response.');
    return JSON.parse(raw);
  } finally {clearTimeout(timer);}
}
export function errorResponse(e){
  // Never send user inputs, provider error payloads, or API keys back to the browser.
  const msg=e instanceof SyntaxError?'Invalid AI JSON output.':String(e?.message||'Unexpected error');
  const status=/large|Invalid|Expected|Please/.test(msg)?400:502;
  return json({error:msg.length>190?msg.slice(0,190):msg},status);
}
