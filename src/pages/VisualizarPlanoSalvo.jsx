// src/components/VisualizarPlanoSalvo.jsx

import React from "react";

const formatarData = (data) => {
  if (!data) return "N/A";
  const d = new Date(data);
  return d.toLocaleDateString("pt-BR");
};

const formatarPlano = (texto) => {
  if (!texto) return "N/A";
  return texto
    .replace(/Objetivos Terapêuticos:/g, "<h3><strong>Objetivos Terapêuticos:</strong></h3>")
    .replace(/Estratégias de Ensino:/g, "<h3><strong>Estratégias de Ensino:</strong></h3>")
    .replace(/Sugestões Práticas:/g, "<h3><strong>Sugestões Práticas:</strong></h3>")
    .replace(/Acompanhamento e Avaliação:/g, "<h3><strong>Acompanhamento e Avaliação:</strong></h3>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/(\d+\..+)/g, "<p>$1</p>");
};

export default function VisualizarPlanoSalvo({ plano, onVoltar }) {
  if (!plano) return <p className="text-red-600">Nenhum plano selecionado.</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">📄 Plano Terapêutico Salvo</h2>

      <button
        onClick={onVoltar}
        className="btn-voltar"
      >
        ← Voltar ao Histórico
      </button>

      <div className="bg-white shadow-md rounded p-6 border border-gray-200">
        <p><strong>Nr. Atendimento:</strong> {plano.numeroAtendimento}</p>
        <p><strong>Paciente:</strong> {plano.paciente}</p>
        <p><strong>Código do Paciente:</strong> {plano.codigoPaciente}</p>
        <p><strong>Data de Nascimento:</strong> {formatarData(plano.dataNascimento)}</p>
        <p><strong>Data da Avaliação:</strong> {formatarData(plano.dataAvaliacao)}</p>
        <p><strong>Data de Criação do Plano:</strong> {formatarData(plano.dataCriacao)}</p>
        <p><strong>Avaliador:</strong> {plano.avaliador}</p>
        <p><strong>Pontuação Total:</strong> {plano.pontuacao}</p>
        <p><strong>Observações:</strong> {plano.observacoes}</p>

        <hr className="my-4" />

        <h3 className="text-xl font-semibold mb-2">📋 Recomendação Terapêutica:</h3>
        <div
          className="whitespace-pre-wrap space-y-2"
          dangerouslySetInnerHTML={{ __html: formatarPlano(plano.plano) }}
        />
      </div>
    </div>
  );
}
