import CryptoJS from "crypto-js";

export const criptografia = {
  criptografar(value: string) {
    const iv = CryptoJS.lib.WordArray.random(128 / 8);
    const encrypted = CryptoJS.AES.encrypt(
      value,
      process.env.JWT_SECRET as string,
      {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );

    return iv.toString(CryptoJS.enc.Hex) + ":" + encrypted.toString();
  },

  descriptografar(value: string) {
    try {
      const parts = value.split(":");
      if (parts.length !== 2) {
        throw new Error("Formato de dados criptografados inválido");
      }

      const iv = CryptoJS.enc.Hex.parse(parts[0]);
      const encrypted = parts[1];

      const bytes = CryptoJS.AES.decrypt(
        encrypted,
        process.env.JWT_SECRET as string,
        {
          iv: iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
        }
      );

      const decrypted = bytes.toString(CryptoJS.enc.Utf8);

      if (!decrypted) {
        throw new Error(
          "Falha na descriptografia - chave inválida ou dados corrompidos"
        );
      }

      return decrypted;
    } catch (error) {
      console.error("Erro na descriptografia:", error);
      throw new Error("Não foi possível descriptografar os dados");
    }
  },
};
