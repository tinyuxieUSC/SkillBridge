export const SOURCE_IDS=['summary','resumePdf','linkedin'];
export function validateDocuments(value){
  if(value===undefined)return [];
  if(!Array.isArray(value)||value.length>2)throw new Error('Invalid PDF attachments.');
  let bytes=0;const ids=new Set();
  return value.map(d=>{
    if(!d||!['resumePdf','linkedin'].includes(d.id)||ids.has(d.id)||typeof d.data!=='string'||d.data.length>2800000||!/^JVBERi0[A-Za-z0-9+/]*={0,2}$/.test(d.data))throw new Error('Invalid PDF attachment. Please choose a PDF file.');
    ids.add(d.id);const raw=Buffer.from(d.data,'base64');bytes+=raw.length;
    if(raw.length>2*1024*1024||bytes>3*1024*1024)throw new Error('PDFs must be under 2 MB each and 3 MB combined.');
    if(raw.subarray(0,5).toString()!=='%PDF-'||/\/Encrypt\b/.test(raw.toString('latin1')))throw new Error('Invalid or password-protected PDF. Export an unlocked copy.');
    return {id:d.id,name:String(d.name||'document.pdf').slice(0,100),data:d.data};
  });
}
export function prepareScan(payload){
  if(typeof payload.job!=='string'||!payload.job.trim()||payload.job.length>12000)throw new Error('Job description required, max 12,000 characters.');
  const documents=validateDocuments(payload.documents);
  const sources=Array.isArray(payload.sources)?payload.sources:typeof payload.resume==='string'&&payload.resume.trim()?[{id:'summary',text:payload.resume}]:[];
  if(sources.length>2)throw new Error('Invalid text sources.');
  const seen=new Set();const clean=sources.map(s=>{
    if(!s||!['summary','linkedin'].includes(s.id)||seen.has(s.id)||typeof s.text!=='string'||s.text.length>16000)throw new Error('Invalid text source, max 16,000 characters each.');
    seen.add(s.id);return {id:s.id,text:s.text.trim()};
  }).filter(s=>s.text);
  if(!clean.length&&!documents.length)throw new Error('Add a summary, a resume PDF, or LinkedIn profile content. A URL alone is not reviewed evidence.');
  return {documents,sourceIds:[...new Set([...clean.map(s=>s.id),...documents.map(d=>d.id)])],text:{job:payload.job,sources:clean,documents:documents.map(({id,name})=>({id,name}))}};
}
export function linkedinUrl(value){
  let u;try{u=new URL(value)}catch{throw new Error('Enter a valid LinkedIn profile URL.');}
  if(u.protocol!=='https:'||!['linkedin.com','www.linkedin.com'].includes(u.hostname)||u.username||u.password||u.port||!/^\/in\/[a-zA-Z0-9_-]{3,100}\/?$/.test(u.pathname))throw new Error('Use an https://www.linkedin.com/in/profile-name/ link.');
  return 'https://www.linkedin.com'+u.pathname.replace(/\/$/,'')+'/';
}
export async function importLinkedin(value,fetcher=fetch){
  const url=linkedinUrl(value);const blocked='LinkedIn did not provide readable public profile content. Paste your About, Experience, Education and Skills below, or upload your LinkedIn profile PDF.';
  const ctl=new AbortController(),timer=setTimeout(()=>ctl.abort(),8000);
  try{
    const r=await fetcher(url,{redirect:'manual',signal:ctl.signal,headers:{Accept:'text/html'}});
    if(!r.ok||!r.headers.get('content-type')?.includes('text/html'))throw new Error(blocked);
    const reader=r.body.getReader();let html='',size=0;const decoder=new TextDecoder();
    try{while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>500000)throw new Error(blocked);html+=decoder.decode(value,{stream:true});}}finally{await reader.cancel().catch(()=>{});}
    const main=html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1]||'';
    const text=main.replace(/<(script|style|nav|footer|header)\b[^>]*>[\s\S]*?<\/\1>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&nbsp;|&#160;/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/\s+/g,' ').trim();
    if(text.length<350||!/(experience|education|about)/i.test(text)||/sign in to view|join to view|security verification|authwall/i.test(text))throw new Error(blocked);
    if(text.length>16000)throw new Error('The public profile is too long. Paste the relevant sections below (up to 16,000 characters).');
    return {url,text};
  }catch(e){if(e.name==='AbortError')throw new Error(blocked);throw e;}finally{clearTimeout(timer);}
}
