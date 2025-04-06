import React, { useState } from "react";
import PacienteConsulta from "./components/PacienteConsulta";
import TelaAtendimento from "./pages/TelaAtendimento";
import PacienteCadastro from "./pages/PacienteCadastro";
import AvaliacaoMando from "./pages/AvaliacaoMando";

export default function App() {
  const [etapa, setEtapa] = useState("localizar");
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null);

  return (
    <div className="p-4">
      {etapa === "localizar" && (
        <PacienteConsulta
          onSelecionar={(paciente) => {
            setPacienteSelecionado(paciente);
            setEtapa("visualizar");
          }}
          onCadastrarNovo={() => setEtapa("cadastrar")} // botão "Cadastrar novo paciente"
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
        />
      )}
    </div>
  );
}
