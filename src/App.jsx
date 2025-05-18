import React, { useState, useEffect } from "react";
import TelaLocalizarPaciente from "./pages/TelaLocalizarPaciente";
import TelaAtendimento from "./pages/TelaAtendimento";
import TelaCadastroPaciente from "./pages/TelaCadastroPaciente";
import TelaAvaliacaoMando from "./pages/TelaAvaliacaoMando";
import TelaPlanoTerapeutico from "./pages/TelaPlanoTerapeutico";
import TelaHistoricoPlanos from "./pages/TelaHistoricoPlanos";
import VisualizarPlanoSalvo from "./pages/VisualizarPlanoSalvo";

import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "./services/ConfiguracaoFirebase";

export default function App() {
  const [etapa, setEtapa] = useState("localizar");
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null);
  const [dadosAvaliacao, setDadosAvaliacao] = useState(null);
  const [numeroAtendimento, setNumeroAtendimento] = useState(0);
  const [planoSelecionado, setPlanoSelecionado] = useState(null);
  const [planosHistorico, setPlanosHistorico] = useState([]);

  // Busca planos no Firestore sempre que pacienteSelecionado mudar
  useEffect(() => {
    async function buscarPlanos() {
      if (!pacienteSelecionado) {
        setPlanosHistorico([]);
        return;
      }
      try {
        const planosRef = collection(db, "planos_terapeuticos");
        const q = query(
          planosRef,
          where("codigoPaciente", "==", pacienteSelecionado.codigoPaciente)
        );
        const querySnapshot = await getDocs(q);
        const planos = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPlanosHistorico(planos);
      } catch (error) {
        console.error("Erro ao buscar planos:", error);
        setPlanosHistorico([]);
      }
    }

    buscarPlanos();
  }, [pacienteSelecionado]);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {/* Localizar Paciente */}
      {etapa === "localizar" && (
        <TelaLocalizarPaciente
          onSelecionar={(paciente) => {
            setPacienteSelecionado(paciente);
            setNumeroAtendimento(paciente.numeroAtendimento || 0);
            setEtapa("visualizar");
          }}
          onCadastrarNovo={() => setEtapa("cadastrar")}
        />
      )}

      {/* Cadastro de Paciente */}
      {etapa === "cadastrar" && (
        <TelaCadastroPaciente
          onSalvar={(paciente) => {
            setPacienteSelecionado(paciente);
            setNumeroAtendimento(paciente.numeroAtendimento || 0);
            setEtapa("visualizar");
          }}
          onCancelar={() => setEtapa("localizar")}
        />
      )}

      {/* Tela de Atendimento */}
      {etapa === "visualizar" && pacienteSelecionado && (
        <TelaAtendimento
          paciente={pacienteSelecionado}
          numeroAtendimento={numeroAtendimento}
          onEditar={() => setEtapa("cadastrar")}
          onVoltar={() => setEtapa("localizar")}
          onAvancar={(dadosAtendimento) => {
            setPacienteSelecionado(dadosAtendimento);
            setNumeroAtendimento(dadosAtendimento.numeroAtendimento || 0);
            setEtapa("avaliar");
          }}
          onAbrirHistorico={() => setEtapa("historico")}
        />
      )}

      {/* Tela de Avaliação */}
      {etapa === "avaliar" && pacienteSelecionado && (
        <TelaAvaliacaoMando
          paciente={pacienteSelecionado}
          numeroAtendimento={numeroAtendimento}
          onVoltar={() => setEtapa("visualizar")}
          onGerarPlano={(avaliacao) => {
            setDadosAvaliacao(avaliacao);
            setEtapa("plano");
          }}
        />
      )}

      {/* Tela de Plano Terapêutico */}
      {etapa === "plano" && pacienteSelecionado && dadosAvaliacao && (
        <TelaPlanoTerapeutico
          paciente={pacienteSelecionado}
          avaliacao={dadosAvaliacao}
          numeroAtendimento={numeroAtendimento}
          onVoltar={() => setEtapa("avaliar")}
          onConsultarHistorico={() => setEtapa("historico")}
        />
      )}

      {/* Tela de Histórico */}
      {etapa === "historico" && pacienteSelecionado && (
        <TelaHistoricoPlanos
          paciente={pacienteSelecionado}
          historico={planosHistorico} // passar a prop historico aqui
          onVoltar={() =>
            dadosAvaliacao ? setEtapa("plano") : setEtapa("visualizar")
          }
          onSelecionarPlano={(plano) => {
            setPlanoSelecionado(plano);
            setEtapa("visualizarPlano");
          }}
        />
      )}

      {/* Tela de Visualização de Plano salvo */}
      {etapa === "visualizarPlano" && planoSelecionado && (
        <VisualizarPlanoSalvo
          plano={planoSelecionado}
          onVoltar={() => setEtapa("historico")}
        />
      )}
    </div>
  );
}
