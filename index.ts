import http from 'node:http';
import fsPromise from 'node:fs/promises';
import path from 'node:path';
import url from 'node:url';

const INDEX_HTML_PATH = 'index.html'
const extensionToContentTypeMap: Record<string, string> = {
  ['.html']: 'text/html',
  ['.css']: 'text/css',
  ['.js']: 'text/javascript',
}
const server = http.createServer()

function getContentType(filePath: string): string {
  const extname: string = path.extname(filePath)
  return extensionToContentTypeMap[extname] || ''
} 

server.on('request', async (req, res) => {
  if (!req.url) {
    return;
  }
  const url = new URL(req.url, `http://${req.headers.host}`)
  console.log(new Date().toLocaleString(), url.pathname)
  let filePath = path.join('./', url.pathname)
  if (filePath === './') {
    filePath = INDEX_HTML_PATH
  }
  
  res.writeHead(200)
  let content: Buffer | string
  try {
    content = await fsPromise.readFile(filePath)
  } catch {
    console.log(`${new Date().toLocaleTimeString()}: An error occurred when reading request from ${url.toString()}`)
    return;
  }
  res.write(content)
  res.end()
})

server.listen(80, () => {
  console.log('start listening');
})
