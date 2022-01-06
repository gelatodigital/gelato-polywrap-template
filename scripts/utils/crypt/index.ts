import { ethers } from "ethers";
import * as ethCrypto from "eth-crypto";

export const hexToBuffer = (hexString: string): Uint8Array => {
  const noPrefix = hexString.slice(2);
  const buffer = Uint8Array.from(Buffer.from(noPrefix, "hex"));
  return buffer;
};

export const getMockDecryptKey = (): string => {
  return "0xda9932a09bd0e312e098fc59d8906609bd4a80edd4c0d0bdd19d016c9fbedc34";
};

export const encryptWithMockPublicKey = async (message: string) => {
  const mockDecryptKey = getMockDecryptKey();
  const uncompressedPublicKey = ethers.utils.computePublicKey(
    mockDecryptKey,
    false
  );

  const encrypted = await ethCrypto.encryptWithPublicKey(
    uncompressedPublicKey.replace("0x", ""),
    message
  );
  const encryptedString = ethCrypto.cipher.stringify(encrypted);

  return encryptedString;
};
