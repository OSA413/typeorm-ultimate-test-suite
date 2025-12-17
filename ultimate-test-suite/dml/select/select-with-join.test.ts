import "reflect-metadata";
import { test, describe, afterAll, beforeAll, expect } from 'vitest'
import {
    closeTestingConnections,
    createTestingConnections,
} from "../../../src/test-utils"
import { DataSource } from "typeorm"
import { Album, Artist, Customer, Employee, Genre, Invoice, InvoiceLine, MediaType, Playlist, Track, PlaylistTrack } from "../../chinook_database/entity/Entities"
import { seedChinookDatabase } from "../../chinook_database/seed"
import { generateTests } from "./select-with-join.generate";

describe("Ultimate Test Suite > DML > Select (Joins)", () => {
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

    generateTests().map(testCase => {
        test(JSON.stringify(testCase.find), async () => {
            await Promise.all(dataSources.map(async dataSource => {
                const repo = dataSource.getRepository(testCase.metadata.entity);
                const findResult = await repo.find({
                    relations: testCase.find,
                })
                const byStringResult = await repo.find({
                    relations: testCase.byString,
                })

                expect(findResult).toEqual(byStringResult);
            }));
        })
    })
})
