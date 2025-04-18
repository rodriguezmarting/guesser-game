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

const u = D("/api/shows/$id")({ GET: async ({ request: e, params: r }) => {
  console.info(`Fetching show by id=${r.id}... @`, e.url);
  try {
    const o = await i.get("someUrlOrJson" + r.id);
    return w({ id: o.data.id, name: o.data.name });
  } catch (o) {
    return console.error(o), w({ error: "Show not found" }, { status: 404 });
  }
} });

export { u as APIRoute };
//# sourceMappingURL=shows._id.mjs.map
