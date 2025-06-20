
// Original Chinook info:
/*******************************************************************************
   Chinook Database - Version 1.4.5
   Script: Chinook_PostgreSql.sql
   Description: Creates and populates the Chinook database.
   DB Server: PostgreSql
   Author: Luis Rocha
   License: https://github.com/lerocha/chinook-database/blob/master/LICENSE.md
********************************************************************************/
// Prepared for TypeORM testing by Oleg "OSA413" Sokolov

/**
 * TODOs:
 * 1. Length of columns
 * 2. Dimensions of numbers (floats/doubles)
 */

import { Column, Entity, Index, JoinColumn, OneToMany, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

// FIXME: currently Postgres returns string for numeric columns
const NumberTransformer = {
    from: (value: any): number => {
        return Number(value)
    },
    to: (value: any): string => {
        return value
    },
}

@Entity("artist") 
export class Artist {
    // artist_id INT NOT NULL,
    // CONSTRAINT artist_pkey PRIMARY KEY  (artist_id)
    @PrimaryColumn({name: "artist_id", primaryKeyConstraintName: "artist_pkey"})
    artistId: number;

    // name VARCHAR(120),
    @Column({name: "name", nullable: true})
    name: string;
}

@Entity("genre")
export class Genre {
    // genre_id INT NOT NULL,
    // CONSTRAINT genre_pkey PRIMARY KEY  (genre_id)
    @PrimaryColumn({name: "genre_id", primaryKeyConstraintName: "genre_pkey"})
    genreId: number;

    // name VARCHAR(120),
    @Column({name: "name", nullable: true})
    name: string;
}

@Entity("playlist")
export class Playlist {
    // playlist_id INT NOT NULL,
    // CONSTRAINT playlist_pkey PRIMARY KEY  (playlist_id)
    @PrimaryColumn({name: "playlist_id", primaryKeyConstraintName: "playlist_pkey"})
    playlistId: number;
    
    // name VARCHAR(120),
    @Column({name: "name", nullable: true})
    name: string;

    @OneToMany(() => PlaylistTrack, o => o.track)
    tracks: Track[];
}

@Entity("media_type")
export class MediaType {
    // media_type_id INT NOT NULL,
    // CONSTRAINT media_type_pkey PRIMARY KEY  (media_type_id)
    @PrimaryColumn({name: "media_type_id", primaryKeyConstraintName: "media_type_pkey"})
    mediaTypeId: number;

    // name VARCHAR(120),
    @Column({name: "name", nullable: true})
    name: string;
}

@Entity("album")
export class Album {
    // album_id INT NOT NULL,
    // CONSTRAINT album_pkey PRIMARY KEY  (album_id)
    @PrimaryColumn({name: "album_id", primaryKeyConstraintName: "album_pkey"})
    albumId: number;

    // title VARCHAR(160) NOT NULL,
    @Column({name: "title"})
    title: string;

    // artist_id INT NOT NULL,
    // ALTER TABLE album ADD CONSTRAINT album_artist_id_fkey
    //     FOREIGN KEY (artist_id) REFERENCES artist (artist_id) ON DELETE NO ACTION ON UPDATE NO ACTION;
    // CREATE INDEX album_artist_id_idx ON album (artist_id);
    @Index("album_artist_id_idx")
    @ManyToOne(() => Artist, {onDelete: "NO ACTION", onUpdate: "NO ACTION"})
    @JoinColumn({name: "artist_id", foreignKeyConstraintName: "album_artist_id_fkey"})
    artist: Artist;
}

@Entity("employee")
export class Employee {
    // employee_id INT NOT NULL,
    // CONSTRAINT employee_pkey PRIMARY KEY  (employee_id)
    @PrimaryColumn({name: "employee_id", primaryKeyConstraintName: "employee_pkey"})
    employeeId: number;

    // first_name VARCHAR(20) NOT NULL,
    @Column({name: "first_name"})
    firstName: string;
    
    // last_name VARCHAR(20) NOT NULL,
    @Column({name: "last_name"})
    lastName: string;

    // title VARCHAR(30),
    @Column({name: "title", nullable: true})
    title: string;

    // reports_to INT,
    // ALTER TABLE employee ADD CONSTRAINT employee_reports_to_fkey
    //     FOREIGN KEY (reports_to) REFERENCES employee (employee_id) ON DELETE NO ACTION ON UPDATE NO ACTION;
    // CREATE INDEX employee_reports_to_idx ON employee (reports_to);
    @Index("employee_reports_to_idx")
    @ManyToOne(() => Employee, {onDelete: "NO ACTION", onUpdate: "NO ACTION", nullable: true,})
    @JoinColumn({name: "reports_to", foreignKeyConstraintName: "employee_reports_to_fkey"})
    reportsTo: Employee;

    // birth_date TIMESTAMP,
    @Column({name: "birth_date", nullable: true})
    birthDate: Date;
    
    // hire_date TIMESTAMP,
    @Column({name: "hire_date", nullable: true})
    hireDate: Date;
    
    // address VARCHAR(70),
    @Column({name: "address", nullable: true})
    address: string;
    
    // city VARCHAR(40),
    @Column({name: "city", nullable: true})
    city: string;

    // state VARCHAR(40),
    @Column({name: "state", nullable: true})
    state: string;

    // country VARCHAR(40),
    @Column({name: "country", nullable: true})
    country: string;

    // postal_code VARCHAR(10),
    @Column({name: "postal_code", nullable: true})
    postalCode: string;

    // phone VARCHAR(24),
    @Column({name: "phone", nullable: true})
    phone: string;

    // fax VARCHAR(24),
    @Column({name: "fax", nullable: true})
    fax: string;

    // email VARCHAR(60),
    @Column({name: "email", nullable: true})
    email: string;
}


@Entity("customer")
export class Customer {
    // customer_id INT NOT NULL,
    // CONSTRAINT customer_pkey PRIMARY KEY  (customer_id)
    @PrimaryColumn({name: "customer_id", primaryKeyConstraintName: "customer_pkey"})
    customerId: number;

    // first_name VARCHAR(40) NOT NULL,
    @Column({name: "first_name"})
    firstName: string;
    
    // last_name VARCHAR(20) NOT NULL,
    @Column({name: "last_name"})
    lastName: string;

    // company VARCHAR(80),
    @Column({name: "company", nullable: true})
    company: string;
    
    // address VARCHAR(70),
    @Column({name: "address", nullable: true})
    address: string;

    // city VARCHAR(40),
    @Column({name: "city", nullable: true})
    city: string;

    // state VARCHAR(40),
    @Column({name: "state", nullable: true})
    state: string;

    // country VARCHAR(40),
    @Column({name: "country", nullable: true})
    country: string;

    // postal_code VARCHAR(10),
    @Column({name: "postal_code", nullable: true})
    postalCode: string;

    // phone VARCHAR(24),
    @Column({name: "phone", nullable: true})
    phone: string;

    // fax VARCHAR(24),
    @Column({name: "fax", nullable: true})
    fax: string;

    // email VARCHAR(60) NOT NULL,
    @Column({name: "email"})
    email: string;

    // support_rep_id INT,
    // ALTER TABLE customer ADD CONSTRAINT customer_support_rep_id_fkey
    //     FOREIGN KEY (support_rep_id) REFERENCES employee (employee_id) ON DELETE NO ACTION ON UPDATE NO ACTION;
    // CREATE INDEX customer_support_rep_id_idx ON customer (support_rep_id);
    @Index("customer_support_rep_id_idx")
    @ManyToOne(() => Employee, {onDelete: "NO ACTION", onUpdate: "NO ACTION", nullable: true})
    @JoinColumn({name: "support_rep_id", foreignKeyConstraintName: "customer_support_rep_id_fkey"})
    supportRep: Employee;
}

@Entity("invoice")
export class Invoice {
    // invoice_id INT NOT NULL,
    // CONSTRAINT invoice_pkey PRIMARY KEY  (invoice_id)
    @PrimaryColumn({name: "invoice_id", primaryKeyConstraintName: "invoice_pkey"})
    invoiceId: number;

    // customer_id INT NOT NULL,
    // ALTER TABLE invoice ADD CONSTRAINT invoice_customer_id_fkey
    //     FOREIGN KEY (customer_id) REFERENCES customer (customer_id) ON DELETE NO ACTION ON UPDATE NO ACTION;
    // CREATE INDEX invoice_customer_id_idx ON invoice (customer_id);
    @Index("invoice_customer_id_idx")
    @ManyToOne(() => Customer, {onDelete: "NO ACTION", onUpdate: "NO ACTION", nullable: false})
    @JoinColumn({name: "customer_id", foreignKeyConstraintName: "invoice_customer_id_fkey"})
    customer: Customer;

    // invoice_date TIMESTAMP NOT NULL,
    @Column({name: "invoice_date"})
    invoiceDate: Date;

    // billing_address VARCHAR(70),
    @Column({name: "billing_address", nullable: true})
    billingAddress: string;
    
    // billing_city VARCHAR(40),
    @Column({name: "billing_city", nullable: true})
    billingCity: string;
    
    // billing_state VARCHAR(40),
    @Column({name: "billing_state", nullable: true})
    billingState: string;
    
    // billing_country VARCHAR(40),
    @Column({name: "billing_country", nullable: true})
    billingCountry: string;
    
    // billing_postal_code VARCHAR(10),
    @Column({name: "billing_postal_code", nullable: true})
    billingPostalCode: string;
    
    // total NUMERIC(10,2) NOT NULL,
    @Column({name: "total", type: "numeric", precision: 10, scale: 2, transformer: NumberTransformer})
    total: number;
}

@Entity("track")
export class Track {
    // track_id INT NOT NULL,
    // CONSTRAINT track_pkey PRIMARY KEY  (track_id)
    @PrimaryColumn({name: "track_id", primaryKeyConstraintName: "track_pkey"})
    trackId: number;

    // name VARCHAR(200) NOT NULL,
    @Column({name: "name"})
    name: string;
    
    // album_id INT,
    // ALTER TABLE track ADD CONSTRAINT track_album_id_fkey
    //     FOREIGN KEY (album_id) REFERENCES album (album_id) ON DELETE NO ACTION ON UPDATE NO ACTION;
    // CREATE INDEX track_album_id_idx ON track (album_id);
    @Index("track_album_id_idx")
    @ManyToOne(() => Album, {onDelete: "NO ACTION", onUpdate: "NO ACTION", nullable: true})
    @JoinColumn({name: "album_id", foreignKeyConstraintName: "track_album_id_fkey"})
    album: Album;

    // media_type_id INT NOT NULL,
    // ALTER TABLE track ADD CONSTRAINT track_media_type_id_fkey
    //     FOREIGN KEY (media_type_id) REFERENCES media_type (media_type_id) ON DELETE NO ACTION ON UPDATE NO ACTION;
    // CREATE INDEX track_media_type_id_idx ON track (media_type_id);
    @Index("track_media_type_id_idx")
    @ManyToOne(() => MediaType, {onDelete: "NO ACTION", onUpdate: "NO ACTION", nullable: false})
    @JoinColumn({name: "media_type_id", foreignKeyConstraintName: "track_media_type_id_fkey"})
    mediaType: MediaType;

    // genre_id INT,
    // ALTER TABLE track ADD CONSTRAINT track_genre_id_fkey
    //     FOREIGN KEY (genre_id) REFERENCES genre (genre_id) ON DELETE NO ACTION ON UPDATE NO ACTION;
    // CREATE INDEX track_genre_id_idx ON track (genre_id);
    @Index("track_genre_id_idx")
    @ManyToOne(() => Genre, {onDelete: "NO ACTION", onUpdate: "NO ACTION", nullable: true})
    @JoinColumn({name: "genre_id", foreignKeyConstraintName: "track_genre_id_fkey"})
    genre: Genre;

    // composer VARCHAR(220),
    @Column({name: "composer", nullable: true})
    composer: string;

    // milliseconds INT NOT NULL,
    @Column({name: "milliseconds"})
    milliseconds: number;

    // bytes INT,
    @Column({name: "bytes", nullable: true})
    bytes: number;

    // unit_price NUMERIC(10,2) NOT NULL,
    @Column({name: "unit_price", type: "numeric", precision: 10, scale: 2, transformer: NumberTransformer})
    unitPrice: number;

    @OneToMany(() => PlaylistTrack, o => o.playlist)
    playlists: Playlist[];
}

@Entity("invoice_line")
export class InvoiceLine {
    // invoice_line_id INT NOT NULL,
    // CONSTRAINT invoice_line_pkey PRIMARY KEY  (invoice_line_id)
    @PrimaryColumn({name: "invoice_line_id", primaryKeyConstraintName: "invoice_line_pkey"})
    invoiceLineId: number;

    // invoice_id INT NOT NULL,
    // ALTER TABLE invoice_line ADD CONSTRAINT invoice_line_invoice_id_fkey
    //     FOREIGN KEY (invoice_id) REFERENCES invoice (invoice_id) ON DELETE NO ACTION ON UPDATE NO ACTION;
    // CREATE INDEX invoice_line_invoice_id_idx ON invoice_line (invoice_id);
    @Index("invoice_line_invoice_id_idx")
    @ManyToOne(() => Invoice, {onDelete: "NO ACTION", onUpdate: "NO ACTION", nullable: false})
    @JoinColumn({name: "invoice_id", foreignKeyConstraintName: "invoice_line_invoice_id_fkey"})
    invoice: Invoice;
    
    // track_id INT NOT NULL,
    // ALTER TABLE invoice_line ADD CONSTRAINT invoice_line_track_id_fkey
    //     FOREIGN KEY (track_id) REFERENCES track (track_id) ON DELETE NO ACTION ON UPDATE NO ACTION;
    // CREATE INDEX invoice_line_track_id_idx ON invoice_line (track_id);
    @Index("invoice_line_track_id_idx")
    @ManyToOne(() => Track, {onDelete: "NO ACTION", onUpdate: "NO ACTION", nullable: false})
    @JoinColumn({name: "track_id", foreignKeyConstraintName: "invoice_line_track_id_fkey"})
    track: Track;

    // unit_price NUMERIC(10,2) NOT NULL,
    @Column({name: "unit_price", type: "numeric", precision: 10, scale: 2, transformer: NumberTransformer})
    unitPrice: number;

    // quantity INT NOT NULL,
    @Column({name: "quantity"})
    quantity: number;
}

@Entity("playlist_track")
export class PlaylistTrack {
    @PrimaryGeneratedColumn()
    id: number;

    // playlist_id INT NOT NULL,
    // CONSTRAINT playlist_track_pkey PRIMARY KEY  (playlist_id, track_id)
    // ALTER TABLE playlist_track ADD CONSTRAINT playlist_track_playlist_id_fkey
    //     FOREIGN KEY (playlist_id) REFERENCES playlist (playlist_id) ON DELETE NO ACTION ON UPDATE NO ACTION;
    // CREATE INDEX playlist_track_playlist_id_idx ON playlist_track (playlist_id);
    // @PrimaryColumn({name: "playlist_id", primaryKeyConstraintName: "playlist_track_pkey"})
    // playlistId: number;

    @Index("playlist_track_playlist_id_idx")
    @ManyToOne(() => Playlist, {onDelete: "NO ACTION", onUpdate: "NO ACTION", nullable: false})
    @JoinColumn({name: "playlist_id", foreignKeyConstraintName: "playlist_track_playlist_id_fkey"})
    playlist: Playlist;
    
    // track_id INT NOT NULL,
    // CONSTRAINT playlist_track_pkey PRIMARY KEY  (playlist_id, track_id)
    // ALTER TABLE playlist_track ADD CONSTRAINT playlist_track_track_id_fkey
    //     FOREIGN KEY (track_id) REFERENCES track (track_id) ON DELETE NO ACTION ON UPDATE NO ACTION;
    // CREATE INDEX playlist_track_track_id_idx ON playlist_track (track_id);
    // @PrimaryColumn({name: "track_id", primaryKeyConstraintName: "playlist_track_pkey"})
    // trackId: number;

    @Index("playlist_track_track_id_idx")
    @ManyToOne(() => Track, {onDelete: "NO ACTION", onUpdate: "NO ACTION", nullable: false})
    @JoinColumn({name: "track_id", foreignKeyConstraintName: "playlist_track_track_id_fkey"})
    track: Track;
}