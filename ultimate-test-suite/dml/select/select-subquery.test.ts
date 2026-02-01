import "reflect-metadata";
import { expect, test, describe, afterAll, beforeAll } from 'vitest'
import {
    closeTestingConnections,
    createTestingConnections,
} from "../../../src/test-utils"
import { DataSource } from "typeorm"
import { Album, Artist, Customer, Employee, Genre, Invoice, InvoiceLine, MediaType, Playlist, Track, PlaylistTrack } from "../../chinook_database/entity/Entities"
import { seedChinookDatabase } from "../../chinook_database/seed"
import { generateTests, getTestName, prepareDataset } from "./select.test.generate"
import { AbstractSqliteDriver } from "typeorm/driver/sqlite-abstract/AbstractSqliteDriver"
import { DriverUtils } from "typeorm/driver/DriverUtils"
import { cleanUndefinedProperties } from "../../helpers/cleanUndefinedProperties"

// TODO: get rid of `cleanUndefinedProperties`

// TODO: move this function to the main source code
const doesTheDBNotSupportOffsetWithoutLimit = (dataSource: DataSource) => {
    return (
        DriverUtils.isMySQLFamily(dataSource.driver) ||
        dataSource.driver.options.type === "aurora-mysql" ||
        dataSource.driver.options.type === "sap" ||
        dataSource.driver.options.type === "spanner"
    )
}

const cantDoOffsetWithoutLimit = (dataSource: DataSource, testCase: ReturnType<typeof generateTests>[number]) => {
    return doesTheDBNotSupportOffsetWithoutLimit(dataSource) && testCase.offset.option && !testCase.limit.option
}

// TODO figure out sorting algorithm for other DBs
const calculateExceptionForDeepEqualDataset = (testCase: ReturnType<typeof generateTests>[number], dbType: string) => {
    if (testCase.entity.entity === PlaylistTrack)
        return false;

    if (testCase.entity.entity === Invoice && dbType !== "postgres")
        if (!testCase.order.optionForRepo(testCase.entity.entity)
        || (testCase.order.optionForRepo(testCase.entity.entity)?.billingAddress && ["better-sqlite3", "sqljs", "sqlite", "cockroachdb", "oracle"].includes(dbType))
        || ["mysql", "mariadb"].includes(dbType) && testCase.where.option(testCase.entity.entity))
            return false;

    if (testCase.entity.entity === InvoiceLine && dbType !== "postgres")
        if ((!testCase.order.optionForRepo(testCase.entity.entity) && ["better-sqlite3", "sqljs", "sqlite", "oracle"].includes(dbType)))
            return false;

    if (testCase.entity.entity === Employee && dbType !== "postgres")
        if (!testCase.order.optionForRepo(testCase.entity.entity))
            return false;

    if (testCase.entity.entity === Customer && dbType !== "postgres")
        if (!testCase.order.optionForRepo(testCase.entity.entity)
        || testCase.order.optionForRepo(testCase.entity.entity)?.country)
            return false;

    if (testCase.entity.entity === Artist && dbType !== "postgres") {
        if (testCase.order.optionForRepo(testCase.entity.entity)?.name
    || ["mysql", "mariadb"].includes(dbType) && testCase.where.option(testCase.entity.entity)
    || ["oracle"].includes(dbType) && !testCase.order.optionForRepo(testCase.entity.entity))
            return false;
    }

    if (testCase.entity.entity === Track) {
        if (testCase.order.optionForRepo(testCase.entity.entity)?.name)
            return false;
    }
    if (testCase.entity.entity === Album && dbType !== "postgres") {
        if (!testCase.order.optionForRepo(testCase.entity.entity)
        || testCase.order.optionForRepo(testCase.entity.entity)?.title)
            return false;
    }
    if (testCase.entity.entity === Playlist && dbType !== "postgres") {
        if (testCase.order.optionForRepo(testCase.entity.entity)?.name)
            return false;
    }
    return true;
}

// TODO: figure out correct filter for MySQL on GHA
const calculateExceptionForHasDeepMembers = (testCase: ReturnType<typeof generateTests>[number], dbType: string) => {
    // if (testCase.entity.entity === Album || testCase.entity.entity === Playlist) {
        if (testCase.limit.option || testCase.offset.option)
            return false;
    // }

    // TODO: figure out correct filter for MySQL on GHA
    if (testCase.entity.entity === Artist && dbType !== "postgres") {
        if (["mysql", "mariadb"].includes(dbType) && testCase.where.option(testCase.entity.entity))
            return false;
    }

    // TODO: figure out correct filter for MySQL on GHA
    if (testCase.entity.entity === Invoice && dbType !== "postgres") {
        if (["mysql", "mariadb"].includes(dbType) && testCase.where.option(testCase.entity.entity))
            return false;
    }

    if (testCase.entity.entity === PlaylistTrack) return false;

    if (testCase.entity.entity === Track && testCase.order.optionForRepo(testCase.entity.entity))
        return false;

    return true;
}

describe("Ultimate Test Suite > DML > Select", () => {
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
        test(getTestName(testCase), async ({skip}) => {
            await Promise.all(dataSources.map(async dataSource => {
                if (cantDoOffsetWithoutLimit(dataSource, testCase)) skip();
                // Because of big data there's some oddities when trying to get the data without ordering it.
                // So for big datasets we skip the test if it has no order.
                if (testCase.entity.entity === Track && !testCase.order.optionForRepo(testCase.entity.entity)) skip();
                if (testCase.select.selectOption(testCase.entity.entity) === undefined) skip();
                if (
                    dataSource.driver.options.type === "mssql"
                    && testCase.where.option(testCase.entity.entity).length > 0
                    && !testCase.offset.option
                    && !testCase.limit.option
                ) skip("MSSQL: Error: The ORDER BY clause is invalid in views, inline functions, derived tables, subqueries, and common table expressions, unless TOP, OFFSET or FOR XML is also specified.");
                
                // please note that you have to use dataSource instead of repository
                const baseRepoQueryBuilder = dataSource.createQueryBuilder().from((subquery) => 
                    testCase.order.applyOption(testCase.entity.entity,
                    testCase.select.applySelectToQB(testCase.entity.entity, subquery)
                        .from(testCase.entity.entity, testCase.entity.nameAlias)
                    )
                    .where(testCase.where.option(testCase.entity.entity))
                    .limit(testCase.limit.option)
                    .offset(testCase.offset.option)
                , "subquery");

                const repoRawMany = await baseRepoQueryBuilder.comment("repoMany").getRawMany().then(x => x.map(testCase.entity.rawMapper));

                const {dataset: preparedDataset} = prepareDataset(testCase, dataSource.driver.options.type);

                // I couldn't figure out how to make a sort like DB does
                if (calculateExceptionForDeepEqualDataset(testCase, dataSource.driver.options.type))
                    expect(repoRawMany.map(cleanUndefinedProperties)).to.deep.equal(preparedDataset.map(cleanUndefinedProperties));
                else if (calculateExceptionForHasDeepMembers(testCase, dataSource.driver.options.type))
                    expect(repoRawMany.map(cleanUndefinedProperties)).to.have.deep.members(preparedDataset.map(cleanUndefinedProperties));
            }));
        })
    })
})
