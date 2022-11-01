import { blake3 } from 'hash-wasm';
import {IDataType} from "hash-wasm/lib/util";

export class Hasher {
    public static async hash(data: IDataType): Promise<string> {
        return await blake3(data, 128)
    }
}
