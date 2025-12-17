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
albumRelations.branches = [{field: "albums", node: artistRelations}, {field: "albums", node: trackRelations}];
trackRelations.branches = [{field: "albums", node: mediaTypeRelations}, {field: "albums", node: albumRelations}, {field: "albums", node: invoiceLineRelations}];
mediaTypeRelations.branches = [{field: "albums", node: trackRelations}];
genreRelations.branches = [{field: "albums", node: trackRelations}];
playlistRelations.branches = [{field: "albums", node: playlistTrackRelations}];
playlistTrackRelations.branches = [{field: "albums", node: playlistRelations}, {field: "albums", node: trackRelations}];
employeeRelations.branches = [{field: "albums", node: customerRelations}];
customerRelations.branches = [{field: "albums", node: invoiceRelations}, {field: "albums", node: employeeRelations}];
invoiceRelations.branches = [{field: "albums", node: invoiceLineRelations}];
invoiceLineRelations.branches = [{field: "albums", node: invoiceRelations}, {field: "albums", node: trackRelations}];

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
]

type TestCase = {
    entity?: any;
    relations?: TestCase[];
}

const findRelations = (entity: any) => {
    return relationRoots.find(x => x.entity === entity);
}

const walkRoot = (currentNode: TestCase, root: RelationTestNode, depth: number, range: number): TestCase => {
    const testCase: TestCase = {
        entity: currentNode.entity ?? root.entity,
        relations: currentNode.relations ?? 
            faker.helpers.arrayElements(root.branches, range).map((branch) => ({
                entity: branch,
                relations: [],
            })),
    }

    if (depth > 1) {
        testCase.relations = testCase.relations.map((findRelation) => walkRoot(findRelation, findRelations(findRelation.entity), depth - 1, range));
    }

    return testCase;
}

const transformToFind = (root: TestCase) => {
    return Object.fromEntries(root.relations.map(relation => {
        return [relation.entity.field, relation.relations.length ? transformToFind(relation) : true]
    }))
}

const transformFindToBySring = (find, prefix = "") => {
    return Object.keys(find).map(key => find[key] === true ? [`${prefix}${key}`] : transformFindToBySring(find[key], `${key}.`)).flatMap(x => x);
}

const _generateTests = () => {
    const tests: TestCase[] = []
    const roots = relationRoots.slice(0, 1);
    for (let depth = 1; depth <= 8; depth*=2) {
        for (let range = 1; range <= 8; range*=2) {
            for (const root of roots) {
                tests.push(walkRoot({}, root, depth, range));
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

export const generateTests = () => {
    console.log("Ultimate Test Suite > DML > Select (Joins)")
    console.log("Generating tests...")
    const allTests = _generateTests()
    // console.log(`Generated ${allTests.length} tests, optimizing...`)
    // const optimizedTests = optimizeTests(allTests);
    const optimizedTests = allTests;
    // console.log(`Optimization complete, reduced to ${optimizedTests.length} tests (${Math.floor(100-(optimizedTests.length / allTests.length * 100))}% reduction)`)
    return optimizedTests;
}