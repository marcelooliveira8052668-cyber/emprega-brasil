const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

const hostname = "127.0.0.1";
const port = 3000;

const vagasDisponiveis = [
  {
    cargo: "Programador React",
    local: "Osasco",
    salario: "R$ 5.000",
    info: "Domínio de React e Node.js",
  },
  {
    cargo: "Programador Python",
    local: "São Paulo",
    salario: "R$ 5.500",
    info: "Foco em automação e back-end",
  },
  {
    cargo: "Programador Flutter",
    local: "Barueri",
    salario: "R$ 6.000",
    info: "Desenvolvimento mobile multiplataforma",
  },
  {
    cargo: "Desenvolvedor Full Stack",
    local: "Remoto",
    salario: "R$ 8.000",
    info: "Domínio de front e back-end",
  },
  {
    cargo: "Auxiliar Administrativo",
    local: "Osasco",
    salario: "R$ 2.200",
    info: "Rotinas de escritório e atendimento",
  },
  {
    cargo: "Gerente Administrativo",
    local: "São Paulo",
    salario: "R$ 10.000",
    info: "Gestão de equipes e processos",
  },
  {
    cargo: "Professor de História",
    local: "São Paulo",
    salario: "R$ 4.500",
    info: "Ensino médio e superior",
  },
  {
    cargo: "Professor de Matemática",
    local: "Osasco",
    salario: "R$ 4.800",
    info: "Experiência com vestibulares",
  },
  {
    cargo: "Professor de Física",
    local: "Barueri",
    salario: "R$ 5.000",
    info: "Laboratório e teoria",
  },
  {
    cargo: "Gerente de Projetos",
    local: "Remoto",
    salario: "R$ 12.000",
    info: "Metodologias ágeis",
  },
];

const server = http.createServer((req, res) => {
  // 1. ROTA DE CADASTRO (GET)
  if (req.url === "/cadastro") {
    fs.readFile("./cadastro.html", "utf8", (err, content) => {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(content);
    });
    return;
  }

 // 2. ROTA DE SALVAR (POST)
  if (req.url === '/salvar-curriculo' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      // Adicionamos um "enter" (\n) para separar os currículos
      const dadosParaSalvar = body + '\n-------------------\n';
      
      // Salva no ficheiro 'curriculos.txt'
      fs.appendFile('curriculos.txt', dadosParaSalvar, (err) => {
        if (err) {
          console.error('Erro ao salvar:', err);
          res.end('Erro ao salvar o currículo.');
          return;
        }
        console.log('Currículo guardado com sucesso!');
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>Currículo guardado com sucesso no ficheiro!</h1><a href="/">Voltar</a>');
      });
    });
    return;
  }
  // 3. LÓGICA DE VAGAS E ARQUIVOS ESTÁTICOS
  let filePath =
    req.url === "/"
      ? "./index.html"
      : req.url.startsWith("/vagas")
        ? "./vagas.html"
        : "." + req.url;
  let extname = path.extname(filePath);
  let contentType = extname === ".css" ? "text/css" : "text/html";

  fs.readFile(filePath, "utf8", (erro, conteudo) => {
    if (erro) {
      res.statusCode = 404;
      res.end("Página não encontrada!");
      return;
    }

    if (req.url.startsWith("/vagas")) {
      const parametros = url.parse(req.url, true).query;
      const termoBusca = (parametros.cargo || "").toLowerCase();
      const vagasFiltradas = vagasDisponiveis.filter((v) =>
        v.cargo.toLowerCase().includes(termoBusca),
      );

      let htmlLista = "";
      vagasFiltradas.forEach((v) => {
        htmlLista += `<div class="vaga-item"><h3>${v.cargo}</h3><p>Local: ${v.local}</p><p>Salário: ${v.salario}</p><p>Info: ${v.info}</p></div>`;
      });

      conteudo = conteudo.replace("{{cargo}}", termoBusca || "Todas");
      conteudo = conteudo.replace(
        "{{lista}}",
        htmlLista || "<p>Nenhuma vaga encontrada.</p>",
      );
    }

    res.writeHead(200, { "Content-Type": contentType + "; charset=utf-8" });
    res.end(conteudo);
  });
});

server.listen(port, hostname, () => {
  console.log(`Servidor rodando em http://${hostname}:${port}/`);
});
