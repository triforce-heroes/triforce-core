"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BufferBuilder = void 0;
class BufferBuilder {
    buffers = [];
    build() {
        return Buffer.concat(this.buffers);
    }
    writeByte(value) {
        const buffer = Buffer.allocUnsafe(1);
        buffer.writeUInt8(value);
        this.buffers.push(buffer);
    }
    writeInt16(value) {
        const buffer = Buffer.allocUnsafe(2);
        buffer.writeInt16LE(value);
        this.buffers.push(buffer);
    }
    writeInt32(value) {
        const buffer = Buffer.allocUnsafe(4);
        buffer.writeInt32LE(value);
        this.buffers.push(buffer);
    }
    writeUnsignedInt16(value) {
        const buffer = Buffer.allocUnsafe(2);
        buffer.writeUInt16LE(value);
        this.buffers.push(buffer);
    }
    writeUnsignedInt32(value) {
        const buffer = Buffer.allocUnsafe(4);
        buffer.writeUInt32LE(value);
        this.buffers.push(buffer);
    }
    writeString(value) {
        if (value.length > 0) {
            this.buffers.push(Buffer.from(value));
        }
    }
    writeLengthPrefixedString(value, bytes = 4) {
        if (value.length === 0) {
            this.writeByte(0);
            return;
        }
        const buffer = Buffer.allocUnsafe(value.length + bytes);
        buffer.writeIntLE(value.length, 0, bytes);
        buffer.write(value, bytes);
        this.buffers.push(buffer);
    }
    writeMultibytePrefixedString(value) {
        if (value.length === 0) {
            this.writeByte(0);
            return;
        }
        const buffer = Buffer.from(value);
        let { length } = buffer;
        while (length > 0) {
            let chunkLength = length & 0x7f;
            if (length > 0x7f) {
                chunkLength |= 0x80;
            }
            this.writeByte(chunkLength);
            length >>= 7;
        }
        this.push(buffer);
    }
    writeFloat(value) {
        const buffer = Buffer.allocUnsafe(4);
        buffer.writeFloatLE(value);
        this.buffers.push(buffer);
    }
    push(...buffers) {
        this.buffers.push(...buffers);
    }
}
exports.BufferBuilder = BufferBuilder;
