import React, { useEffect, useState } from "react";
import { db } from "../services/ConfiguracaoFirebase";
import {collection, addDoc, doc, updateDoc, getDoc, query, orderBy, limit, getDocs,} from "firebase/firestore";

const TelaCadastroPaciente = ({ paciente, onCancelar }) => {
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
    const carregarPaciente = async () => {
      if (paciente) {
        try {
          const docRef = doc(db, "pacientes", paciente.id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setDados(docSnap.data());
          }
        } catch (error) {
          console.error("Erro ao carregar paciente:", error);
        }
      } else {
        try {
          const pacientesRef = collection(db, "pacientes");
          const q = query(pacientesRef, orderBy("codigoPaciente", "desc"), limit(1));
          const snapshot = await getDocs(q);

          let novoCodigo = 1;
          if (!snapshot.empty) {
            const ultimoPaciente = snapshot.docs[0].data();
            const ultimoCodigo = parseInt(ultimoPaciente.codigoPaciente);
            novoCodigo = ultimoCodigo + 1;
          }

          setDados((prev) => ({ ...prev, codigoPaciente: String(novoCodigo) }));
        } catch (error) {
          console.error("Erro ao gerar código do paciente:", error);
        }
      }
    };

    carregarPaciente();
  }, [paciente]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDados((prev) => ({ ...prev, [name]: value }));
  };

  const camposObrigatorios = [
    "codigoPaciente",
    "nomeCompleto",
    "dataNascimento",
    "genero",
    "responsavel",
    "parentesco",
    "telefone",
    "endereco",
  ];

  const camposPreenchidos = camposObrigatorios.every((campo) => dados[campo].trim() !== "");

  const handleSubmit = async () => {
    if (!camposPreenchidos) {
      setMensagem("❌ Por favor, preencha todos os campos obrigatórios.");
      return;
    }

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
    <div className="container">
      <div className="form-container">

        <h2 className="title">
          {paciente ? "Editar Paciente" : "Cadastrar Novo Paciente"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[ 
            ["Código do Paciente", "codigoPaciente", "text", true],
            ["Nome Completo", "nomeCompleto", "text"],
            ["Data de Nascimento", "dataNascimento", "date"],
            ["Gênero", "genero", "select"],
            ["Nome do Responsável", "responsavel", "text"],
            ["Parentesco", "parentesco", "select-parentesco"],
            ["Telefone", "telefone", "tel"],
            ["E-mail", "email", "email"]
          ].map(([label, name, type, readOnly = false]) => (
            <div className="input-group" key={name}>
              <label className="label">{label}</label>
              {type === "select" ? (
                <select
                  name={name}
                  value={dados[name]}
                  onChange={handleChange}
                  className="input"
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
                  className="input"
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
                  readOnly={readOnly}
                  className={`input ${readOnly ? "input-readonly" : ""}`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="input-group" key="endereco">
        <label  className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">Endereço</label>
          <textarea
            name="endereco"
            value={dados.endereco}
            onChange={handleChange}
            className="input"
          />
        </div>
        <div className="input-group">
          <label className="label">Observações</label>
          <textarea
            name="observacoes"
            value={dados.observacoes}
            onChange={handleChange}
            className="input textarea"
          />
        </div>
        {mensagem && (
          <p className={`message ${mensagem.startsWith("✅") ? "success" : "error"}`}>
            {mensagem}
          </p>
        )}

        <div className="submit-container">
        <button
          onClick={onCancelar}
          className="botao botao-Voltar"
        >
          🔙 Voltar para Localizar Paciente
        </button>
          <button
            onClick={handleSubmit}
            className="submit-button"
          >
            💾 Salvar
          </button>

        </div>
      </div>
    </div>
  );
};

export default TelaCadastroPaciente;
