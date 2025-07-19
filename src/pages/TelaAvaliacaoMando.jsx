import React, { useState, useEffect } from 'react';
import { db } from '../services/ConfiguracaoFirebase'; // Importe a configuração do Firebase
import { collection, addDoc, updateDoc, doc, query, where, getDocs } from 'firebase/firestore';

// 🟡 Avaliação Mando (completa)
const perguntasMandoNivel1 = [
  {
    id: 1,
    texto: "Emite 2 palavras, sinais ou utiliza figuras, mas pode precisar de dica ecóica, imitativa ou de outro tipo, desde que não seja dica física (e.g., biscoito, livro). (O/T)",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: 2 mandos frente ao item desejado com dica ecóica (crianças verbais), dica imitativa ou verbal (língua de sinais), gestual ou PECS. Sem dica física." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: 1 mando com os mesmos critérios acima. Sem dica física." },
      { valor: 0, descricao: "🔴 0 ponto: Se for necessário dar dica física para que a criança responda." }
    ]
  },
  {
    id: 2,
    texto: "Emite 4 mandos diferentes sem dicas (exceto a pergunta: “O que você quer?”, que pode ser utilizada). Os itens desejáveis podem estar presentes (ex: bola, música, bolacha). Testar.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto = 4 mandos para 4 reforçadores diferentes sem nenhuma dica" },
      { valor: 0.5, descricao: "🟠 0,5 ponto = 3 mandos para 3 reforçadores diferentes sem nenhuma dica" },
      { valor: 0, descricao: "🔴 0 ponto = se emitir menos de 3 mandos ou se houver necessidade de dica." }
    ]
  },
  {
    id: 3,
    texto: "Generaliza 6 mandos (referentes a reforçadores da criança) entre duas pessoas, dois ambientes e dois exemplos diferentes de um mesmo reforçador (ex: pedir bolhas de sabão para a mãe e para o pai, dentro e fora de casa e, também, bolas de sabão de frascos diferentes - azul e o vermelho). Testar ou Observar.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto = 6 mandos entre duas pessoas, dois ambientes e dois exemplos diferentes de um mesmo reforçador." },
      { valor: 0.5, descricao: "🟠 0,5 ponto = de 3 a 5 mandos entre duas pessoas, dois ambientes e dois exemplos diferentes de um mesmo reforçador." },
      { valor: 0, descricao: "🔴 0 ponto = se emitir menos de 3 mandos com as variações exigidas ou se não generalizar os reforçadores." }
    ]
  },
  {
    id: 4,
    texto: "Espontaneamente (sem dica verbal) emite 5 mandos. Os itens desejados podem estar presentes. O controle deve ser da operação estabelecedora e não da dica do adulto. Observação por tempo – 60 minutos.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: se emite pelo menos 2 mandos diferentes 5 vezes em 60 minutos espontaneamente (sem a pergunta “O que você quer?”, ou dica semelhante)." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: se emite só 1 mando 5 vezes em 60 minutos espontaneamente (sem a pergunta “O que você quer?”, ou dica semelhante)." },
      { valor: 0, descricao: "🔴 0 ponto: se não emite mandos espontaneamente ou se houver necessidade de dica verbal para controle do mando." }
    ]
  },
  {
    id: 5,
    texto: "Emite outros 10 mandos diferentes sem dica (exceto a pergunta: O que você quer?, que pode ser utilizada). Os itens desejados podem estar presentes. Testar ou Observar.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: se emitir 10 mandos diferentes sem nenhuma dica." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: se emitir de 8 a 9 mandos diferentes sem nenhuma dica." },
      { valor: 0, descricao: "🔴 0 ponto: se emitir menos de 8 mandos diferentes ou precisar de dicas para controle." }
    ],
  }
];

