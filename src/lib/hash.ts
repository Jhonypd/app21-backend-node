import bcrypt from "bcrypt";
import CryptoJS from "crypto-js";

export const hash = {
  async senha(value: string) {
    const valueHash = await bcrypt.hash(value, 10);
    return valueHash;
  },

  async geradorCamposComuns(value: string): Promise<string> {
    const ValueNormalizado = value.toLowerCase().trim();

    return CryptoJS.SHA256(ValueNormalizado).toString(CryptoJS.enc.Hex);
  },

  async compare(value: string, hash: string) {
    return await bcrypt.compare(value, hash);
  },
};
