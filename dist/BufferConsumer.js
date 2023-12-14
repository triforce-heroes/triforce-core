"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BufferConsumer = void 0;
class BufferConsumer {
    #buffer;
    #byteOffset = 0;
    constructor(buffer, byteOffset = 0) {
        this.#buffer = buffer;
        this.#byteOffset = byteOffset;
    }
    get byteOffset() {
        return this.#byteOffset;
    }
    at(byteOffset = 0) {
        return this.#buffer.readUInt8(this.#byteOffset + byteOffset);
    }
    atConsumable(value) {
        if (this.at() !== value) {
            return false;
        }
        this.skip();
        return true;
    }
    readByte() {
        const value = this.#buffer.readUInt8(this.#byteOffset);
        this.#byteOffset++;
        return value;
    }
    readInt16() {
        const value = this.#buffer.readIntLE(this.#byteOffset, 2);
        this.#byteOffset += 2;
        return value;
    }
    readUnsignedInt16() {
        const value = this.#buffer.readUIntLE(this.#byteOffset, 2);
        this.#byteOffset += 2;
        return value;
    }
    readInt32() {
        const value = this.#buffer.readIntLE(this.#byteOffset, 4);
        this.#byteOffset += 4;
        return value;
    }
    readUnsignedInt32() {
        const value = this.#buffer.readUIntLE(this.#byteOffset, 4);
        this.#byteOffset += 4;
        return value;
    }
    readFloat() {
        const value = this.#buffer.readFloatLE(this.#byteOffset);
        this.#byteOffset += 4;
        return value;
    }
    readString(bytes) {
        const value = this.#buffer.toString("utf8", this.#byteOffset, this.#byteOffset + bytes);
        this.#byteOffset += bytes;
        return value;
    }
    readLengthPrefixedString(bytes = 4) {
        const offset = this.#byteOffset;
        const length = this.#buffer.readUIntLE(this.#byteOffset, bytes);
        this.#byteOffset += length + bytes;
        return this.#buffer.toString("utf8", offset + bytes, this.#byteOffset);
    }
    readMultibytePrefixedString() {
        let length = 0;
        let shift = 0;
        while (true) {
            const byte = this.#buffer.readUInt8(this.#byteOffset++);
            length |= (byte & 0x7f) << shift;
            shift += 7;
            if ((byte & 0x80) === 0) {
                break;
            }
        }
        if (length === 0) {
            return "";
        }
        const bufferString = this.#buffer.toString("utf8", this.#byteOffset, this.#byteOffset + length);
        this.#byteOffset += length;
        return bufferString;
    }
    readNullTerminatedString() {
        const offset = this.#byteOffset;
        const nullOffset = this.#buffer.indexOf("\n", this.#byteOffset);
        if (nullOffset === -1) {
            this.#byteOffset = this.#buffer.length;
            return this.#buffer.subarray(offset).toString("utf8");
        }
        this.#byteOffset = nullOffset + 1;
        return this.#buffer.subarray(offset, nullOffset).toString("utf8");
    }
    back(bytes = 1) {
        this.#byteOffset -= bytes;
        return this;
    }
    skip(bytes = 1) {
        this.#byteOffset += bytes;
        return this;
    }
    rest() {
        return this.#buffer.subarray(this.#byteOffset);
    }
    isConsumed() {
        return this.#byteOffset === this.#buffer.length;
    }
}
exports.BufferConsumer = BufferConsumer;
