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
      {etapa === "localizar" && (
        <PacienteConsulta
          onSelecionar={(paciente) => {
            setPacienteSelecionado(paciente);
            setEtapa("visualizar");
          }}
          onCadastrarNovo={() => setEtapa("cadastrar")}
        />
      )}

      {etapa === "cadastrar" && (
        <PacienteCadastro
          onSalvar={(paciente) => {
            setPacienteSelecionado(paciente);
            setEtapa("visualizar");
          }}
          onCancelar={() => setEtapa("localizar")}
        />
      )}

      {etapa === "visualizar" && pacienteSelecionado && (
        <TelaAtendimento
          paciente={pacienteSelecionado}
          onEditar={() => setEtapa("cadastrar")}
          onAvancar={() => setEtapa("avaliar")}
          onVoltar={() => setEtapa("localizar")}
        />
      )}

      {etapa === "avaliar" && pacienteSelecionado && (
        <AvaliacaoMando
          paciente={pacienteSelecionado}
          onVoltar={() => setEtapa("visualizar")}
          onGerarPlano={(avaliacao) => {
            setDadosAvaliacao(avaliacao);
            setEtapa("plano");
          }}
        />
      )}

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
