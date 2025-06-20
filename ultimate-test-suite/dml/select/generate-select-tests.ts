import { FindOneOptions, FindOptionsOrder, ILike, MoreThan, ObjectLiteral, SelectQueryBuilder } from "typeorm";
import { ChinookDataset } from "../../chinook_database/dataset";
import { Album, Artist, Customer, Employee, Genre, Invoice, InvoiceLine, MediaType, Playlist, PlaylistTrack, Track } from "../../chinook_database/entity/Entities"
import { pickProperties } from "../../helpers/pickProperties";
import { CartesianProduct } from "../../helpers/product";

/**
 * TODOs:
 * Make shuffle of columns in select
 */

interface TestOptions {
    skip: boolean, // for debugging purposes
    only: boolean, // for debugging purposes
}

interface SelectTestDescription extends TestOptions {
    title: string,
    // We need three different options because we have three different interfaces
    selectOption: (entity: any) => FindOneOptions<ObjectLiteral>["select"],
    applySelectToQB: (entity: any, qb: SelectQueryBuilder<ObjectLiteral>) => SelectQueryBuilder<ObjectLiteral>,
    arrayForDataset: (entity: any) => string[];
}

const select: SelectTestDescription[] = [
    {
        skip: false,
        only: false,
        title: "all columns implicitly",
        selectOption: () => undefined,
        applySelectToQB: (entity, qb) => qb,
        arrayForDataset: () => [],
    },
    {
        skip: false,
        only: false,
        title: "1 column",
        selectOption: (entity) => {
            if (entity.name === Album.name) {
                return {albumId: true} satisfies FindOneOptions<Album>["select"];
            } else if (entity.name === Artist.name) {
                return {artistId: true} satisfies FindOneOptions<Artist>["select"];
            } else if (entity.name === Customer.name) {
                return {customerId: true} satisfies FindOneOptions<Customer>["select"];
            } else if (entity.name === Employee.name) {
                return {employeeId: true} satisfies FindOneOptions<Employee>["select"];
            } else if (entity.name === Genre.name) {
                return {genreId: true} satisfies FindOneOptions<Genre>["select"];
            } else if (entity.name === Invoice.name) {
                return {invoiceId: true} satisfies FindOneOptions<Invoice>["select"];
            } else if (entity.name === InvoiceLine.name) {
                return {invoiceLineId: true} satisfies FindOneOptions<InvoiceLine>["select"];
            } else if (entity.name === MediaType.name) {
                return {mediaTypeId: true} satisfies FindOneOptions<MediaType>["select"];
            } else if (entity.name === Playlist.name) {
                return {playlistId: true} satisfies FindOneOptions<Playlist>["select"];
            } else if (entity.name === Track.name) {
                return {trackId: true} satisfies FindOneOptions<Track>["select"];
            } else if (entity.name === PlaylistTrack.name) {
                return {id: true} satisfies FindOneOptions<PlaylistTrack>["select"];
            }
            throw new Error(`Unsupported entity ${entity.name}`);
        },
        applySelectToQB: (entity, qb) => {
            const entityConfig = entities.find(x => x.entity === entity)!;
            if (entity.name === Album.name) {
                return qb.select(["albumId"].map(x => [entityConfig.nameAlias, x].join(".")))
            } else if (entity.name === Artist.name) {
                return qb.select(["artistId"].map(x => [entityConfig.nameAlias, x].join(".")))
            } else if (entity.name === Customer.name) {
                return qb.select(["customerId"].map(x => [entityConfig.nameAlias, x].join(".")))
            } else if (entity.name === Employee.name) {
                return qb.select(["employeeId"].map(x => [entityConfig.nameAlias, x].join(".")))
            } else if (entity.name === Genre.name) {
                return qb.select(["genreId"].map(x => [entityConfig.nameAlias, x].join(".")))
            } else if (entity.name === Invoice.name) {
                return qb.select(["invoiceId"].map(x => [entityConfig.nameAlias, x].join(".")))
            } else if (entity.name === InvoiceLine.name) {
                return qb.select(["invoiceLineId"].map(x => [entityConfig.nameAlias, x].join(".")))
            } else if (entity.name === MediaType.name) {
                return qb.select(["mediaTypeId"].map(x => [entityConfig.nameAlias, x].join(".")))
            } else if (entity.name === Playlist.name) {
                return qb.select(["playlistId"].map(x => [entityConfig.nameAlias, x].join(".")))
            } else if (entity.name === Track.name) {
                return qb.select(["trackId"].map(x => [entityConfig.nameAlias, x].join(".")))
            } else if (entity.name === PlaylistTrack.name) {
                return qb.select(["id"].map(x => [entityConfig.nameAlias, x].join(".")));
            }
            throw new Error(`Unsupported entity ${entity.name}`);
        },
        arrayForDataset: (entity) => {
            return Object.keys(select[1].selectOption(entity)!);
        },
    },
    {
        skip: false,
        only: true,
        title: "2 columns",
        selectOption: (entity) => {
            if (entity.name === Album.name) {
                return {albumId: true, title: true} satisfies FindOneOptions<Album>["select"];
            } else if (entity.name === Artist.name) {
                return {artistId: true, name: true} satisfies FindOneOptions<Artist>["select"];
            } else if (entity.name === Customer.name) {
                return {customerId: true, address: true} satisfies FindOneOptions<Customer>["select"];
            } else if (entity.name === Employee.name) {
                return {employeeId: true, phone: true} satisfies FindOneOptions<Employee>["select"];
            } else if (entity.name === Genre.name) {
                return {genreId: true, name: true} satisfies FindOneOptions<Genre>["select"];
            } else if (entity.name === Invoice.name) {
                return {invoiceId: true, invoiceDate: true} satisfies FindOneOptions<Invoice>["select"];
            } else if (entity.name === InvoiceLine.name) {
                return {invoiceLineId: true, quantity: true} satisfies FindOneOptions<InvoiceLine>["select"];
            } else if (entity.name === MediaType.name) {
                return {mediaTypeId: true, name: true} satisfies FindOneOptions<MediaType>["select"];
            } else if (entity.name === Playlist.name) {
                return {playlistId: true, name: true} satisfies FindOneOptions<Playlist>["select"];
            } else if (entity.name === Track.name) {
                return {trackId: true, milliseconds: true} satisfies FindOneOptions<Track>["select"];
            } else if (entity.name === PlaylistTrack.name) {
                return {id: true, playlist: {playlistId: true}} satisfies FindOneOptions<PlaylistTrack>["select"];
            }
            throw new Error(`Unsupported entity ${entity.name}`);
        },
        applySelectToQB: (entity, qb) => {
            const entityConfig = entities.find(x => x.entity === entity)!;
            if (entity.name === Album.name) {
                return qb.select(["album_id", "title"].map(x => [entityConfig.nameAlias, x].join(".")))
            } else if (entity.name === Artist.name) {
                return qb.select(["artist_id", "name"].map(x => [entityConfig.nameAlias, x].join(".")))
            } else if (entity.name === Customer.name) {
                return qb.select(["customer_id", "address"].map(x => [entityConfig.nameAlias, x].join(".")))
            } else if (entity.name === Employee.name) {
                return qb.select(["employee_id", "phone"].map(x => [entityConfig.nameAlias, x].join(".")))
            } else if (entity.name === Genre.name) {
                return qb.select(["genre_id", "name"].map(x => [entityConfig.nameAlias, x].join(".")))
            } else if (entity.name === Invoice.name) {
                return qb.select(["invoice_id", "invoice_date"].map(x => [entityConfig.nameAlias, x].join(".")))
            } else if (entity.name === InvoiceLine.name) {
                return qb.select(["invoice_line_id", "quantity"].map(x => [entityConfig.nameAlias, x].join(".")))
            } else if (entity.name === MediaType.name) {
                return qb.select(["media_type_id", "name"].map(x => [entityConfig.nameAlias, x].join(".")))
            } else if (entity.name === Playlist.name) {
                return qb.select(["playlist_id", "name"].map(x => [entityConfig.nameAlias, x].join(".")))
            } else if (entity.name === Track.name) {
                return qb.select(["track_id", "milliseconds"].map(x => [entityConfig.nameAlias, x].join(".")))
            } else if (entity.name === PlaylistTrack.name) {
                return qb.select(["id"].map(x => [entityConfig.nameAlias, x].join(".")));
            }
            throw new Error(`Unsupported entity ${entity.name}`);
        },
        arrayForDataset: (entity) => {
            return Object.keys(select[2].selectOption(entity)!);
        },
    },
    {
        skip: false,
        only: false,
        title: "4 columns",
        selectOption: (entity) => {
            if (entity.name === Album.name) {
                return {albumId: true, title: true} satisfies FindOneOptions<Album>["select"];
            } else if (entity.name === Artist.name) {
                return {artistId: true, name: true} satisfies FindOneOptions<Artist>["select"];
            } else if (entity.name === Customer.name) {
                return {customerId: true, address: true, city: true, firstName: true} satisfies FindOneOptions<Customer>["select"];
            } else if (entity.name === Employee.name) {
                return {employeeId: true, phone: true, address: true, postalCode: true} satisfies FindOneOptions<Employee>["select"];
            } else if (entity.name === Genre.name) {
                return {genreId: true, name: true} satisfies FindOneOptions<Genre>["select"];
            } else if (entity.name === Invoice.name) {
                return {invoiceId: true, invoiceDate: true, billingCountry: true, billingState: true} satisfies FindOneOptions<Invoice>["select"];
            } else if (entity.name === InvoiceLine.name) {
                return {invoiceLineId: true, quantity: true, unitPrice: true} satisfies FindOneOptions<InvoiceLine>["select"];
            } else if (entity.name === MediaType.name) {
                return {mediaTypeId: true, name: true} satisfies FindOneOptions<MediaType>["select"];
            } else if (entity.name === Playlist.name) {
                return {playlistId: true, name: true, tracks: true} satisfies FindOneOptions<Playlist>["select"];
            } else if (entity.name === Track.name) {
                return {trackId: true, milliseconds: true, composer: true, bytes: true} satisfies FindOneOptions<Track>["select"];
            } else if (entity.name === PlaylistTrack.name) {
                return {id: true} satisfies FindOneOptions<PlaylistTrack>["select"];
            }
            throw new Error(`Unsupported entity ${entity.name}`);
        },
        applySelectToQB: (entity, qb) => {
            const entityConfig = entities.find(x => x.entity === entity)!;
            if (entity.name === Album.name) {
                return qb.select(["album_id", "title"].map(x => [entityConfig.nameAlias, x].join(".")))
            } else if (entity.name === Artist.name) {
                return qb.select(["artist_id", "name"].map(x => [entityConfig.nameAlias, x].join(".")))
            } else if (entity.name === Customer.name) {
                return qb.select(["customer_id", "address", "city", "first_name"].map(x => [entityConfig.nameAlias, x].join(".")))
            } else if (entity.name === Employee.name) {
                return qb.select(["employee_id", "phone", "address", "postal_code"].map(x => [entityConfig.nameAlias, x].join(".")))
            } else if (entity.name === Genre.name) {
                return qb.select(["genre_id", "name"].map(x => [entityConfig.nameAlias, x].join(".")))
            } else if (entity.name === Invoice.name) {
                return qb.select(["invoice_id", "invoice_date", "billing_country", "billing_state"].map(x => [entityConfig.nameAlias, x].join(".")))
            } else if (entity.name === InvoiceLine.name) {
                return qb.select(["invoice_line_id", "quantity", "unit_price"].map(x => [entityConfig.nameAlias, x].join(".")))
            } else if (entity.name === MediaType.name) {
                return qb.select(["media_type_id", "name"].map(x => [entityConfig.nameAlias, x].join(".")))
            } else if (entity.name === Playlist.name) {
                return qb.select(["playlist_id", "name"].map(x => [entityConfig.nameAlias, x].join(".")))
            } else if (entity.name === Track.name) {
                return qb.select(["track_id", "milliseconds", "composer", "bytes"].map(x => [entityConfig.nameAlias, x].join(".")))
            } else if (entity.name === PlaylistTrack.name) {
                return qb.select(["id"].map(x => [entityConfig.nameAlias, x].join(".")));
            }
            throw new Error(`Unsupported entity ${entity.name}`);
        },
        arrayForDataset: (entity) => {
            return Object.keys(select[3].selectOption(entity)!);
        },
    },
    {
        skip: false,
        only: false,
        title: "all columns explicitly",
        selectOption: (entity) => {
            if (entity.name === Album.name) {
                return {albumId: true, title: true} satisfies FindOneOptions<Album>["select"];
            } else if (entity.name === Artist.name) {
                return {artistId: true, name: true} satisfies FindOneOptions<Artist>["select"];
            } else if (entity.name === Customer.name) {
                return {customerId: true, address: true, city: true, firstName: true, company: true, country: true, email: true, fax: true, lastName: true, phone: true, postalCode: true, state: true} satisfies FindOneOptions<Customer>["select"];
            } else if (entity.name === Employee.name) {
                return {employeeId: true, phone: true, address: true, postalCode: true, birthDate: true, city: true, country: true, email: true, fax: true, firstName: true, hireDate: true, lastName: true, state: true, title: true} satisfies FindOneOptions<Employee>["select"];
            } else if (entity.name === Genre.name) {
                return {genreId: true, name: true} satisfies FindOneOptions<Genre>["select"];
            } else if (entity.name === Invoice.name) {
                return {invoiceId: true, invoiceDate: true, billingCountry: true, billingState: true, billingAddress: true, billingCity: true, billingPostalCode: true, total: true} satisfies FindOneOptions<Invoice>["select"];
            } else if (entity.name === InvoiceLine.name) {
                return {invoiceLineId: true, quantity: true, unitPrice: true} satisfies FindOneOptions<InvoiceLine>["select"];
            } else if (entity.name === MediaType.name) {
                return {mediaTypeId: true, name: true} satisfies FindOneOptions<MediaType>["select"];
            } else if (entity.name === Playlist.name) {
                return {playlistId: true, name: true} satisfies FindOneOptions<Playlist>["select"];
            } else if (entity.name === Track.name) {
                return {trackId: true, milliseconds: true, composer: true, bytes: true, name: true, unitPrice: true} satisfies FindOneOptions<Track>["select"];
            } else if (entity.name === PlaylistTrack.name) {
                return {id: true} satisfies FindOneOptions<PlaylistTrack>["select"];
            }
            throw new Error(`Unsupported entity ${entity.name}`);
        },
        applySelectToQB: (entity, qb) => {
            const entityConfig = entities.find(x => x.entity === entity)!;
            if (entity.name === Album.name) {
                return qb.select(["album_id", "title"].map(x => [entityConfig.nameAlias, x].join(".")))
            } else if (entity.name === Artist.name) {
                return qb.select(["artist_id", "name"].map(x => [entityConfig.nameAlias, x].join(".")))
            } else if (entity.name === Customer.name) {
                return qb.select(["customer_id", "address", "city", "first_name", "company", "country", "email", "fax", "last_name", "phone", "postal_code", "state"].map(x => [entityConfig.nameAlias, x].join(".")))
            } else if (entity.name === Employee.name) {
                return qb.select(["employee_id", "phone", "address", "postal_code", "birth_date", "city", "country", "email", "fax", "first_name", "hire_date", "last_name", "state", "title"].map(x => [entityConfig.nameAlias, x].join(".")))
            } else if (entity.name === Genre.name) {
                return qb.select(["genre_id", "name"].map(x => [entityConfig.nameAlias, x].join(".")))
            } else if (entity.name === Invoice.name) {
                return qb.select(["invoice_id", "invoice_date", "billing_country", "billing_state", "billing_address", "billing_city", "billing_postal_code", "total"].map(x => [entityConfig.nameAlias, x].join(".")))
            } else if (entity.name === InvoiceLine.name) {
                return qb.select(["invoice_line_id", "quantity", "unit_price"].map(x => [entityConfig.nameAlias, x].join(".")))
            } else if (entity.name === MediaType.name) {
                return qb.select(["media_type_id", "name"].map(x => [entityConfig.nameAlias, x].join(".")))
            } else if (entity.name === Playlist.name) {
                return qb.select(["playlist_id", "name"].map(x => [entityConfig.nameAlias, x].join(".")))
            } else if (entity.name === Track.name) {
                return qb.select(["track_id", "milliseconds", "composer", "bytes", "name", "unit_price"].map(x => [entityConfig.nameAlias, x].join(".")))
            } else if (entity.name === PlaylistTrack.name) {
                return qb.select(["id"].map(x => [entityConfig.nameAlias, x].join(".")));
            }
            throw new Error(`Unsupported entity ${entity.name}`);
        },
        arrayForDataset: (entity) => {
            return Object.keys(select[4].selectOption(entity)!);
        },
    },
]