// 🟢 Avaliação Tato (exemplo com estrutura igual)
const perguntasTatoNivel1 = [
  {
    id: 1,
    texto: "Nomeia corretamente 3 objetos apresentados visualmente.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: nomeia corretamente os 3 objetos." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: nomeia 2 objetos corretamente." },
      { valor: 0, descricao: "🔴 0 ponto: nomeia 1 ou nenhum objeto." }
    ]
  },
  {
    id: 2,
    texto: "Nomeia figuras em diferentes contextos ou posições.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: nomeia corretamente em 2 contextos." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: nomeia corretamente em 1 contexto." },
      { valor: 0, descricao: "🔴 0 ponto: não nomeia ou precisa de ajuda." }
    ]
  },
  {
    id: 3,
    texto: "Nomeia objetos durante atividades naturais (ex: brincar ou comer).",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: nomeia 3 objetos sem dica." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: nomeia 1 ou 2 objetos." },
      { valor: 0, descricao: "🔴 0 ponto: não nomeia espontaneamente." }
    ]
  }
];

// 🧠 Mapeamento dinâmico
const perguntasPorDominio = {
  Mando: perguntasMandoNivel1,
  Tato: perguntasTatoNivel1
};

const TelaAvaliacao = ({ paciente, numeroAtendimento, onGerarPlano, onVoltar }) => {
  const [dominioSelecionado, setDominioSelecionado] = useState("Mando");
  const [perguntas, setPerguntas] = useState(perguntasPorDominio["Mando"]);
  const [respostas, setRespostas] = useState([]);
  const [dataAvaliacao, setDataAvaliacao] = useState("");
  const [mensagemSucesso, setMensagemSucesso] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [avaliador, setAvaliador] = useState("");
  const [idAvaliacao, setIdAvaliacao] = useState("");

  useEffect(() => {
    const dataAtual = new Date().toISOString().split('T')[0];
    setDataAvaliacao(dataAtual);
  }, []);

  useEffect(() => {
    const novasPerguntas = perguntasPorDominio[dominioSelecionado] || [];
    setPerguntas(novasPerguntas);
    setRespostas(novasPerguntas.map(() => ({ valor: "", descricao: "" })));
  }, [dominioSelecionado]);

  const handleResposta = (index, valor) => {
    const respostaSelecionada = perguntas[index].respostas.find(res => res.valor === parseFloat(valor));
    const descricao = respostaSelecionada ? respostaSelecionada.descricao : "";
    const novasRespostas = [...respostas];
    novasRespostas[index] = { valor: parseFloat(valor) || 0, descricao };
    setRespostas(novasRespostas);
  };

  const calcularTotal = () => {
    return respostas.reduce((total, r) => total + (r.valor || 0), 0).toFixed(1);
  };

  const dominioNomeCompleto = 
  dominioSelecionado === "Mando" ? "Mando - Nível 1" :
  dominioSelecionado === "Tato" ? "Tato - Nível 1" :
  dominioSelecionado;

  const salvarAvaliacao = async (e) => {
    e.preventDefault();
    try {
      const q = query(collection(db, "avaliacoes"), where("codigoPaciente", "==", paciente.codigoPaciente));
      const querySnapshot = await getDocs(q);
      const numeroAvaliacao = querySnapshot.size + 1;

      const docRef = await addDoc(collection(db, "avaliacoes"), {
        codigoPaciente: paciente.codigoPaciente,
        nomePaciente: paciente.nomeCompleto,
        dataAvaliacao,
        avaliador,
  dominio: dominioNomeCompleto, // ✅ nome visível completo
        respostas,
        totalPontos: calcularTotal(),
        observacoes,
        numeroAtendimento,
        numeroAvaliacao
      });

      await updateDoc(doc(db, "avaliacoes", docRef.id), {
        idAvaliacao: docRef.id
      });

      setIdAvaliacao(docRef.id);
      setMensagemSucesso(`Avaliação ${numeroAvaliacao} registrada com sucesso!`);
    } catch (error) {
      console.error("Erro ao salvar a avaliação:", error);
      setMensagemSucesso("Houve um erro ao salvar a avaliação. Tente novamente.");
    }
  };

  const gerarPlanoTerapeutico = () => {
    if (typeof onGerarPlano === "function") {
      const dadosAvaliacao = respostas.map((resposta, index) => ({
        pergunta: perguntas[index].texto,
        valor: resposta.valor,
        descricao: resposta.descricao
      }));

      const dadosFormatados = {
        paciente: paciente.nomeCompleto,
        respostas: dadosAvaliacao,
        totalPontos: calcularTotal(),
        observacoes,
        avaliador,
        dataAvaliacao,
        idAvaliacao,
        dominio: dominioSelecionado
      };

      onGerarPlano(dadosFormatados);
    }
  };
  
return (
  <div className="container-avaliacao">
    <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-4">
      Avaliações
    </h2>

    

    <form onSubmit={salvarAvaliacao} className="space-y-8">
      {/* Dados do Paciente */}
      <div className="card-dados-paciente">
        <div>
          <label className="input-group-avaliacao">Número de Atendimento</label>
          <input
            name="numeroAtendimento"
            value={numeroAtendimento}
            readOnly
            className="input-avaliacao bg-gray-100"
          />
        </div>
        <div>
          <label className="card-dados-paciente">Código do Paciente</label>
          <input
            type="text"
            value={paciente.codigoPaciente}
            readOnly
            className="w-full border p-2 rounded-lg"
          />
        </div>
        <div>
          <label className="card-dados-paciente">Nome do Paciente</label>
          <input
            type="text"
            value={paciente.nomeCompleto}
            readOnly
            className="w-full border p-2 rounded-lg"
          />
        </div>
        <div>
          <label className="card-dados-paciente">Data da Avaliação</label>
          <input
            type="date"
            value={dataAvaliacao}
            readOnly
            className="w-full border p-2 rounded-lg"
          />
        </div>
        <div>
          <label className="card-dados-paciente">Avaliador</label>
          <input
            type="text"
            name="avaliador"
            value={avaliador}
            onChange={(e) => setAvaliador(e.target.value)}
            required
            className="w-full border p-2 rounded-lg"
          />
        </div>
        {/* Seletor de Domínio */}
    <div className="mb-6">
      <label className="font-semibold text-gray-700">Selecionar Domínio:</label>
      <select
        className="w-full border p-2 rounded-lg mt-2"
        value={dominioSelecionado}
        onChange={(e) => setDominioSelecionado(e.target.value)}
      >
        <option value="Mando">Mando - Nível 1</option>
        <option value="Tato">Tato - Nível 1</option>
      </select>
    </div>
        <hr className="divider" />
      </div>
<div className="mt-4">
  <h3 className="text-xl font-bold text-gray-700">
    {dominioSelecionado === "Mando" && "Mando - Nível 1"}
    {dominioSelecionado === "Tato" && "Tato - Nível 1"}
  </h3>
</div>
      {/* Perguntas dinâmicas de acordo com o domínio */}
      <div className="space-y-4">
        {perguntas.map((pergunta, index) => (
          <div key={pergunta.id} className="flex flex-col gap-2">
            <label className="block text-lg font-medium text-gray-800">
              {index + 1}. {pergunta.texto}
            </label>
            <select
              value={respostas[index]?.valor || ""}
              onChange={(e) => handleResposta(index, e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg"
              required
            >
              <option value="">Selecione uma resposta</option>
              {pergunta.respostas.map((resposta) => (
                <option key={resposta.valor} value={resposta.valor}>
                  {resposta.descricao}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {/* Observações */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">Observações</label>
        <textarea
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
          className="w-full border p-2 rounded-lg"
          rows={3}
        ></textarea>
      </div>

      {/* Botões */}
      <div className="flex gap-6">
        <button type="submit" className="botao-salvar-avaliacao">
          💾 Salvar Avaliação
        </button>
        <button
          type="button"
          onClick={gerarPlanoTerapeutico}
          className="botao-gerar-plano-avaliacao"
        >
          📋 Gerar Plano Terapêutico
        </button>
      </div>

      {/* Botão de Voltar */}
      <div className="space-y-4">
        <button
          type="button"
          onClick={onVoltar}
          className="botao-voltar-avaliacao"
        >
          🔙 Voltar
        </button>
      </div>

      {/* Mensagem de Sucesso */}
      {mensagemSucesso && (
        <div className="mensagem-sucesso">{mensagemSucesso}</div>
      )}
    </form>
  </div>
);
}

export default TelaAvaliacao;