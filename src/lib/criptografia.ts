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

    // Converter para Base64 URL-safe (substitui +/ por -_ e remove =)
    const encryptedBase64 = encrypted
      .toString()
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");

    return iv.toString(CryptoJS.enc.Hex) + ":" + encryptedBase64;
  },

  descriptografar(value: string) {
    try {
      const parts = value.split(":");
      if (parts.length !== 2) {
        console.error("Formato inválido. Valor recebido:", value);
        throw new Error("Formato de dados criptografados inválido");
      }

      const iv = CryptoJS.enc.Hex.parse(parts[0]);

      // Converter de volta de Base64 URL-safe para Base64 padrão
      let encrypted = parts[1].replace(/-/g, "+").replace(/_/g, "/");

      // Adicionar padding se necessário
      while (encrypted.length % 4) {
        encrypted += "=";
      }

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
      console.error("Valor que causou o erro:", value);
      throw new Error("Não foi possível descriptografar os dados");
    }
  },
};
