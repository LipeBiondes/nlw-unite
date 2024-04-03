import { prisma } from '../src/lib/prisma'

async function seed() {
  await prisma.event.create({
    data: {
      id: '2e783d8f-2ba2-41ac-8d00-9940300a27f6',
      title: 'GraphQL Asia',
      slug: 'graphql-asia',
      details: 'Conference on GraphQL',
      maximumAttendees: 120
    }
  })
}

seed().then(() => {
  console.log('Database seeded!.')
  prisma.$disconnect()
})
