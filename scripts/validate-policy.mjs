import { existsSync, readFileSync } from "node:fs";

const requiredFiles = [
  "lib/policy.ts",
  "middleware.ts",
  "lib/api-auth.ts",
  "lib/tenant-auth.ts",
  "sql/rls_policies-functions.sql",
  "docs/POLICY_AS_CODE.md",
];

const missingFiles = requiredFiles.filter((file) => !existsSync(file));
if (missingFiles.length > 0) {
  console.error(`Policy files missing: ${missingFiles.join(", ")}`);
  process.exit(1);
}

const policy = readFileSync("lib/policy.ts", "utf8");
const documentation = readFileSync("docs/POLICY_AS_CODE.md", "utf8");
const rlsFiles = ["sql/schema.sql", "sql/rls_policies-functions.sql"];
const requiredTerms = ["USER_TYPES", "PUBLIC_ROUTES", "PUBLIC_API_ROUTES", "ADMIN_EMAILS", "POLICY_VERSION"];
const missingTerms = requiredTerms.filter((term) => !policy.includes(term));
const recursiveRlsPattern = /auth\.uid\(\)\s+IN\s*\(\s*SELECT\s+id\s+FROM\s+users\s+WHERE\s+user_type\s*=\s*'Regulator'/;
const hasRecursiveRlsPolicy = rlsFiles.some((file) => recursiveRlsPattern.test(readFileSync(file, "utf8")));

if (missingTerms.length > 0 || !documentation.includes("Policy as Code") || hasRecursiveRlsPolicy) {
  console.error("Policy source or documentation is incomplete.");
  process.exit(1);
}

console.log("Policy as code validation passed.");