interface EntityTestDescription extends TestOptions {
    entity: any;
    nameAlias: string,
    tableName: string,
    rawMapper: (x: any) => any,
    rawFromMapper: (x: any) => any,
    datasetMapper: (x: any) => any,
    dataset: any[],
}

const entities: EntityTestDescription[] = [
    { skip: false, only: true, entity: Album, tableName: "album", nameAlias: "album",
        rawMapper: (x) => ({albumId: x.album_album_id ? Number(x.album_album_id) : undefined, title: x.album_title}),
        rawFromMapper: (x) => ({albumId: x.album_id ? Number(x.album_id) : undefined, title: x.title}),
        datasetMapper: (x: typeof ChinookDataset.Albums[number]) => ({albumId: x.albumId, title: x.title}),
        dataset: ChinookDataset.Albums },
    { skip: false, only: false, entity: Artist, tableName: "artist", nameAlias: "artist" ,
        rawMapper: (x) => ({artistId: x.artist_artist_id ? Number(x.artist_artist_id) : undefined, name: x.artist_name}),
        rawFromMapper: (x) => ({artistId: x.artist_id ? Number(x.artist_id) : undefined, name: x.name}),
        datasetMapper: (x: typeof ChinookDataset.Artists[number]) => x,
        dataset: ChinookDataset.Artists  },
    { skip: false, only: false, entity: Customer, tableName: "customer", nameAlias: "customer",
        rawMapper: (x) => ({address: x.customer_address, city: x.customer_city, company: x.customer_company, country: x.customer_country, customerId: x.customer_customer_id ? Number(x.customer_customer_id) : undefined, email: x.customer_email, fax: x.customer_fax, firstName: x.customer_first_name, lastName: x.customer_last_name, phone: x.customer_phone, postalCode: x.customer_postal_code, state: x.customer_state}),
        rawFromMapper: (x) => ({address: x.address, city: x.city, company: x.company, country: x.country, customerId: x.customer_id ? Number(x.customer_id) : undefined, email: x.email, fax: x.fax, firstName: x.first_name, lastName: x.last_name, phone: x.phone, postalCode: x.postal_code, state: x.state}),
        datasetMapper: (x: typeof ChinookDataset.Customers[number]) => {const res = {...x}; delete (res as any).supportRep; return res;},
        dataset: ChinookDataset.Customers   },
    { skip: false, only: false, entity: Employee, tableName: "employee", nameAlias: "employee",
        rawMapper: (x) => ({address: x.employee_address, birthDate: x.employee_birth_date ? new Date(x.employee_birth_date) : undefined, city: x.employee_city, country: x.employee_country, email: x.employee_email, employeeId: x.employee_employee_id ? Number(x.employee_employee_id) : undefined, fax: x.employee_fax, firstName: x.employee_first_name, hireDate: x.employee_hire_date ? new Date(x.employee_hire_date) : undefined, lastName: x.employee_last_name, phone: x.employee_phone, postalCode: x.employee_postal_code, state: x.employee_state, title: x.employee_title}),
        rawFromMapper: (x) => ({address: x.address, birthDate: new Date(x.birth_date), city: x.city, country: x.country, email: x.email, employeeId: x.employee_id ? Number(x.employee_id) : undefined, fax: x.fax, firstName: x.first_name, hireDate: new Date(x.hire_date), lastName: x.last_name, phone: x.phone, postalCode: x.postal_code, state: x.state, title: x.title}),
        datasetMapper: (x: typeof ChinookDataset.Employees[number]) => {const res = {...x, hireDate: new Date(x.hireDate), birthDate: new Date(x.birthDate)}; delete (res as any).reportsTo; return res;},
        dataset: ChinookDataset.Employees   },
    { skip: false, only: false, entity: Genre, tableName: "genre", nameAlias: "genre",
        rawMapper: (x) => ({genreId: x.genre_genre_id ? Number(x.genre_genre_id) : undefined, name: x.genre_name}),
        rawFromMapper: (x) => ({genreId: x.genre_id? Number(x.genre_id) : undefined, name: x.name}),
        datasetMapper: (x: typeof ChinookDataset.Genres[number]) => x,
        dataset: ChinookDataset.Genres   },
    { skip: false, only: false, entity: Invoice, tableName: "invoice", nameAlias: "invoice",
        rawMapper: (x) => ({billingAddress: x.invoice_billing_address, billingCity: x.invoice_billing_city, billingCountry: x.invoice_billing_country, billingPostalCode: x.invoice_billing_postal_code, billingState: x.invoice_billing_state, invoiceDate: x.invoice_invoice_date ? new Date(x.invoice_invoice_date) : undefined, invoiceId: x.invoice_invoice_id ? Number(x.invoice_invoice_id) : undefined, total: x.invoice_total ? Number(x.invoice_total) : undefined}),
        rawFromMapper: (x) => ({billingAddress: x.billing_address, billingCity: x.billing_city, billingCountry: x.billing_country, billingPostalCode: x.billing_postal_code, billingState: x.billing_state, invoiceDate: new Date(x.invoice_date), invoiceId: x.invoice_id ? Number(x.invoice_id) : undefined, total: x.total ? Number(x.total) : undefined}),
        datasetMapper: (x: typeof ChinookDataset.Invoices[number]) => {const res = {...x, invoiceDate: new Date(x.invoiceDate), total: x.total}; delete (res as any).customer; return res;},
        dataset: ChinookDataset.Invoices   },
    { skip: false, only: false, entity: InvoiceLine, tableName: "invoice_line", nameAlias: "invoice_line",
        rawMapper: (x) => ({invoiceLineId: x.invoice_line_invoice_line_id ? Number(x.invoice_line_invoice_line_id) : undefined, quantity: x.invoice_line_quantity ? Number(x.invoice_line_quantity) : undefined, unitPrice: x.invoice_line_unit_price ? Number(x.invoice_line_unit_price) : undefined}),
        rawFromMapper: (x) => ({invoiceLineId: x.invoice_line_id ? Number(x.invoice_line_id) : undefined, quantity: x.quantity ? Number(x.quantity) : undefined, unitPrice: x.unit_price ? Number(x.unit_price) : undefined}),
        datasetMapper: (x: typeof ChinookDataset.InvoiceLines[number]) => {const res = {...x, unitPrice: x.unitPrice}; delete (res as any).track; delete (res as any).invoice; return res;},
        dataset: ChinookDataset.InvoiceLines },
    { skip: false, only: false, entity: MediaType, tableName: "media_type", nameAlias: "media_type",
        rawMapper: (x) => ({mediaTypeId: x.media_type_media_type_id ? Number(x.media_type_media_type_id) : undefined, name: x.media_type_name}),
        rawFromMapper: (x) => ({mediaTypeId: x.media_type_id ? Number(x.media_type_id) : undefined, name: x.name}),
        datasetMapper: (x) => x,
        dataset: ChinookDataset.MediaTypes},
    { skip: false, only: false, entity: Playlist, tableName: "playlist", nameAlias: "playlist",
        rawMapper: (x) => ({name: x.playlist_name, playlistId: x.playlist_playlist_id ? Number(x.playlist_playlist_id) : undefined}),
        rawFromMapper: (x) => ({name: x.name, playlistId: x.playlist_id ? Number(x.playlist_id) : undefined}),
        datasetMapper: (x) => x,
        dataset: ChinookDataset.Playlists},
    { skip: false, only: false, entity: Track, tableName: "track", nameAlias: "track",
        rawMapper: (x) => ({bytes: x.track_bytes ? Number(x.track_bytes) : undefined, composer: x.track_composer, milliseconds: x.track_milliseconds ? Number(x.track_milliseconds) : undefined, name: x.track_name, trackId: Number(x.track_track_id), unitPrice: x.track_unit_price ? Number(x.track_unit_price) : undefined}),
        rawFromMapper: (x) => ({bytes: x.bytes ? Number(x.bytes) : undefined, composer: x.composer, milliseconds: x.milliseconds ? Number(x.milliseconds) : undefined, name: x.name, trackId: Number(x.track_id), unitPrice: x.unit_price ? Number(x.unit_price) : undefined}),
        datasetMapper: (x: typeof ChinookDataset.Tracks[number]) => {const res = {...x, unitPrice: String(x.unitPrice)}; delete (res as any).album; delete (res as any).genre; delete (res as any).mediaType; return res;},
        dataset: ChinookDataset.Tracks },
    { skip: false, only: false, entity: PlaylistTrack, tableName: "playlist_track", nameAlias: "playlist_track",
        rawMapper: (x) => ({id: x.playlist_track_id ? Number(x.playlist_track_id) : undefined}),
        rawFromMapper: (x) => ({id: x.id ? Number(x.id) : undefined}),
        // Exception!
        datasetMapper: (x) => (x),
        dataset: ChinookDataset.PLaylistTracks },
]

