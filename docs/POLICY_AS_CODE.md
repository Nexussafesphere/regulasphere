# Policy as Code

RegulaSphere keeps security and data-access rules in version-controlled code. The policy has two enforcement layers:

1. `lib/policy.ts` is the typed application policy source. It defines supported user types, public routes, public authentication API routes, admin identities, and the policy version.
2. `middleware.ts`, `lib/api-auth.ts`, `lib/tenant-auth.ts`, and admin route guards enforce those rules at request time.
3. `sql/rls_policies-functions.sql` enforces tenant isolation and role restrictions inside PostgreSQL. Database enforcement remains active even if an application route is changed.

## Rules

- Authentication is required for every API route except login, registration, and logout.
- Admin APIs require an authenticated email listed in the policy module.
- Business-scoped reads and writes require ownership of the business, unless the caller is an approved admin.
- User roles and identity fields cannot be changed through self-service updates.
- Credentials are owned by Supabase Auth. Application profile tables must not store plaintext passwords.
- API handlers must validate input, cap untrusted text, and return generic internal-error responses.
- Any change to roles, public routes, admin identities, tenant access, or RLS policies must update the corresponding tests and this document.

## Applying Database Policy

Apply `sql/schema.sql`, then `sql/rls_policies-functions.sql`, and then `sql/seed_data.sql` in Supabase. Both SQL policy files use the non-recursive `public.current_user_type()` helper. Review the migration in a non-production project first, then verify cross-tenant reads and writes with separate Business, Consultant, Regulator, and Admin accounts.

## Policy Review

The policy version is recorded in `lib/policy.ts` as `POLICY_VERSION`. Increment it when access-control behavior changes and include the change in the deployment notes.
