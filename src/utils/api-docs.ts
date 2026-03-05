type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type Fields = Record<string, string>;

type EndpointDoc = {
  descricao: string;
  metodo: Method;
  rota: string;

  params?: Fields;
  query?: Fields;
  body?: Fields;
  headers?: Fields;
};

export function gerarComentarioApi(config: EndpointDoc) {
  const lines: string[] = [];

  lines.push("/**");
  lines.push(` * ${config.descricao}`);
  lines.push(` * ${config.metodo} ${config.rota}`);

  const section = (titulo: string, obj?: Fields) => {
    if (!obj || Object.keys(obj).length === 0) return;

    lines.push(` * ${titulo}:`);
    for (const [k, v] of Object.entries(obj)) {
      lines.push(` *   ${k}: ${v}`);
    }
  };

  section("Params", config.params);
  section("Query", config.query);
  section("Headers", config.headers);
  section("Body", config.body);

  lines.push(" */");

  return lines.join("\n");
}
