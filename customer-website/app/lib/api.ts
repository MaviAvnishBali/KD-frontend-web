/**
 * Re-exports the unified API client for backwards compatibility.
 * New code should import directly from `./api/endpoints` or `./api/hooks`.
 */
export { api as default } from "./api/client";
export * from "./api/client";
export * from "./api/types";
export * from "./api/endpoints";
export * from "./api/hooks";
