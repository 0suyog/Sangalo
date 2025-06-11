import { GraphQLError, GraphQLScalarType, Kind } from "graphql";

export const GraphQlDate = new GraphQLScalarType({
	name: "Date",
	description: "Graphql scalar Date",
	serialize: (outPutData: unknown) => {
		if (outPutData instanceof Date) {
			return outPutData.toISOString();
		}
		if (typeof outPutData === "string") {
			if (Date.parse(outPutData)) {
				return outPutData;
			}
		}
		throw new GraphQLError(
			"The Data in db for this specific instance seems to be corrupted, if you see this contact developer "
		);
	},
	parseValue: (inputValue: unknown) => {
		if (typeof inputValue === "string" && Date.parse(inputValue)) {
			return new Date(inputValue).toISOString();
		}
		throw new GraphQLError("Expected a Date field", {
			extensions: {
				error: "INVALID_DATA_FORMAT",
				input: inputValue,
			},
		});
	},
	parseLiteral: (ast) => {
		if (ast.kind === Kind.STRING) {
			return new Date(ast.value).toISOString()
		}
		throw new GraphQLError("Date should be a string", {
			extensions: { error: "INVALID_DATA_FORMAT", input: ast },
		});
	},
});
