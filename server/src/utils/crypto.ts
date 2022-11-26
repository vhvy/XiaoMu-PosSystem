import { createHash } from "node:crypto";

type Alogrithm = "md5" | "sha1" | "sha256" | "sha512";

export const encrypt = (algorithm: Alogrithm, content: string) => {
    const hash = createHash(algorithm);
    hash.update(content);

    return hash.digest("hex");
}