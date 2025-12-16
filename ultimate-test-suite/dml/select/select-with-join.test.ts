import "reflect-metadata";
import { test, describe, afterAll, beforeAll } from 'vitest'
import {
    closeTestingConnections,
    createTestingConnections,
} from "../../../src/test-utils"
import { DataSource } from "typeorm"
import { Album, Artist, Customer, Employee, Genre, Invoice, InvoiceLine, MediaType, Playlist, Track, PlaylistTrack } from "../../chinook_database/entity/Entities"
import { seedChinookDatabase } from "../../chinook_database/seed"

describe.todo("Ultimate Test Suite > DML > Select (Joins)", () => {
    let dataSources: DataSource[]
    beforeAll(async () => {
        dataSources = await createTestingConnections({
            schemaCreate: true,
            dropSchema: true,
            entities: [
                Album, Artist, Customer, Employee, Genre, Invoice, InvoiceLine, MediaType, Playlist, Track, PlaylistTrack
            ],
        });

        await Promise.all(dataSources.map(seedChinookDatabase))
    })
    afterAll(() => closeTestingConnections(dataSources))

    test.todo("Artist-Album", async() => {
        await Promise.all(dataSources.map(async dataSource => {
            const repo = dataSource.getRepository(Artist);
            await repo.find({
                relations: ["albums"]
            })
        }))
    })

    test("Album-Artist", async() => {
        await Promise.all(dataSources.map(async dataSource => {
            const repo = dataSource.getRepository(Album);
            await repo.find({
                relations: ["artist"]
            })
        }))
    })
})
