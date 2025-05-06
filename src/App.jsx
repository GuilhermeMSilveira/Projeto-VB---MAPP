import React, { useState } from "react";
import TelaLocalizarPaciente from "./pages/TelaLocalizarPaciente";
import TelaAtendimento from "./pages/TelaAtendimento";
import TelaCadastroPaciente from "./pages/TelaCadastroPaciente";
import TelaAvaliacaoMando from "./pages/TelaAvaliacaoMando";
import TelaPlanoTerapeutico from "./pages/TelaPlanoTerapeutico";

export default function App() {
  const [etapa, setEtapa] = useState("localizar");
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null);
  const [dadosAvaliacao, setDadosAvaliacao] = useState(null);
  const [numeroAtendimento, setNumeroAtendimento] = useState(0); // Novo estado para número de atendimento

  return (
    <div className="p-4">
      {/* Etapa de Localizar Paciente */}
      {etapa === "localizar" && (
        <TelaLocalizarPaciente
          onSelecionar={(paciente) => {
            setPacienteSelecionado(paciente);
            setNumeroAtendimento(paciente.numeroAtendimento || 0); // Atualiza o número de atendimento se existir
            setEtapa("visualizar");
          }}
          onCadastrarNovo={() => setEtapa("cadastrar")}
        />
      )}

      {/* Etapa de Cadastro de Paciente */}
      {etapa === "cadastrar" && (
        <TelaCadastroPaciente
          onSalvar={(paciente) => {
            setPacienteSelecionado(paciente);
            setNumeroAtendimento(paciente.numeroAtendimento || 0); // Atualiza o número de atendimento se existir
            setEtapa("visualizar");
          }}
          onCancelar={() => setEtapa("localizar")}
        />
      )}

      {/* Etapa de Visualizar Paciente */}
      {etapa === "visualizar" && pacienteSelecionado && (
        <TelaAtendimento
          paciente={pacienteSelecionado}
          numeroAtendimento={numeroAtendimento} // Passa o número de atendimento para a tela
          onEditar={() => setEtapa("cadastrar")}
          onVoltar={() => setEtapa("localizar")}
          onAvancar={(dadosAtendimento) => {
            setPacienteSelecionado(dadosAtendimento);
            setNumeroAtendimento(dadosAtendimento.numeroAtendimento || 0); // Atualiza o número
            setEtapa("avaliar");
          }}
        />
      )}

      {/* Etapa de Avaliação */}
      {etapa === "avaliar" && pacienteSelecionado && (
        <TelaAvaliacaoMando
          paciente={pacienteSelecionado}
          numeroAtendimento={numeroAtendimento} // Passa o número para Avaliação
          onVoltar={() => setEtapa("visualizar")}
          onGerarPlano={(avaliacao) => {
            setDadosAvaliacao(avaliacao); // Salva os dados da avaliação
            setEtapa("plano"); // Avança para o plano terapêutico
          }}
        />
      )}

      {/* Etapa de Plano Terapêutico */}
      {etapa === "plano" && pacienteSelecionado && dadosAvaliacao && (
        <TelaPlanoTerapeutico
          paciente={pacienteSelecionado}
          avaliacao={dadosAvaliacao}
          numeroAtendimento={numeroAtendimento} // Também é passado aqui
          onVoltar={() => setEtapa("avaliar")}
        />
      )}
    </div>
  );
}