interface WhereTestDescription extends TestOptions {
    title: string,
    option: (entity: any) => ObjectLiteral[],
    filterDataset: (entity: any, dbType: string) => (x: any[]) => any[];
}

const wheres: WhereTestDescription[] = [
    {
        skip: false,
        only: false,
        title: "no where condition",
        option: () => ({}) as any,
        filterDataset: () => (x) => x.filter(() => true),
    },
    {
        skip: false,
        only: false,
        title: "1 where condition",
        option: (entity) => {
            if (entity.name === Album.name) {
                return [{title: ILike("%a%")}] as Record<keyof Album, unknown>[]
            } else if (entity.name === Artist.name) {
                return [{name: ILike("%a%")}] as Record<keyof Artist, unknown>[]
            } else if (entity.name === Customer.name) {
                return [{country: ILike("%a%")}] as Record<keyof Customer, unknown>[]
            } else if (entity.name === Employee.name) {
                return [{email: ILike("%a%")}] as Record<keyof Employee, unknown>[]
            } else if (entity.name === Genre.name) {
                return [{name: ILike("%a%")}] as Record<keyof Genre, unknown>[]
            } else if (entity.name === Invoice.name) {
                return [{billingAddress: ILike("%a%")}] as Record<keyof Invoice, unknown>[]
            } else if (entity.name === InvoiceLine.name) {
                return [{unitPrice: MoreThan(0.5)}] as Record<keyof InvoiceLine, unknown>[]
            } else if (entity.name === MediaType.name) {
                return [{name: ILike("%a%")}] as Record<keyof MediaType, unknown>[]
            } else if (entity.name === Playlist.name) {
                return [{name: ILike("%a%")}] as Record<keyof Playlist, unknown>[]
            } else if (entity.name === Track.name) {
                return [{name: ILike("%a%")}] as Record<keyof Track, unknown>[]
            } else if (entity.name === PlaylistTrack.name) {
                return [{id: MoreThan(5000)}] as Record<keyof PlaylistTrack, unknown>[]
            }
            throw new Error(`Unsupported entity ${entity.name}`);
        },
        filterDataset: (entity, dbDialict) => {
            if (entity.name === Album.name) {
                return x => x.filter(y => y.title.includes("a") || y.title.includes("A"))
            } else if (entity.name === Artist.name) {
                return x => x.filter(y => ["mysql", "mariadb"].includes(dbDialict) ? y.name.split("").some((c: string) => c.localeCompare("a", undefined, {sensitivity: "base"}) === 0) : (y.name.includes("a") || y.name.includes("A")))
            } else if (entity.name === Customer.name) {
                return x => x.filter(y => y.country.includes("a") || y.country.includes("A"))
            } else if (entity.name === Employee.name) {
                return x => x.filter(y => y.email.includes("a") || y.email.includes("A"))
            } else if (entity.name === Genre.name) {
                return x => x.filter(y => y.name.includes("a") || y.name.includes("A"))
            } else if (entity.name === Invoice.name) {
                return x => x.filter(y => ["mysql", "mariadb"].includes(dbDialict) ? y.billingAddress.split("").some((c: string) => c.localeCompare("a", undefined, {sensitivity: "base"}) === 0) : (y.billingAddress.includes("a") || y.billingAddress.includes("A")))
            } else if (entity.name === InvoiceLine.name) {
                return x => x.filter(y => y.unitPrice > 0.5)
            } else if (entity.name === MediaType.name) {
                return x => x.filter(y => y.name.includes("a") || y.name.includes("A"))
            } else if (entity.name === Playlist.name) {
                return x => x.filter(y => y.name.includes("a") || y.name.includes("A"))
            } else if (entity.name === Track.name) {
                return x => x.filter(y => ["mysql", "mariadb"].includes(dbDialict) ? y.name.split("").some((c: string) => c.localeCompare("a", undefined, {sensitivity: "base"}) === 0) : (y.name.includes("a") || y.name.includes("A")))
            } else if (entity.name === PlaylistTrack.name) {
                return x => x.filter(y => y.id > 5000)
            }
            throw new Error(`Unsupported entity ${entity.name}`);
        }
    }
]

