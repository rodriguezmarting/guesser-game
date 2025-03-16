import { json } from '@tanstack/react-start'
import { createAPIFileRoute } from '@tanstack/react-start/api'
import axios from 'redaxios'
import type { Show } from '../../utils/shows'

export const APIRoute = createAPIFileRoute('/api/shows/$id')({
  GET: async ({ request, params }) => {
    console.info(`Fetching show by id=${params.id}... @`, request.url)
    try {
      // TODO: Replace this with the right API call
      const res = await axios.get<Show>(
        'someUrlOrJson' + params.id,
      )

      return json({
        id: res.data.id,
        name: res.data.name,
      })
    } catch (e) {
      console.error(e)
      return json({ error: 'Show not found' }, { status: 404 })
    }
  },
})
