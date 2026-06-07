import 'dotenv/config';
import app from "./app.js";

// #region agent log
fetch('http://127.0.0.1:7508/ingest/80ad45cf-6c19-41c9-9065-208fa26788c2',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'4bd2e9'},body:JSON.stringify({sessionId:'4bd2e9',location:'index.js:startup',message:'backend index.js starting',data:{argv:process.argv,cwd:process.cwd(),port:process.env.PORT},timestamp:Date.now(),hypothesisId:'A',runId:'post-fix-v2'})}).catch(()=>{});
// #endregion

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});