interface OrderTestDescription extends TestOptions{
    title: string,
    // We need three different options because we have three different interfaces
    applyOption: (entity: any, qb: SelectQueryBuilder<ObjectLiteral>) => SelectQueryBuilder<ObjectLiteral>,
    optionForRepo: (entity: any) => FindOneOptions<ObjectLiteral>["order"],
    orderDataset: (entity: any, dbType: string) => (x: any[]) => any[];
}

const datasetOrderDependingOnDBType = (dbDialict: string, a: string, b: string) => {
    if (["postgres"].includes(dbDialict))
        return a.localeCompare(b, undefined, {
            ignorePunctuation: true,
            usage: "sort"
        })
    return a.localeCompare(b);
}

const orders: OrderTestDescription[] = [
    {
        skip: false,
        only: false,
        title: "no order condition",
        applyOption: (entity, qb) => qb,
        optionForRepo: () => undefined,
        orderDataset: () => (x) => x,
    },
    {
        skip: false,
        only: false,
        title: "1 order condition",
        applyOption: (entity, qb) => {
            const entityConfig = entities.find(x => x.entity === entity)!;
            Object.entries(orders[1].optionForRepo(entity)!).forEach(((order: [string, "ASC"|"DESC"], i) => {
                if (i === 0) qb.orderBy([entityConfig.nameAlias, order[0]].join("."), order[1]);
                else qb.addOrderBy([entityConfig.nameAlias, order[0]].join("."), order[1])
            }))
            return qb;
        },
        optionForRepo: (entity) => {
            if (entity.name === Album.name) {
                return {title: "ASC"} as FindOptionsOrder<Album>;
            } else if (entity.name === Artist.name) {
                return {name: "ASC"} as FindOptionsOrder<Artist>
            } else if (entity.name === Customer.name) {
                return {country: "ASC", customerId: "ASC"} as FindOptionsOrder<Customer>
            } else if (entity.name === Employee.name) {
                return {email: "ASC"} as FindOptionsOrder<Employee>
            } else if (entity.name === Genre.name) {
                return {name: "ASC"} as FindOptionsOrder<Genre>
            } else if (entity.name === Invoice.name) {
                return {billingAddress: "ASC", invoiceId: "ASC"} as FindOptionsOrder<Invoice>
            } else if (entity.name === InvoiceLine.name) {
                return {unitPrice: "ASC", invoiceLineId: "ASC"} as FindOptionsOrder<InvoiceLine>
            } else if (entity.name === MediaType.name) {
                return {name: "ASC"} as FindOptionsOrder<MediaType>
            } else if (entity.name === Playlist.name) {
                return {name: "ASC", playlistId: "ASC"} as FindOptionsOrder<Playlist>
            } else if (entity.name === Track.name) {
                return {name: "ASC"} as FindOptionsOrder<Track>
            } else if (entity.name === PlaylistTrack.name) {
                return {id: "ASC"} as FindOptionsOrder<PlaylistTrack>
            }
            throw new Error(`Unsupported entity ${entity.name}`);
        },
        orderDataset: (entity, dbType) => {
            if (entity.name === Album.name) {
                return (dataset) => dataset.slice().sort((a: Album, b: Album) => datasetOrderDependingOnDBType(dbType, a.title, b.title))
            } else if (entity.name === Artist.name) {
                return (dataset) => dataset.slice().sort((a: Artist, b: Artist) => datasetOrderDependingOnDBType(dbType, a.name, b.name))
            } else if (entity.name === Customer.name) {
                return (dataset) => dataset.slice().sort((a: Customer, b: Customer) => datasetOrderDependingOnDBType(dbType, a.country, b.country) | (a.customerId - b.customerId))
            } else if (entity.name === Employee.name) {
                return (dataset) => dataset.slice().sort((a: Employee, b: Employee) => datasetOrderDependingOnDBType(dbType, a.email, b.email))
            } else if (entity.name === Genre.name) {
                return (dataset) => dataset.slice().sort((a: Genre, b: Genre) => datasetOrderDependingOnDBType(dbType, a.name, b.name))
            } else if (entity.name === Invoice.name) {
                return (dataset) => dataset.slice().sort((a: Invoice, b: Invoice) => datasetOrderDependingOnDBType(dbType, a.billingAddress, b.billingAddress) | (a.invoiceId - b.invoiceId))
            } else if (entity.name === InvoiceLine.name) {
                return (dataset) => dataset.slice().sort((a: InvoiceLine, b: InvoiceLine) => (a.unitPrice - b.unitPrice) | (a.invoiceLineId - b.invoiceLineId))
            } else if (entity.name === MediaType.name) {
                return (dataset) => dataset.slice().sort((a: MediaType, b: MediaType) => datasetOrderDependingOnDBType(dbType, a.name, b.name))
            } else if (entity.name === Playlist.name) {
                return (dataset) => dataset.slice().sort((a: Playlist, b: Playlist) => datasetOrderDependingOnDBType(dbType, a.name, b.name) | (a.playlistId - b.playlistId))
            } else if (entity.name === Track.name) {
                return (dataset) => dataset.slice().sort((a: Track, b: Track) => datasetOrderDependingOnDBType(dbType, a.name, b.name))
            } else if (entity.name === PlaylistTrack.name) {
                return (dataset) => dataset.slice().sort((a: PlaylistTrack, b: PlaylistTrack) => a.id - b.id)
            }
            throw new Error(`Unsupported entity ${entity.name}`);
        },
    }
]

