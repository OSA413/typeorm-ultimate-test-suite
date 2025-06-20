import "reflect-metadata";
import { expect, test, describe, afterAll, beforeAll } from 'vitest'
import {
    closeTestingConnections,
    createTestingConnections,
} from "../../../src/test-utils"
import { DataSource } from "typeorm"
import { Album, Artist, Customer, Employee, Genre, Invoice, InvoiceLine, MediaType, Playlist, Track, PlaylistTrack } from "../../chinook_database/entity/Entities"
import { seedChinookDatabase } from "../../chinook_database/seed"
import { generateTests, getTestName, prepareDataset } from "./generate-select-tests"
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

    return true;
}

describe("Ultimate Test Suite > DML > Select", () => {
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
        test(getTestName(testCase), async () => {
            await Promise.all(dataSources.map(async (dataSource) => {
                if (cantDoOffsetWithoutLimit(dataSource, testCase)) return;
                // Because of big data there's some oddities when trying to get the data without ordering it.
                // So for big datasets we skip the test if it has no order.
                if (testCase.entity.entity === Track && !testCase.order.optionForRepo(testCase.entity.entity)) return;

                const repo = dataSource.getRepository(testCase.entity.entity);

                const baseRepoQueryBuilder = testCase.order.applyOption(testCase.entity.entity,
                    testCase.select.applySelectToQB(testCase.entity.entity,
                        repo.createQueryBuilder(testCase.entity.nameAlias)
                    )
                )
                .where(testCase.where.option(testCase.entity.entity))
                .limit(testCase.limit.option)
                .offset(testCase.offset.option);

                const repoOne = await baseRepoQueryBuilder.comment("repoOne").getOne();
                const repoRawOne = await baseRepoQueryBuilder.comment("repoRawOne").getRawOne();

                expect(repoOne ? cleanUndefinedProperties(repoOne) : null)
                    .to.deep.equal(repoRawOne ? cleanUndefinedProperties(testCase.entity.rawMapper(repoRawOne)) : null)

                const repoMany = await baseRepoQueryBuilder.comment("repoMany").getMany();
                const repoRawMany = await baseRepoQueryBuilder.comment("repoRawMany").getRawMany();

                const commonOptions = {
                    where: testCase.where.option(testCase.entity.entity),
                    select: testCase.select.selectOption(testCase.entity.entity),
                    order: testCase.order.optionForRepo(testCase.entity.entity),
                }

                const {dataset: preparedDataset, first: firstFromDataset} = prepareDataset(testCase, dataSource.driver.options.type);
                
                const repoFindOne = await repo.findOne(commonOptions);
                if (calculateExceptionForDeepEqualDataset(testCase, dataSource.driver.options.type)
                    && calculateExceptionForHasDeepMembers(testCase, dataSource.driver.options.type))
                    expect(repoFindOne ? cleanUndefinedProperties(repoFindOne) : null)
                        .to.deep.equal(firstFromDataset ? cleanUndefinedProperties(firstFromDataset) : null);

                const repoFind = await repo.find({
                    ...commonOptions,
                    skip: testCase.offset.option,
                    take: testCase.limit.option,
                });

                expect(repoFind).to.deep.equal(repoMany);

                if (!(dataSource.driver instanceof AbstractSqliteDriver)) {
                    const stream = await baseRepoQueryBuilder.stream()
                    if (!(dataSource.driver.options.type === "spanner"))
                        await new Promise((ok) => stream.once("readable", ok))
                    const data: any[] = []
                    stream.on("data", (row) => data.push(row))
                    await new Promise((ok) => stream.once("end", ok))
                    expect(data).to.deep.equal(repoRawMany);
                }

                const baseQueryBuilderFrom = testCase.order.applyOption(testCase.entity.entity,
                    testCase.select.applySelectToQB(testCase.entity.entity,
                        dataSource.createQueryBuilder()
                    )
                )
                .from(testCase.entity.entity, testCase.entity.nameAlias)
                .where(testCase.where.option(testCase.entity.entity))
                .limit(testCase.limit.option)
                .offset(testCase.offset.option)
                
                const fromOne = await baseQueryBuilderFrom.comment("fromOne").getOne();
                const fromRawOne = await baseQueryBuilderFrom.comment("fromRawOne").getRawOne()
                const fromMany = await baseQueryBuilderFrom.comment("fromMany").getMany()
                const fromRawMany = await baseQueryBuilderFrom.comment("fromRawMany").getRawMany()

                // TODO? describe this "feature"?
                if (testCase.select.selectOption(testCase.entity.entity) === undefined) {
                    expect(fromOne).to.deep.equal(null);
                    expect(repoRawOne ? testCase.entity.rawMapper(repoRawOne) : null).to.deep.equal(fromRawOne ? testCase.entity.rawFromMapper(fromRawOne) : null);
                    expect(fromMany).to.deep.equal([]);
                    expect(repoRawMany.map(testCase.entity.rawMapper)).to.deep.equal(fromRawMany.map(testCase.entity.rawFromMapper));
                }
                else {
                    expect(repoOne).to.deep.equal(fromOne);
                    expect(repoRawOne ? testCase.entity.rawMapper(repoRawOne) : null).to.deep.equal(fromRawOne ? testCase.entity.rawMapper(fromRawOne) : null);

                    // I couldn't figure out how to make a sort like DB does
                    if (calculateExceptionForDeepEqualDataset(testCase, dataSource.driver.options.type))
                        expect(fromMany.map(cleanUndefinedProperties)).to.deep.equal(preparedDataset.map(cleanUndefinedProperties));
                    else if (calculateExceptionForHasDeepMembers(testCase, dataSource.driver.options.type))
                        expect(fromMany.map(cleanUndefinedProperties)).to.have.deep.members(preparedDataset.map(cleanUndefinedProperties));
                    expect(repoRawMany.map(testCase.entity.rawMapper)).to.deep.equal(fromRawMany.map(testCase.entity.rawMapper));
                }
                
                expect(repoRawMany.map(testCase.entity.rawMapper).map(cleanUndefinedProperties))
                    .to.deep.equal(repoFind.map(cleanUndefinedProperties));

                if (!(dataSource.driver instanceof AbstractSqliteDriver)) {
                    const stream = await baseQueryBuilderFrom.stream()
                    if (!(dataSource.driver.options.type === "spanner"))
                        await new Promise((ok) => stream.once("readable", ok))
                    const data: any[] = []
                    stream.on("data", (row) => data.push(row))
                    await new Promise((ok) => stream.once("end", ok))
                    expect(data).to.deep.equal(fromRawMany);
                }
            }));
        })
    })
})
