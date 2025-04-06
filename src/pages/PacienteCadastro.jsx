import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";

const PacienteCadastro = ({ paciente, onCancelar }) => {
  const [dados, setDados] = useState({
    codigoPaciente: "",
    nomeCompleto: "",
    dataNascimento: "",
    genero: "",
    responsavel: "",
    parentesco: "",
    telefone: "",
    email: "",
    endereco: "",
    observacoes: "",
  });

  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    if (paciente) {
      const carregar = async () => {
        try {
          const docRef = doc(db, "pacientes", paciente.id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setDados(docSnap.data());
          }
        } catch (error) {
          console.error("Erro ao carregar paciente:", error);
        }
      };
      carregar();
    }
  }, [paciente]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDados((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (paciente) {
        const docRef = doc(db, "pacientes", paciente.id);
        await updateDoc(docRef, dados);
        setMensagem("✅ Paciente atualizado com sucesso!");
      } else {
        await addDoc(collection(db, "pacientes"), dados);
        setMensagem("✅ Paciente cadastrado com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao salvar paciente:", error);
      setMensagem("❌ Erro ao salvar paciente.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      <div className="bg-white w-full max-w-3xl p-6 rounded-lg shadow-lg">
        {/* Botão de voltar */}
        <button
          onClick={onCancelar}
          className="mb-4 text-sm text-blue-600 hover:underline"
        >
          ← Voltar para Localizar Paciente
        </button>

        <h2 className="text-2xl font-bold text-blue-700 text-center mb-6">
          {paciente ? "Editar Paciente" : "Cadastrar Novo Paciente"}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            ["Código do Paciente", "codigoPaciente", "text"],
            ["Nome Completo", "nomeCompleto", "text"],
            ["Data de Nascimento", "dataNascimento", "date"],
            ["Gênero", "genero", "select"],
            ["Nome do Responsável", "responsavel", "text"],
            ["Parentesco", "parentesco", "select-parentesco"],
            ["Telefone", "telefone", "tel"],
            ["E-mail", "email", "email"],
          ].map(([label, name, type]) => (
            <div className="flex flex-col" key={name}>
              <label className="mb-1 text-sm font-medium text-gray-700">
                {label}
              </label>

              {type === "select" ? (
                <select
                  name={name}
                  value={dados[name]}
                  onChange={handleChange}
                  className="border p-2 rounded"
                >
                  <option value="">Selecione o Gênero</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                  <option value="Outro">Outro</option>
                </select>
              ) : type === "select-parentesco" ? (
                <select
                  name={name}
                  value={dados[name]}
                  onChange={handleChange}
                  className="border p-2 rounded"
                >
                  <option value="">Selecione o Parentesco</option>
                  <option value="Mãe">Mãe</option>
                  <option value="Pai">Pai</option>
                  <option value="Avó">Avó</option>
                  <option value="Avô">Avô</option>
                  <option value="Tia">Tia</option>
                  <option value="Tio">Tio</option>
                  <option value="Irmã">Irmã</option>
                  <option value="Irmão">Irmão</option>
                  <option value="Outro">Outro</option>
                </select>
              ) : (
                <input
                  type={type}
                  name={name}
                  value={dados[name]}
                  onChange={handleChange}
                  className="border p-2 rounded"
                />
              )}
            </div>
          ))}
        </div>

        <div className="mt-4">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Endereço
          </label>
          <textarea
            name="endereco"
            value={dados.endereco}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>

        <div className="mt-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Observações
          </label>
          <textarea
            name="observacoes"
            value={dados.observacoes}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>

        {mensagem && (
          <p className="text-green-600 font-medium text-center mt-4">
            {mensagem}
          </p>
        )}

        <div className="flex justify-center mt-6">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PacienteCadastro;
