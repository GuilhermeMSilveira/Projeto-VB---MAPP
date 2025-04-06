import React, { useEffect } from "react";

export default function PlanoTerapeutico({ paciente, avaliacao, onVoltar }) {
  // Debug: Mostrar os dados recebidos
  useEffect(() => {
    console.log("Paciente recebido:", paciente);
    console.log("Avaliação recebida:", avaliacao);
  }, [paciente, avaliacao]);

  // Dados mock de fallback (caso não venha nada)
  const pacienteFinal = paciente || {
    nome: "Nome não informado",
    codigo: "Código não disponível",
    dataNascimento: "Data não informada"
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-xl max-w-3xl mx-auto mt-6">
      <h1 className="text-2xl font-bold mb-4 text-blue-600">
        Plano Terapêutico
      </h1>

      <div className="mb-4 bg-gray-50 p-4 rounded">
        <p><strong>Nome do Paciente:</strong> {pacienteFinal.nomeCompleto}</p>
        <p><strong>Código do Paciente:</strong> {pacienteFinal.codigoPaciente}</p>
        <p><strong>Data de Nascimento:</strong> {pacienteFinal.dataNascimento}</p>
        <p><strong>Data da Avaliação:</strong> {avaliacao?.dataAvaliacao}</p>
<p><strong>Avaliador:</strong> {avaliacao?.avaliador}</p>
        
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Dados da Avaliação:</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-x-auto max-h-96 text-sm whitespace-pre-wrap">
          {avaliacao ? JSON.stringify(avaliacao, null, 2) : "Nenhuma avaliação disponível."}
        </pre>
      </div>

      <button
        onClick={onVoltar}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Voltar para Avaliação
      </button>
    </div>
  );
}
