import { createTestingConnections } from "./src/test-utils";
import { Album, Artist, Customer, Employee, Genre, Invoice, InvoiceLine, MediaType, Playlist, PlaylistTrack, Track } from "./ultimate-test-suite/chinook_database/entity/Entities";
import { seedChinookDatabase } from "./ultimate-test-suite/chinook_database/seed";

export const setup = async () => {
  process.env.TZ = 'UTC'

  const dataSources = await createTestingConnections({
    schemaCreate: true,
    dropSchema: true,
    entities: [
        Album, Artist, Customer, Employee, Genre, Invoice, InvoiceLine, MediaType, Playlist, Track, PlaylistTrack
    ],
  });

  await Promise.all(dataSources.map(seedChinookDatabase))
}