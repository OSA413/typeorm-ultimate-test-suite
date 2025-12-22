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

const sortAllArraysInObject = (object: any) => {
    if (!object) return;
    Object.values(object).forEach((value => {
        if (Array.isArray(value)) {
            value.forEach(v => sortAllArraysInObject(v));
            value.sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
        }
        else if (typeof value === "object") {
            sortAllArraysInObject(value);
        }
    }))
}

describe("Ultimate Test Suite > DML > Select (Joins)", () => {
    let dataSources: DataSource[]
    beforeAll(async () => {
        dataSources = await createTestingConnections({
            entities: [
                Album, Artist, Customer, Employee, Genre, Invoice, InvoiceLine, MediaType, Playlist, Track, PlaylistTrack
            ],
        });

        await Promise.all(dataSources.filter(dataSource => dataSource.driver.options.type === "sqljs").map(async dataSource => {
            await dataSource.synchronize();
            await seedChinookDatabase(dataSource);
        }));
    })
    afterAll(() => closeTestingConnections(dataSources))

    generateTests().map(testCase => {
        test(testCase.metadata.entity.entity.name+": "+JSON.stringify(testCase.find), async () => {
            await Promise.all(dataSources.map(async dataSource => {
                const repo = dataSource.getRepository(testCase.metadata.entity.entity);
                const findResult = await repo.find({
                    relations: testCase.find,
                })
                const byStringResult = await repo.find({
                    relations: testCase.byString,
                })

                if (dataSource.driver.options.type === "mssql") {
                    sortAllArraysInObject(findResult);
                    sortAllArraysInObject(byStringResult);
                }
                expect(findResult).toEqual(byStringResult);
            }));
        })
    })
})
