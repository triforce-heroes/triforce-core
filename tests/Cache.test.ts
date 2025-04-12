/* eslint-disable vitest/max-expects */
import { describe, expect, it } from "vitest";

import { Cache } from "@/Cache.js";

describe("class Cache", () => {
  it("general", () => {
    expect.assertions(28);

    const cache = new Cache(4);

    expect(cache.capacity).toBe(4);
    expect(cache.stored).toBe(0);

    cache.set("a", 1);

    expect(cache.capacity).toBe(4);
    expect(cache.stored).toBe(1);
    expect(cache.get("a")).toBe(1);

    cache.set("a", 2);

    expect(cache.stored).toBe(1);
    expect(cache.get("a")).toBe(2);

    cache.remember("a", () => expect.fail());

    expect(cache.get("a")).toBe(2);

    cache.remember("b", () => 2);

    expect(cache.stored).toBe(2);
    expect(cache.get("b")).toBe(2);
    expect(cache.values()).toStrictEqual([2, 2]);
    expect(cache.entries()).toStrictEqual(
      new Map([
        ["a", 2],
        ["b", 2],
      ]),
    );

    cache.forget("b");

    expect(cache.stored).toBe(1);
    expect(cache.get("b")).toBeUndefined();

    cache.flush();

    expect(cache.stored).toBe(0);
    expect(cache.get("a")).toBeUndefined();

    cache.setCapacity(2);

    expect(cache.capacity).toBe(2);

    cache.set("a", 1);
    cache.set("b", 1);

    expect(cache.keys()).toStrictEqual(new Set(["a", "b"]));

    cache.set("b", 2);

    expect(cache.keys()).toStrictEqual(new Set(["a", "b"]));

    cache.set("c", 3);

    expect(cache.keys()).toStrictEqual(new Set(["b", "c"]));
    expect(cache.get("a")).toBeUndefined();

    cache.setCapacity(1);

    expect(cache.keys()).toStrictEqual(new Set(["c"]));
    expect(cache.get("b")).toBeUndefined();

    cache.setCapacity(2);

    expect(cache.keys()).toStrictEqual(new Set(["c"]));
    expect(cache.get("b")).toBeUndefined();

    cache.setCapacity(0);

    expect(cache.keys()).toStrictEqual(new Set());
    expect(cache.get("c")).toBeUndefined();

    cache.set("d", 4);

    expect(cache.get("d")).toBeUndefined();
  });
});
