import React from "react";

export default function TelaHistoricoPlanos({ historico, onSelecionarPlano, onVoltar }) {
  return (
    <div className="historico-container">
      <h2 className="text-2xl font-bold mb-4">Histórico de Planos Terapêuticos</h2>
      <button onClick={onVoltar} className="btn-voltar">
        ← Voltar
      </button>

      {historico && historico.length > 0 ? (
        <table className="historico-table">
          <thead>
            <tr>
              <th>Nr. Atendimento</th>
              <th>Paciente</th>
              <th>Data</th>
              <th>Avaliador</th>
            </tr>
          </thead>
          <tbody>
            {historico.map((plano, index) => (
              <tr
                key={plano.id || index}
                onClick={() => onSelecionarPlano(plano)}
                className="plano-row"
              >
                <td>{plano.numeroAtendimento || "N/A"}</td>
                <td>{plano.paciente || "N/A"}</td>
                <td>{plano.dataCriacao ? new Date(plano.dataCriacao).toLocaleDateString("pt-BR") : "N/A"}</td>
                <td>{plano.avaliador || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-600">Nenhum plano encontrado para este paciente.</p>
      )}
    </div>
  );
}
