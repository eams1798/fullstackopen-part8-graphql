
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "./src/schema.graphql",
  generates: {
    "src/types/resolvers_generated.ts": {
      plugins: ["typescript", "typescript-resolvers"]
    }
  }
};

export default config;
