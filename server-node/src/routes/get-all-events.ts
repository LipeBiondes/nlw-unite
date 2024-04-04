import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { BadRequest } from './_erros/bad-request'

export async function getAllEvents(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/events/all/',
    {
      schema: {
        summary: 'Get all events',
        tags: ['events'],
        response: {
          200: z.object({
            events: z.array(
              z.object({
                id: z.string().uuid(),
                title: z.string()
              })
            )
          })
        }
      }
    },
    async (request, reply) => {
      const event = await prisma.event.findMany({
        select: {
          id: true,
          title: true
        }
      })

      if (event === null) {
        throw new BadRequest('Events not founded')
      }

      return reply.send({
        events: event
      })
    }
  )
}
