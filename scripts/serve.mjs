import http from 'node:http';
import fs from 'node:fs/promises';
import {createReadStream} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {routeFor} from './lib.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.xml':'application/xml; charset=utf-8','.txt':'text/plain; charset=utf-8','.webp':'image/webp','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.ico':'image/x-icon','.pdf':'application/pdf','.woff2':'font/woff2','.woff':'font/woff'};

export async function exactFile(directory,relative) {
  const candidate=path.resolve(directory,relative);
  if(path.relative(directory,candidate).startsWith('..')||path.isAbsolute(path.relative(directory,candidate)))return null;
  let current=directory;
  for(const part of path.relative(directory,candidate).split(path.sep)){
    const entries=await fs.readdir(current).catch(()=>[]);
    if(!entries.includes(part))return null;
    current=path.join(current,part);
  }
  return (await fs.stat(current).catch(()=>null))?.isFile()?current:null;
}

export async function createSiteServer(directory=path.join(root,'dist'), {cleanUrls=true}={}) {
  const config=JSON.parse(await fs.readFile(path.join(root,'vercel.json'),'utf8'));
  return http.createServer(async(request,response)=>{
    response.setHeader('Cache-Control','no-cache');
    for(const {key,value} of config.headers?.[0]?.headers||[])response.setHeader(key,value);
    try{
      const url=new URL(request.url,'http://localhost');const pathname=decodeURIComponent(url.pathname);
      if(!['GET','HEAD'].includes(request.method)){response.writeHead(405,{'Allow':'GET, HEAD'});response.end();return;}
      let redirect;
      if(cleanUrls&&pathname.endsWith('/')&&pathname!=='/')redirect=pathname.replace(/\/+$/,'');
      else if(cleanUrls&&pathname.endsWith('.html'))redirect=routeFor(pathname.slice(1));
      if(redirect){response.writeHead(308,{'Location':redirect+url.search});response.end();return;}
      const alias=config.redirects?.find(item=>!item.has&&item.source===pathname);
      if(alias){response.writeHead(308,{'Location':alias.destination+url.search});response.end();return;}
      let file=await exactFile(directory,pathname.slice(1)||'index.html');
      if(!file&&!path.extname(pathname)){
        if(cleanUrls)file=await exactFile(directory,pathname.slice(1)+'.html');
        file ||= await exactFile(directory,path.join(pathname.slice(1),'index.html'));
      }
      let status=200;
      if(!file){status=404;file=await exactFile(directory,'404.html');}
      if(!file){response.writeHead(404);response.end('Not found');return;}
      const stat=await fs.stat(file);let start=0,end=stat.size-1;
      response.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');
      response.setHeader('Accept-Ranges','bytes');
      if(request.headers.range&&status===200){
        const range=/^bytes=(\d*)-(\d*)$/.exec(request.headers.range);
        if(range){start=range[1]?Number(range[1]):Math.max(0,stat.size-Number(range[2]));end=range[1]&&range[2]?Math.min(end,Number(range[2])):end;}
        if(!range||start>end||start>=stat.size){response.writeHead(416,{'Content-Range':`bytes */${stat.size}`});response.end();return;}
        status=206;response.setHeader('Content-Range',`bytes ${start}-${end}/${stat.size}`);
      }
      response.setHeader('Content-Length',end-start+1);response.writeHead(status);
      if(request.method==='HEAD'){response.end();return;}
      const stream=createReadStream(file,{start,end});
      stream.on('error',()=>response.destroy());response.on('close',()=>stream.destroy());stream.pipe(response);
    }catch(error){if(!response.headersSent)response.writeHead(error instanceof URIError?400:500);response.end();}
  });
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const cleanUrls=!process.argv.includes('--static');
  const server=await createSiteServer(undefined,{cleanUrls});const port=Number(process.env.PORT||8765);
  server.listen(port,'127.0.0.1',()=>console.log(`DSTCC preview: http://127.0.0.1:${port}`));
}
