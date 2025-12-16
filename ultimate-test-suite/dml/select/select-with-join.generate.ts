import { Album, Artist, Customer, Employee, Genre, Invoice, InvoiceLine, MediaType, Playlist, PlaylistTrack, Track } from "../../chinook_database/entity/Entities";
import { faker } from '@faker-js/faker';

type RelationTestNode = {
    entity: {
        entity: any;
        field: string,
    };
    branches: RelationTestNode[];
};

const artistRelations: RelationTestNode = { 
    entity: {
        entity: Artist,
        field: "artist",
    }, 
    branches: []
};
const albumRelations: RelationTestNode = {
    entity: {
        entity: Album,
        field: "album",
    },
    branches: []
};
const trackRelations: RelationTestNode = {
    entity: {
        entity: Track,
        field: "track",
    },
    branches: []
};
const mediaTypeRelations: RelationTestNode = {
    entity: {
        entity: MediaType,
        field: "mediaType",
    },
    branches: []
};
const genreRelations: RelationTestNode = {
    entity: {
        entity: Genre,
        field: "genre",
    },
    branches: []
};
const playlistRelations: RelationTestNode = {
    entity: {
        entity: Playlist,
        field: "playlist",
    },
    branches: []
};
const playlistTrackRelations: RelationTestNode = {
    entity: {
        entity: PlaylistTrack,
        field: "playlistTrack",
    },
    branches: []
};
const employeeRelations: RelationTestNode = {
    entity: {
        entity: Employee,
        field: "employee",
    },
    branches: []
};
const customerRelations: RelationTestNode = {
    entity: {
        entity: Customer,
        field: "customer",
    },
    branches: []
};
const invoiceRelations: RelationTestNode = {
    entity: {
        entity: Invoice,
        field: "invoice",
    },
    branches: []
};
const invoiceLineRelations: RelationTestNode = {
    entity: {
        entity: InvoiceLine,
        field: "invoiceLine",
    },
    branches: []
};

artistRelations.branches = [albumRelations];
albumRelations.branches = [artistRelations, trackRelations];
trackRelations.branches = [mediaTypeRelations, albumRelations, invoiceLineRelations];
mediaTypeRelations.branches = [trackRelations];
genreRelations.branches = [trackRelations];
playlistRelations.branches = [playlistTrackRelations];
playlistTrackRelations.branches = [playlistRelations, trackRelations];
employeeRelations.branches = [customerRelations];
customerRelations.branches = [invoiceRelations, employeeRelations];
invoiceRelations.branches = [invoiceLineRelations];
invoiceLineRelations.branches = [invoiceRelations, trackRelations];

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
    findRelations?: TestCase[];
}

const findRelations = (entity: any) => {
    return relationRoots.find(x => x.entity.entity === entity);
}

const walkRoot = (currentNode: TestCase, root: RelationTestNode, depth: number, range: number): TestCase => {
    const testCase: TestCase = {
        entity: currentNode.entity ?? root.entity,
        findRelations: currentNode.findRelations ?? 
            faker.helpers.arrayElements(root.branches, range).map((branch) => ({
                entity: branch.entity,
            })),
    }

    if (depth > 0) {
        testCase.findRelations = testCase.findRelations.map((findRelation) => walkRoot(findRelation, findRelations(findRelation.entity), depth - 1, range));
    }

    return testCase;
}

const _generateTests = () => {
    const tests = []
    const roots = relationRoots.slice(0, 1);
    for (let depth = 1; depth <= 8; depth*=2) {
        for (let range = 1; range <= 8; range*=2) {
            for (const root of roots) {
                tests.push(walkRoot({}, root, depth, range));
            }
        }
    }

    // TODO: transform tests to object and array of finds

    return tests;
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