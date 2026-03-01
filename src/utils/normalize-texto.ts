export const normalizarTexto = {
  normalizarEmailBusca(email: string) {
    return email.trim().toLowerCase();
  },
  normalizarNomeBusca(nome: string) {
    return nome
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  },
};