interface LimitTestDescription extends TestOptions{
    title: string,
    option: number,
}

const limits: LimitTestDescription[] = [
    {
        skip: false,
        only: false,
        title: "no limit",
        option: undefined as never as number,
    },
    {
        skip: false,
        only: false,
        title: "limit 1",
        option: 1,
    },
    {
        skip: false,
        only: false,
        title: "limit 10",
        option: 10,
    },
    {
        skip: false,
        only: false,
        title: "limit 100",
        option: 100,
    }
]

interface OffsetTestDescription extends TestOptions{
    title: string,
    option: number,
}

const offsets: OffsetTestDescription[] = [
    {
        skip: false,
        only: false,
        title: "no offset",
        option: undefined as never as number,
    },
    {
        skip: false,
        only: false,
        title: "offset 1",
        option: 1,
    },
    {
        skip: false,
        only: false,
        title: "offset 10",
        option: 10,
    },
    {
        skip: false,
        only: false,
        title: "offset 100",
        option: 100,
    }
]

const optimizeTests = (testCases: ReturnType<typeof _generateTests>) => {
    const testMap = new Map<string, typeof testCases[number]>()
    for (const testCase of testCases) {
        const entity = testCase.entity.entity;
        const select = JSON.stringify(testCase.select.selectOption(entity)) ?? "empty";
        const where = JSON.stringify(testCase.where.option(entity));
        const order = JSON.stringify(testCase.order.optionForRepo(entity));
        const limit = testCase.limit.option;
        const offset = testCase.offset.option;
        const stringRepresentationOfTest = `ENTITY: ${entity.name}, SELECT: ${select}, WHERE: ${where}, ORDER: ${order}, LIMIT: ${limit}, OFFSET: ${offset}`;
        if (!testMap.has(stringRepresentationOfTest))
            testMap.set(stringRepresentationOfTest, testCase);
    }

    return Array.from(testMap.values());
}


