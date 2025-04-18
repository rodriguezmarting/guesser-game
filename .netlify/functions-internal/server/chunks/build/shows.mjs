import i from 'redaxios';
import { D } from '../nitro/nitro.mjs';
import { w } from './json-853Virwn.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'vinxi/lib/invariant';
import 'vinxi/lib/path';
import 'node:url';
import 'node:async_hooks';
import 'react/jsx-runtime';
import '@tanstack/react-router';
import '@tanstack/react-router-devtools';
import 'node:stream';
import 'react-dom/server';
import 'node:stream/web';
import 'node:fs';
import 'node:path';
import 'node:crypto';

const f = D("/api/shows")({ GET: async ({ request: s }) => {
  console.info("Fetching shows... @", s.url);
  const t = (await i.get("someUrlOrJson")).data.slice(0, 10);
  return w(t.map((o) => ({ id: o.id, name: o.name })));
} });

export { f as APIRoute };
//# sourceMappingURL=shows.mjs.map
