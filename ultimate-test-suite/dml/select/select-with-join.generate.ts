import { Album, Artist, Customer, Employee, Genre, Invoice, InvoiceLine, MediaType, Playlist, PlaylistTrack, Track } from "../../chinook_database/entity/Entities";
import { faker } from '@faker-js/faker';

type RelationTestNode = {
    entity: any;
    branches: {field: string, node: RelationTestNode}[];
};

const artistRelations: RelationTestNode = { 
    entity: Artist,
    branches: []
};
const albumRelations: RelationTestNode = {
    entity: Album,
    branches: []
};
const trackRelations: RelationTestNode = {
    entity: Track,
    branches: []
};
const mediaTypeRelations: RelationTestNode = {
    entity: MediaType,
    branches: []
};
const genreRelations: RelationTestNode = {
    entity: Genre,
    branches: []
};
const playlistRelations: RelationTestNode = {
    entity: Playlist,
    branches: []
};
const playlistTrackRelations: RelationTestNode = {
    entity: PlaylistTrack,
    branches: []
};
const employeeRelations: RelationTestNode = {
    entity: Employee,
    branches: []
};
const customerRelations: RelationTestNode = {
    entity: Customer,
    branches: []
};
const invoiceRelations: RelationTestNode = {
    entity: Invoice,
    branches: []
};
const invoiceLineRelations: RelationTestNode = {
    entity: InvoiceLine,
    branches: []
};

artistRelations.branches = [{field: "albums", node: albumRelations}];
albumRelations.branches = [{field: "artist", node: artistRelations}, {field: "tracks", node: trackRelations}];
trackRelations.branches = [{field: "mediaType", node: mediaTypeRelations}, {field: "album", node: albumRelations}, {field: "invoiceLines", node: invoiceLineRelations}];
mediaTypeRelations.branches = [{field: "tracks", node: trackRelations}];
genreRelations.branches = [{field: "tracks", node: trackRelations}];
playlistRelations.branches = [{field: "playlistTracks", node: playlistTrackRelations}];
playlistTrackRelations.branches = [{field: "playlist", node: playlistRelations}, {field: "track", node: trackRelations}];
employeeRelations.branches = [{field: "customers", node: customerRelations}, {field: "reportsTo", node: employeeRelations}];
customerRelations.branches = [{field: "invoices", node: invoiceRelations}, {field: "supportRep", node: employeeRelations}];
invoiceRelations.branches = [{field: "invoiceLines", node: invoiceLineRelations}, {field: "customer", node: customerRelations}];
invoiceLineRelations.branches = [{field: "invoice", node: invoiceRelations}, {field: "track", node: trackRelations}];

const relationRoots = [
    artistRelations,
    albumRelations,
    trackRelations,
    mediaTypeRelations,
    genreRelations,
    playlistRelations,
    playlistTrackRelations,
    employeeRelations,
    customerRelations,
    invoiceRelations,
    invoiceLineRelations,
];

type TestCase = {
    entity?: any;
    relations?: TestCase[];
}

const findRelations = (entity: any) => {
    return relationRoots.find(x => x.entity.name === entity.name);
}

const walkRoot = (currentNode: TestCase, root: RelationTestNode, alreadyVisitedEntities: string[], depth: number): TestCase => {
    const testCase: TestCase = {
        entity: currentNode.entity ?? root,
        relations: faker.helpers.arrayElements(root.branches, {min: 1, max: 4}).map((branch) => ({
                entity: branch,
                relations: [],
            }))
            .filter(x => 
                !alreadyVisitedEntities.includes(x.entity.node.entity.name)
                || (
                    alreadyVisitedEntities.filter(x => x === "Employee").length <= 3
                    && x.entity.node.entity.name === "Employee"
                )
            ),
    }

    alreadyVisitedEntities.push(testCase.entity.entity?.name ?? testCase.entity.node.entity.name);

    if (depth > 1) {
        testCase.relations = testCase.relations.map((findRelation) => walkRoot(findRelation, findRelations(findRelation.entity.node.entity), alreadyVisitedEntities, depth - 1));
    }

    return testCase;
}

const transformToFind = (root: TestCase) => {
    return Object.fromEntries(root.relations.map(relation => {
        return [relation.entity.field, relation.relations.length ? transformToFind(relation) : true]
    }))
}

const transformFindToBySring = (find, prefix = "") => {
    return Object.keys(find).map(key => find[key] === true ? [`${prefix}${key}`] : transformFindToBySring(find[key], `${prefix}${key}.`)).flatMap(x => x);
}

const _generateTests = () => {
    const tests: TestCase[] = []
    const roots = relationRoots;
    for (let depth = 1; depth < 20; depth++) {
        for (const root of roots) {
            for (let i = 0; i < 1000; i++) {
                tests.push(walkRoot({}, root, [], depth));
            }
        }
    }

    const transformedTests = tests.map(test => {
        const find = transformToFind(test);
        return {
            metadata: test,
            find,
            byString: transformFindToBySring(find)
        }
    })

    return transformedTests;
}

const optimizeTests = (tests: ReturnType<typeof _generateTests>) => {
    return Array.from(new Map(tests.map(test => [test.metadata.entity.entity.name+": "+JSON.stringify(test.find), test])).values())
}

export const generateTests = () => {
    console.log("Ultimate Test Suite > DML > Select (Joins)")
    console.log("Generating tests...")
    const allTests = _generateTests()
    console.log(`Generated ${allTests.length} tests, optimizing...`)
    const optimizedTests = optimizeTests(allTests);
    console.log(`Optimization complete, reduced to ${optimizedTests.length} tests (${Math.floor(100-(optimizedTests.length / allTests.length * 100))}% reduction)`)
    return optimizedTests;
}
