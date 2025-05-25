import React, { useState, useEffect, useRef } from "react";
import html2pdf from "html2pdf.js";
import { db, collection, addDoc } from "../services/ConfiguracaoFirebase"; // ajuste o caminho conforme necessário

// 🧠 Utilitário para calcular idade
const calcularIdade = (dataNascimento) => {
  const hoje = new Date();
  const nascimento = new Date(dataNascimento);
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const m = hoje.getMonth() - nascimento.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) idade--;
  return idade;
};

// 📆 Formata data no formato dd/mm/aaaa
const formatarData = (data) => {
  const dataObj = new Date(data);
  const dia = String(dataObj.getDate()).padStart(2, '0');
  const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
  const ano = dataObj.getFullYear();
  return `${dia}/${mes}/${ano}`;
};

// 🧠 Gera recomendações terapêuticas com IA (OpenAI)
const gerarRecomendacoesIA = async (avaliacao) => {
  if (!avaliacao) return "Erro: Dados insuficientes para gerar plano.";

  const respostasTexto = avaliacao.respostas
    .map((resposta, index) => `${index + 1}. ${resposta.descricao} - ${resposta.valor} ponto(s)`)
    .join("\n");

  const totalPontos = parseFloat(avaliacao.totalPontos);
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!apiKey) return "Erro: API Key não configurada.";

  const prompt = `
Com base nas respostas abaixo, gere um plano terapêutico individualizado com sugestões práticas de ensino:

${respostasTexto}

Pontuação total: ${totalPontos}
Observações adicionais: ${avaliacao.observacoes}

Escreva um plano com base nas áreas que precisam de reforço, alinhado aos princípios da Análise do Comportamento Aplicada (ABA).

Organize o conteúdo com os seguintes tópicos, todos com **títulos em negrito**:
- **Objetivo principal**
- **Áreas de foco**
- **Estratégias sugeridas**
- **Atividades práticas**
- **Materiais recomendados**
- **Orientações finais**

Inclua exemplos práticos e específicos para cada habilidade-alvo, como brinquedos, contextos naturais (refeições, higiene, brincadeira), interações com cuidadores, etc. 
Evite exemplos genéricos ou lúdicos demais e use exemplos realistas e funcionais. 
Destaque palavras e trechos importantes em **negrito** para facilitar a leitura.

O plano deve ser claro, funcional, aplicável na rotina e adaptado ao contexto da criança com base nas respostas da avaliação.
`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Você é um analista comportamental especialista em VB-MAPP." },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    const data = await response.json();
    if (!response.ok) return "Erro ao gerar recomendações.";
    return data?.choices?.[0]?.message?.content?.trim() || "Sem recomendações geradas.";
  } catch (error) {
    console.error("Erro na chamada à API:", error);
    return "Erro ao gerar recomendações.";
  }
};

