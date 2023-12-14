import { ByteOrder } from "./types/ByteOrder.js";
export class BufferBuilder {
    pByteOrder;
    inBuffers = [];
    constructor(pByteOrder = ByteOrder.LITTLE_ENDIAN) {
        this.pByteOrder = pByteOrder;
    }
    build() {
        return Buffer.concat(this.inBuffers);
    }
    writeByte(value) {
        const buffer = Buffer.allocUnsafe(1);
        buffer.writeUInt8(value);
        this.inBuffers.push(buffer);
    }
    writeInt16(value) {
        const buffer = Buffer.allocUnsafe(2);
        if (this.pByteOrder === ByteOrder.LITTLE_ENDIAN) {
            buffer.writeInt16LE(value);
        }
        else {
            buffer.writeInt16BE(value);
        }
        this.inBuffers.push(buffer);
    }
    writeUnsignedInt16(value) {
        const buffer = Buffer.allocUnsafe(2);
        if (this.pByteOrder === ByteOrder.LITTLE_ENDIAN) {
            buffer.writeUInt16LE(value);
        }
        else {
            buffer.writeUInt16BE(value);
        }
        this.inBuffers.push(buffer);
    }
    writeInt32(value) {
        const buffer = Buffer.allocUnsafe(4);
        if (this.pByteOrder === ByteOrder.LITTLE_ENDIAN) {
            buffer.writeInt32LE(value);
        }
        else {
            buffer.writeInt32BE(value);
        }
        this.inBuffers.push(buffer);
    }
    writeUnsignedInt32(value) {
        const buffer = Buffer.allocUnsafe(4);
        if (this.pByteOrder === ByteOrder.LITTLE_ENDIAN) {
            buffer.writeUInt32LE(value);
        }
        else {
            buffer.writeUInt32BE(value);
        }
        this.inBuffers.push(buffer);
    }
    writeString(value) {
        if (value.length > 0) {
            this.inBuffers.push(Buffer.from(value));
        }
    }
    writeLengthPrefixedString(value, bytes = 4) {
        const buffer = Buffer.allocUnsafe(value.length + bytes);
        if (this.pByteOrder === ByteOrder.LITTLE_ENDIAN) {
            buffer.writeIntLE(value.length, 0, bytes);
        }
        else {
            buffer.writeIntBE(value.length, 0, bytes);
        }
        buffer.write(value, bytes);
        this.inBuffers.push(buffer);
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
        if (this.pByteOrder === ByteOrder.LITTLE_ENDIAN) {
            buffer.writeFloatLE(value);
        }
        else {
            buffer.writeFloatBE(value);
        }
        this.inBuffers.push(buffer);
    }
    push(...buffers) {
        this.inBuffers.push(...buffers);
    }
}
