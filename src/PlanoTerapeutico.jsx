import React, { useEffect, useRef, useState } from "react";
import html2pdf from "html2pdf.js";

export default function PlanoTerapeutico({ paciente, avaliacao, onVoltar }) {
  const [idade, setIdade] = useState(null);
  const pdfRef = useRef();

  useEffect(() => {
    if (paciente?.dataNascimento) {
      const calcularIdade = (dataNascimento) => {
        const hoje = new Date();
        const nascimento = new Date(dataNascimento);
        let anos = hoje.getFullYear() - nascimento.getFullYear();
        const mes = hoje.getMonth() - nascimento.getMonth();

        if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
          anos--;
        }

        return anos;
      };

      setIdade(calcularIdade(paciente.dataNascimento));
    }
  }, [paciente]);

  const pacienteFinal = paciente || {
    nomeCompleto: "Nome não informado",
    codigoPaciente: "Código não disponível",
    dataNascimento: "Data não informada",
  };

  const gerarRecomendacoes = () => {
    return avaliacao?.respostas?.map((resposta, index) => {
      const valor = parseFloat(resposta.valor);
      let texto = "";
      let icone = "";

      if (valor === 1) {
        icone = "✅";
        texto = `Item ${index + 1}: Domínio consolidado. Continue reforçando com estímulos naturais.`;
      } else if (valor === 0.5) {
        icone = "⚠️";
        texto = `Item ${index + 1}: Domínio emergente. Reforçar com atividades específicas e suporte.`;
      } else {
        icone = "❌";
        texto = `Item ${index + 1}: Domínio ausente. Requer intervenção direta com suporte intensivo.`;
      }

      return (
        <p key={index} className="mb-1">
          {icone} {texto}
        </p>
      );
    });
  };

  const exportarParaPDF = () => {
    const opt = {
      margin: 0.5,
      filename: `Plano_Terapeutico_${pacienteFinal.nomeCompleto}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    html2pdf().set(opt).from(pdfRef.current).save();
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-xl max-w-3xl mx-auto mt-6">
      <div ref={pdfRef} className="p-6">
        <h1 className="text-3xl font-bold mb-6 text-blue-800">Plano Terapêutico</h1>

        <div className="space-y-1 mb-6">
          <p><strong>Nome do Paciente:</strong> {pacienteFinal.nomeCompleto}</p>
          <p><strong>Código do Paciente:</strong> {pacienteFinal.codigoPaciente}</p>
          <p><strong>Data de Nascimento:</strong> {pacienteFinal.dataNascimento}</p>
          {idade !== null && (
            <p><strong>Idade:</strong> {idade} {idade === 1 ? "ano" : "anos"}</p>
          )}
          <p><strong>Data da Avaliação:</strong> {avaliacao?.dataAvaliacao}</p>
          <p><strong>Avaliador:</strong> {avaliacao?.avaliador}</p>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-semibold text-orange-600 mb-2">📋 Recomendações Terapêuticas:</h2>
          <div className="space-y-1">
            {gerarRecomendacoes()}
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={onVoltar}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
        >
          Voltar para Avaliação
        </button>

        <button
          onClick={exportarParaPDF}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          📄 Exportar como PDF
        </button>
      </div>
    </div>
  );
}
