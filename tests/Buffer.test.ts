import { describe, it, expect } from "vitest";

import { isAscii } from "@/Buffer.js";

describe("function isAscii", () => {
  it("returns true for empty buffer", () => {
    expect(isAscii(Buffer.from([]))).toBe(true);
  });

  it("returns true for ASCII buffer", () => {
    expect(isAscii(Buffer.from("Hello"))).toBe(true);
  });

  it("returns true for buffer with byte 0x7f", () => {
    expect(isAscii(Buffer.from([0x7f]))).toBe(true);
  });

  it("returns false for buffer with byte 0x80", () => {
    expect(isAscii(Buffer.from([0x80]))).toBe(false);
  });

  it("returns false for buffer with byte 0xff", () => {
    expect(isAscii(Buffer.from([0xff]))).toBe(false);
  });

  it("returns false for UTF-8 encoded non-ASCII", () => {
    expect(isAscii(Buffer.from("é"))).toBe(false);
  });

  it("returns false for mixed ASCII and non-ASCII", () => {
    expect(isAscii(Buffer.from("HelloéWorld"))).toBe(false);
  });

  it("returns true for all bytes 0x00-0x7f", () => {
    const buffer = Buffer.alloc(128);

    for (let i = 0; i < 128; i++) {
      buffer[i] = i;
    }

    expect(isAscii(buffer)).toBe(true);
  });

  it("returns false when one byte exceeds 0x7f", () => {
    const buffer = Buffer.alloc(128);

    for (let i = 0; i < 128; i++) {
      buffer[i] = i;
    }

    buffer[100] = 0x80;

    expect(isAscii(buffer)).toBe(false);
  });
});