const prepareSubsetOfTests = <T extends TestOptions>(allTests: T[]) => {
    const subset = allTests.filter(x => !x.skip);
    if (subset.some(x => x.only))
        return subset.filter(x => x.only);
    return subset;
}

export const _generateTests = () => {
    return CartesianProduct.product(
        prepareSubsetOfTests(select),
        prepareSubsetOfTests(entities),
        prepareSubsetOfTests(wheres),
        prepareSubsetOfTests(orders),
        prepareSubsetOfTests(limits),
        prepareSubsetOfTests(offsets),
    ).map(testCase => ({
        select: testCase[0],
        entity: testCase[1],
        where: testCase[2],
        order: testCase[3],
        limit: testCase[4],
        offset: testCase[5],
    }));
}

export const generateTests = () => {
    console.log("Ultimate Test Suite > DML > SELECT")
    console.log("Generating tests...")
    const allTests = _generateTests()
    console.log(`Generated ${allTests.length} tests, optimizing...`)
    const optimizedTests = optimizeTests(allTests);
    console.log(`Optimization complete, reduced to ${optimizedTests.length} tests (${Math.floor(100-(optimizedTests.length / allTests.length * 100))}% reduction)`)
    return optimizedTests;
}

export const getTestName = (testCase: ReturnType<typeof generateTests>[number]) =>
    `SELECT ${testCase.entity.entity.name}, ${testCase.select.title}, ${testCase.where.title}, ${testCase.order.title}, ${testCase.limit.title}, ${testCase.offset.title}`

const calculateOffsetForSlice = (testCase: ReturnType<typeof generateTests>[number]) => {
    if (testCase.offset.option === undefined && testCase.limit.option === undefined)
        return undefined;
    if (testCase.limit.option === undefined)
        return undefined;
    return (testCase.offset.option ?? 0) + testCase.limit.option;
}

export const prepareDataset = (testCase: ReturnType<typeof generateTests>[number], dataSourceDriverOptionsType: string) => {
    const orderedDataset = testCase.order.orderDataset(testCase.entity.entity, dataSourceDriverOptionsType)(
        testCase.entity.dataset
    );

    const filteredDataset = testCase.where.filterDataset(testCase.entity.entity, dataSourceDriverOptionsType)(
        orderedDataset
    )

    const datasetBeforeSlice = filteredDataset
    .map(testCase.entity.datasetMapper)
    .map(x => pickProperties(x, testCase.select.arrayForDataset(testCase.entity.entity)))

    return {
        dataset: datasetBeforeSlice.slice(testCase.offset.option, calculateOffsetForSlice(testCase)),
        first: datasetBeforeSlice[0],
    }
}