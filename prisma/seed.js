import { prisma } from '../src/prismaClient.js';

const eventStatusData = [
  {
    eventStatusID: '11111111-1111-1111-1111-111111111111',
    status: 'Pendente',
  },
  {
    eventStatusID: '22222222-2222-2222-2222-222222222222',
    status: 'Aprovado',
  },
  {
    eventStatusID: '33333333-3333-3333-3333-333333333333',
    status: 'Completo',
  },
  {
    eventStatusID: '44444444-4444-4444-4444-444444444444',
    status: 'Comentado',
  },
  {
    eventStatusID: '55555555-5555-5555-5555-555555555555',
    status: 'Reprovado',
  },
  {
    eventStatusID: '66666666-6666-6666-6666-666666666666',
    status: 'Cancelado',
  },
];

const eventData = [
  {
    eventID: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    userId: 'c3b6f3e2-63d0-4e7b-8a2e-5c75dcba8e4b',
    name: 'Tech Conference 2024',
    description: 'A cutting-edge conference on emerging tech trends.',
    startAt: new Date('2024-05-15T09:00:00Z'),
    endAt: new Date('2024-05-16T17:00:00Z'),
    price: 199.99,
    createdAt: new Date(),
    eventstatus_id: '44444444-4444-4444-4444-444444444444',
  },
  {
    eventID: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    userId: 'f5d4e876-1c5d-485f-a7b8-5e012efddc93',
    name: 'Music Festival',
    description: 'An open-air music festival with top artists.',
    startAt: new Date('2024-06-10T12:00:00Z'),
    endAt: new Date('2024-06-12T23:00:00Z'),
    price: 299.99,
    createdAt: new Date(),
    eventstatus_id: '22222222-2222-2222-2222-222222222222',
  },
];

const addressEventData = [
  {
    addressEstablishmentID: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
    road: 'Main Street',
    roadNumber: 123,
    postCode: '1000-123',
    localtown: 'Tech City',
    event_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  },
  {
    addressEstablishmentID: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
    road: 'Festival Avenue',
    roadNumber: 456,
    postCode: '2000-456',
    localtown: 'Music Town',
    event_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  },
];

const routesEventData = [
  {
    routeID: '11111111-1111-1111-1111-111111111111',
    latitude: 40.73061,
    longitude: -73.935242,
    order: 1,
    addressEvent_id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
  },
  {
    routeID: '33333333-3333-3333-3333-333333333333',
    latitude: 40.73062,
    longitude: -73.935243,
    order: 2,
    addressEvent_id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
  },
  {
    routeID: '44444444-4444-4444-4444-444444444444',
    latitude: 34.052235,
    longitude: -118.243683,
    order: 1,
    addressEvent_id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
  },
];

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting seeding process...');

    // Seed EventStatus
    for (const status of eventStatusData) {
      const createdStatus = await prisma.eventStatus.create({
        data: status,
      });
      console.log(`✅ Created EventStatus with ID: ${createdStatus.eventStatusID}`);
    }

    // Seed Events
    for (const event of eventData) {
      const createdEvent = await prisma.event.create({
        data: event,
      });
      console.log(`✅ Created Event with ID: ${createdEvent.eventID}`);
    }

    // Seed AddressEvents
    for (const address of addressEventData) {
      const createdAddress = await prisma.addressEvent.create({
        data: address,
      });
      console.log(`✅ Created AddressEvent with ID: ${createdAddress.addressEstablishmentID}`);
    }

    // // Seed RoutesEvents
    for (const route of routesEventData) {
      const createdRoute = await prisma.routesEvent.create({
        data: route,
      });
      console.log(`✅ Created RoutesEvent with ID: ${createdRoute.routeID}`);
    }

    console.log('🌱 Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

seedDatabase();