// 🧾 Componente principal
const TelaPlanoTerapeutico = ({ avaliacao, paciente, onVoltar, numeroAtendimento, onConsultarHistorico }) => {
  const [plano, setPlano] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [salvo, setSalvo] = useState(false);
  const pdfRef = useRef();

  // Gera plano assim que os dados da avaliação estiverem disponíveis
  useEffect(() => {
    if (avaliacao) {
      setCarregando(true);
      gerarRecomendacoesIA(avaliacao).then((texto) => {
        setPlano(texto.trim());
        setCarregando(false);
      });
    }
  }, [avaliacao]);

  // Exporta para PDF usando html2pdf.js
  const exportarPDF = () => {
    if (!plano) {
      alert("Plano terapêutico ainda não gerado.");
      return;
    }

    setTimeout(() => {
      const opt = {
        margin: 0.5,
        filename: `Plano_Terapeutico_${paciente.nomeCompleto}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      };
      html2pdf().set(opt).from(pdfRef.current).save();
    }, 500);
  };

  // Salva plano no Firestore
  const salvarPlanoNoFirestore = async () => {
    if (salvo) {
      alert("⚠️ Este plano já foi salvo.");
      return;
    }

    try {
      const dataAtual = new Date().toISOString();
      const planoCompleto = {
        paciente: paciente.nomeCompleto,
        codigoPaciente: paciente.codigoPaciente,
        dataNascimento: paciente.dataNascimento,
        dataCriacao: dataAtual,
        avaliador: avaliacao.avaliador,
        dataAvaliacao: avaliacao.dataAvaliacao,
        pontuacao: avaliacao.totalPontos,
        observacoes: avaliacao.observacoes || "Nenhuma",
        plano: plano,
        numeroAtendimento: numeroAtendimento,
      };

      await addDoc(collection(db, "planos_terapeuticos"), planoCompleto);
      alert("✅ Plano terapêutico salvo com sucesso!");
      setSalvo(true);
    } catch (error) {
      console.error("Erro ao salvar plano no Firestore:", error);
      alert("❌ Erro ao salvar plano no Firestore.");
    }
  };

  if (!avaliacao || !paciente) {
    return <p className="text-red-600">Dados da avaliação ou do paciente não disponíveis.</p>;
  }

  const idadePaciente = calcularIdade(paciente.dataNascimento);

  // Formata o plano para HTML, aplicando estilos
  const formatarPlano = (texto) => {
    return texto
.replace(/Objetivo principal:/g, "<h3><strong>Objetivo principal:</strong></h3>")
.replace(/Áreas de foco:/g, "<h3><strong>Áreas de foco:</strong></h3>")
.replace(/Estratégias sugeridas:/g, "<h3><strong>Estratégias sugeridas:</strong></h3>")
.replace(/Atividades práticas:/g, "<h3><strong>Atividades práticas:</strong></h3>")
.replace(/Materiais recomendados:/g, "<h3><strong>Materiais recomendados:</strong></h3>")
.replace(/Orientações finais:/g, "<h3><strong>Orientações finais:</strong></h3>")
.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
.replace(/(\d+\..+)/g, "<p>$1</p>");

  };
  

  return (
    <div className="plano-terapeutico-container">
      <div ref={pdfRef} className="p-6">
        <h1 className="plano-terapeutico-titulo">Plano Terapêutico</h1>

        <div className="plano-terapeutico-dados">
          <p><strong>Nr. atendimento:</strong> {numeroAtendimento}</p>
          <p><strong>Nome do Paciente:</strong> {paciente.nomeCompleto}</p>
          <p><strong>Código do Paciente:</strong> {paciente.codigoPaciente}</p>
          <p><strong>Data de Nascimento:</strong> {formatarData(paciente.dataNascimento)}</p>
          <p><strong>Idade:</strong> {idadePaciente} anos</p>
          <p><strong>Data da Avaliação:</strong> {formatarData(avaliacao.dataAvaliacao)}</p>
          <p><strong>Avaliador:</strong> {avaliacao.avaliador}</p>
          <p><strong>Pontuação Total:</strong> {avaliacao.totalPontos}</p>
          <p><strong>Observações:</strong> {avaliacao.observacoes || "Nenhuma observação registrada."}</p>
        </div>

        <hr className="divider" />

        <div className="mb-4">
          <h2 className="plano-terapeutico-recomendacoes">📋 Recomendações Terapêuticas:</h2>
          <div className="space-y-1 whitespace-pre-wrap">
            {carregando ? (
              <p className="text-gray-500">Gerando plano terapêutico com base nas respostas do paciente...</p>
            ) : (
              <div dangerouslySetInnerHTML={{ __html: formatarPlano(plano) }} />
            )}
          </div>
        </div>
      </div>

      <div className="plano-terapeutico-botoes">
        <button onClick={onVoltar} className="btn-voltar">🔙 Voltar para Avaliação</button>
        <button onClick={exportarPDF} className="btn-exportar">📄 Exportar como PDF</button>
        <button onClick={salvarPlanoNoFirestore} className="btn-salvar" disabled={!plano || salvo}>
          💾 {salvo ? "Salvar" : "Salvar"}
        </button>
        <button onClick={onConsultarHistorico} className="btn-historico">📚 Consultar Histórico</button>
      </div>
    </div>
  );
};

export default TelaPlanoTerapeutico;
