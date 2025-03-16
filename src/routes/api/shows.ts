import { json } from '@tanstack/react-start'
import { createAPIFileRoute } from '@tanstack/react-start/api'
import axios from 'redaxios'
import type { Show } from '../../utils/shows'

export const APIRoute = createAPIFileRoute('/api/shows')({
  GET: async ({ request }) => {
    console.info('Fetching shows... @', request.url)
    // TODO: Replace this with the right API call
    const res = await axios.get<Array<Show>>(
      'someUrlOrJson',
    )

    const list = res.data.slice(0, 10)

    return json(list.map((u) => ({ id: u.id, name: u.name })))
  },
})
