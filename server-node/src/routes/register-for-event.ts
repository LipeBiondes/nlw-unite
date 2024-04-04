import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { BadRequest } from './_erros/bad-request'

export async function registerForEvent(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/events/:eventId/attendees',
    {
      schema: {
        summary: 'Register an attendee for an event',
        tags: ['attendees'],
        params: z.object({
          eventId: z.string().uuid()
        }),
        body: z.object({
          name: z.string().min(4),
          email: z.string().email().toLowerCase()
        }),
        response: {
          201: z.object({
            attendeeId: z.number()
          })
        }
      }
    },
    async (request, reply) => {
      const { eventId } = request.params
      const { name, email } = request.body

      const nameFormatted = name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\b\w/g, c => c.toUpperCase())

      const attendeeFromEmail = await prisma.attendee.findUnique({
        where: {
          eventId_email: {
            eventId,
            email
          }
        }
      })

      if (attendeeFromEmail !== null) {
        throw new BadRequest('this email is already registered for this event')
      }

      const [event, amountOfAttendeesForEvent] = await Promise.all([
        prisma.event.findUnique({
          where: {
            id: eventId
          }
        }),
        prisma.attendee.count({
          where: {
            eventId
          }
        })
      ])

      if (
        event?.maximumAttendees &&
        amountOfAttendeesForEvent >= event?.maximumAttendees
      ) {
        throw new BadRequest('The maximum number of attendees has been reached')
      }

      if (event === null) {
        throw new BadRequest('Event not found')
      }

      const attendee = await prisma.attendee.create({
        data: {
          name: nameFormatted,
          email,
          eventId
        }
      })

      return reply.status(201).send({ attendeeId: attendee.id })
    }
  )
}
