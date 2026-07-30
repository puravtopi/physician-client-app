
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "preload": [
      "chunk-F5YSJ3ON.js"
    ],
    "route": "/"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-F5YSJ3ON.js"
    ],
    "route": "/physicians"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-F5YSJ3ON.js"
    ],
    "route": "/physicians/*"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 979, hash: '0b4a2c417c47da53284289ce2df85862de49be6ce43a5a86a86584611f20c197', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1007, hash: 'c7dfccba4464cc08be58515fd01dafcacd430c039d92430983d4a225b619c8e1', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'physicians/index.html': {size: 60157, hash: 'f4702c842f1c4d7c42f245ad0dc3e18d1ea0b80327ab298af3c1256f040a77bc', text: () => import('./assets-chunks/physicians_index_html.mjs').then(m => m.default)},
    'index.html': {size: 92488, hash: 'fd06d5321d2bae6e901f3ad11cd2777e066c2eaecd5a18538565d5f7cc48d90d', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'styles-GSXLES4S.css': {size: 18151, hash: 'PBtZgEHjC08', text: () => import('./assets-chunks/styles-GSXLES4S_css.mjs').then(m => m.default)}
  },
};
