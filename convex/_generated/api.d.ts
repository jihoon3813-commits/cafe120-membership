/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as ai from "../ai.js";
import type * as configs from "../configs.js";
import type * as leads from "../leads.js";
import type * as openai from "../openai.js";
import type * as products from "../products.js";
import type * as resources from "../resources.js";
import type * as seed from "../seed.js";
import type * as shop from "../shop.js";
import type * as stores from "../stores.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  ai: typeof ai;
  configs: typeof configs;
  leads: typeof leads;
  openai: typeof openai;
  products: typeof products;
  resources: typeof resources;
  seed: typeof seed;
  shop: typeof shop;
  stores: typeof stores;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
