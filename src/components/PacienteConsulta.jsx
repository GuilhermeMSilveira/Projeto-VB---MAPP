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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="bg-white w-full max-w-3xl p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-blue-700 text-center mb-6">
          Localizar Paciente
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            placeholder="Nome"
            value={filtro.nome}
            onChange={(e) => setFiltro({ ...filtro, nome: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Código"
            value={filtro.codigo}
            onChange={(e) => setFiltro({ ...filtro, codigo: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="date"
            value={filtro.nascimento}
            onChange={(e) =>
              setFiltro({ ...filtro, nascimento: e.target.value })
            }
            className="border p-2 rounded"
          />
        </div>

        <div className="flex justify-center mb-4 gap-4 flex-wrap">
          <button
            onClick={buscarPaciente}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Buscar
          </button>
          <button
            onClick={onCadastrarNovo}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            ➕ Cadastrar Novo Paciente
          </button>
        </div>

        {carregando ? (
          <p className="text-center">Carregando...</p>
        ) : (
          <div className="max-h-64 overflow-y-auto">
            {pacientes.length > 0 ? (
              <ul className="space-y-2">
                {pacientes.map((paciente, index) => (
                  <li
                    key={index}
                    onClick={() => onSelecionar(paciente)}
                    className="border p-4 rounded shadow hover:bg-gray-100 cursor-pointer"
                  >
                    <p>
                      <strong>Nome:</strong> {paciente.nomeCompleto}
                    </p>
                    <p>
                      <strong>Código:</strong> {paciente.codigoPaciente}
                    </p>
                    <p>
                      <strong>Nascimento:</strong> {paciente.dataNascimento}
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
