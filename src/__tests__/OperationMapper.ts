import * as fs from 'fs';
import {
	buildClientSchema,
	parse,
	DocumentNode,
	GraphQLInt,
	GraphQLInterfaceType,
	GraphQLID,
	GraphQLNonNull,
	GraphQLObjectType,
	GraphQLString,
	Source,
} from 'graphql';
import * as path from 'path';
import { mapOperationType } from '../OperationMapper';

function textToAST(text: string): DocumentNode {
	return parse(new Source(text));
}

const schema = buildClientSchema(JSON.parse(fs.readFileSync(path.resolve(__dirname, 'schema.json'), 'utf-8')).data);

test('Can remove ignored fields', () => {
	const ast = textToAST(`query {
	person(personID: 4) {
		ignoredName: __typename
		name
	}
}`);

	const mapped = mapOperationType(schema, ast, ['ignoredName']);

	const schemaType = schema.getType('Person');
	if (schemaType == null) {
		throw new Error('Schema type Person was not found');
	}

	const querySchemaType = schema.getQueryType();
	if (querySchemaType == null) {
		throw new Error('Query schema type was not found');
	}

	const expected: typeof mapped = {
		fields: [
			{
				exportName: null,
				fieldName: 'person',
				resultFieldName: 'person',
				schemaType: schemaType,
				type: {
					fields: [
						{
							exportName: null,
							fieldName: 'name',
							resultFieldName: 'name',
							schemaType: GraphQLString,
							type: {
								kind: 'Scalar',
								knownPossibleValues: null,
								schemaType: GraphQLString,
							},
						},
					],
					fragmentSpreads: [],
					kind: 'Object',
					schemaType: schemaType,
				},
			},
		],
		fragmentSpreads: [],
		kind: 'Object',
		schemaType: querySchemaType,
	};
	expect(mapped).toEqual(expected);
});
