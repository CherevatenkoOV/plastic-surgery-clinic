-- This is an empty migration.
ALTER TABLE "user_auth"
    RENAME COLUMN "refresh_token" TO "refresh_token_hash";
