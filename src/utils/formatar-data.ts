import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
export const formatarParaDataLocal = (data: Date): string => {
  return format(data, "dd/MM/yyyy HH:mm:ss", { locale: ptBR });
};
