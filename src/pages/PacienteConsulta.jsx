import React, { useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

const PacienteConsulta = ({ onSelecionar, onCadastrarNovo }) => {
  const [filtro, setFiltro] = useState({
    nome: "",
    codigo: "",
    nascimento: "",
  });

  const [pacientes, setPacientes] = useState([]);
  const [carregando, setCarregando] = useState(false);

  const buscarPaciente = async () => {
    setCarregando(true);
    try {
      let ref = collection(db, "pacientes");

      if (filtro.nome.trim() !== "") {
        ref = query(ref, where("nomeCompleto", "==", filtro.nome));
      } else if (filtro.codigo.trim() !== "") {
        ref = query(ref, where("codigoPaciente", "==", filtro.codigo));
      } else if (filtro.nascimento.trim() !== "") {
        ref = query(ref, where("dataNascimento", "==", filtro.nascimento));
      }

      const querySnapshot = await getDocs(ref);
      const pacientesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPacientes(pacientesData);
    } catch (error) {
      console.error("Erro ao buscar paciente:", error);
    } finally {
      setCarregando(false);
    }
  };

  const formatarData = (dataString) => {
    if (!dataString) return "";
    const [ano, mes, dia] = dataString.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white w-full max-w-3xl p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-blue-700 text-center mb-6">
          Localizar Paciente
        </h2>

        <div className="formulario-busca mb-6 space-y-4">
          <input
            type="text"
            placeholder="Código"
            value={filtro.codigo}
            onChange={(e) => setFiltro({ ...filtro, codigo: e.target.value })}
            className="input-codigo-paciente"
            />
          <input
            type="text"
            placeholder="Nome"
            value={filtro.nome}
            onChange={(e) => setFiltro({ ...filtro, nome: e.target.value })}
            className="input-nome-completo"
            />
          <input
            type="date"
            value={filtro.nascimento}
            onChange={(e) =>
              setFiltro({ ...filtro, nascimento: e.target.value })}
            className="input-data-nascimento"
            />
        </div>

        <div className="flex justify-between mb-6 gap-4 flex-wrap">
          <button
            onClick={buscarPaciente}
            className="botao botao-buscar"
            >
             🔍 Buscar
          </button>
          <button
            onClick={onCadastrarNovo}
            className="botao botao-cadastrar"
            >
            ➕ Cadastrar Novo Paciente
          </button>
        </div>

        {carregando ? (
          <p className="text-center text-blue-600">Carregando...</p>
        ) : (
          <div className="pacientes-lista mt-6">
            {pacientes.length > 0 ? (
              <ul className="space-y-4">
                {pacientes.map((paciente, index) => (
                  <li
                    key={index}
                    onClick={() => onSelecionar(paciente)}
                    className="border p-4 rounded-lg shadow-sm cursor-pointer hover:bg-gray-100 transition-all"
                  >
                    <p>
                      <strong>Código:</strong> {paciente.codigoPaciente}
                    </p>
                    <p>
                      <strong>Nome:</strong> {paciente.nomeCompleto}
                    </p>
                    <p>
                      <strong>Nascimento:</strong> {formatarData(paciente.dataNascimento)}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-600">
                Nenhum paciente encontrado.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PacienteConsulta;
