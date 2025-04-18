import React, { useState } from "react";
import PacienteConsulta from "./pages/PacienteConsulta";
import TelaAtendimento from "./pages/TelaAtendimento";
import PacienteCadastro from "./pages/PacienteCadastro";
import AvaliacaoMando from "./pages/AvaliacaoMando";
import PlanoTerapeutico from "./pages/PlanoTerapeutico";

export default function App() {
  const [etapa, setEtapa] = useState("localizar");
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null);
  const [dadosAvaliacao, setDadosAvaliacao] = useState(null);

  return (
    <div className="p-4">
      {/* Etapa de Localizar Paciente */}
      {etapa === "localizar" && (
        <PacienteConsulta
          onSelecionar={(paciente) => {
            setPacienteSelecionado(paciente);
            setEtapa("visualizar");
          }}
          onCadastrarNovo={() => setEtapa("cadastrar")}
        />
      )}

      {/* Etapa de Cadastro de Paciente */}
      {etapa === "cadastrar" && (
        <PacienteCadastro
          onSalvar={(paciente) => {
            setPacienteSelecionado(paciente);
            setEtapa("visualizar");
          }}
          onCancelar={() => setEtapa("localizar")}
        />
      )}

      {/* Etapa de Visualizar Paciente */}
      {etapa === "visualizar" && pacienteSelecionado && (
        <TelaAtendimento
          paciente={pacienteSelecionado}
          onEditar={() => setEtapa("cadastrar")}
          onAvancar={() => setEtapa("avaliar")}
          onVoltar={() => setEtapa("localizar")}
        />
      )}

      {/* Etapa de Avaliação */}
      {etapa === "avaliar" && pacienteSelecionado && (
        <AvaliacaoMando
          paciente={pacienteSelecionado}
          numeroAtendimento={pacienteSelecionado.numeroAtendimento} // Passando o numeroAtendimento
          onVoltar={() => setEtapa("visualizar")}
          onGerarPlano={(avaliacao) => {
            setDadosAvaliacao(avaliacao); // Salva os dados da avaliação
            setEtapa("plano"); // Muda para a etapa do plano terapêutico
          }}
        />
      )}

      {/* Etapa de Plano Terapêutico */}
      {etapa === "plano" && pacienteSelecionado && dadosAvaliacao && (
        <PlanoTerapeutico
          paciente={pacienteSelecionado}
          avaliacao={dadosAvaliacao}
          onVoltar={() => setEtapa("avaliar")}
        />
      )}
    </div>
  );
}
