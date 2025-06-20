import { DataSource } from "typeorm";
import { OrmUtils } from "typeorm/util/OrmUtils";
import { ChinookDataset } from "./dataset";
import { Album, Artist, Customer, Employee, Genre, Invoice, InvoiceLine, MediaType, Playlist, PlaylistTrack, Track } from "./entity/Entities";

export const seedChinookDatabase = async (dataSource: DataSource) => {
   await dataSource.getRepository(Genre).insert(ChinookDataset.Genres);
   await dataSource.getRepository(MediaType).insert(ChinookDataset.MediaTypes);
   await dataSource.getRepository(Artist).insert(ChinookDataset.Artists);
   await dataSource.getRepository(Album).insert(ChinookDataset.Albums as any);

   for (const tracksChunk of OrmUtils.chunk(ChinookDataset.Tracks, 100))
      await dataSource.getRepository(Track).insert(tracksChunk as any)

   if (dataSource.driver.options.type === "oracle") {
      for (const employeesChunk of OrmUtils.chunk(ChinookDataset.Employees, 1))
         await dataSource.getRepository(Employee).insert(employeesChunk as any)
   }
   else await dataSource.getRepository(Employee).insert(ChinookDataset.Employees as any)

   await dataSource.getRepository(Customer).insert(ChinookDataset.Customers as any)

   for (const invoicesChunk of OrmUtils.chunk(ChinookDataset.Invoices, 100))
      await dataSource.getRepository(Invoice).insert(invoicesChunk as any)

   for (const invoiceLinesChunk of OrmUtils.chunk(ChinookDataset.InvoiceLines, 100))
      await dataSource.getRepository(InvoiceLine).insert(invoiceLinesChunk as any)

   await dataSource.getRepository(Playlist).insert(ChinookDataset.Playlists)

   // Save instead of Insert because Oracle tries to insert a Null into the primary column
   if (dataSource.driver.options.type === "mssql") {
      for (const playlistTracksChunk of OrmUtils.chunk(ChinookDataset.PLaylistTracks, 1000))
         await dataSource.getRepository(PlaylistTrack).save(playlistTracksChunk as any)
   } else await dataSource.getRepository(PlaylistTrack).save(ChinookDataset.PLaylistTracks as any)
}