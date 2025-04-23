import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const TelaAtendimento = ({ paciente, onVoltar, onAvancar }) => {
  const [formData, setFormData] = useState({
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
    numeroAtendimento: 0,
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const carregarDadosPacienteEAtendimento = async () => {
      if (paciente?.codigoPaciente) {
        const q = query(
          collection(db, "atendimentos"),
          where("codigoPaciente", "==", paciente.codigoPaciente)
        );
        const querySnapshot = await getDocs(q);
        const numeroAtendimento = querySnapshot.size + 1; // Incrementa o número de atendimento

        setFormData({
          codigoPaciente: paciente.codigoPaciente || "",
          nomeCompleto: paciente.nomeCompleto || "",
          dataNascimento: paciente.dataNascimento || "",
          genero: paciente.genero || "",
          responsavel: paciente.responsavel || "",
          parentesco: paciente.parentesco || "",
          telefone: paciente.telefone || "",
          email: paciente.email || "",
          endereco: paciente.endereco || "",
          observacoes: paciente.observacoes || "",
          numeroAtendimento, // Atribui o número de atendimento
        });
      }
    };

    if (paciente) {
      carregarDadosPacienteEAtendimento();
    }
  }, [paciente]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const salvarAtendimento = async () => {
    if (!formData.codigoPaciente || !formData.nomeCompleto) {
      alert("Preencha o Código do Paciente e Nome Completo antes de salvar.");
      return false;
    }

    setIsLoading(true);
    try {
      await addDoc(collection(db, "atendimentos"), {
        ...formData,
        dataAtendimento: new Date().toISOString(),
      });
      return true;
    } catch (error) {
      console.error("Erro ao salvar atendimento:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvancar = async () => {
    const sucesso = await salvarAtendimento();
    if (sucesso) {
      onAvancar(formData); // Envia os dados incluindo o número do atendimento
    }
  };

  return (
    <div className="container-atendimento">
      <div className="form-container-atendimento">
        <h2 className="title-atendimento">Atendimento do Paciente</h2>

        <form className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <label className="input-group-atendimento">Número do Atendimento</label>
            <p className="input-atendimento bg-gray-100">{formData.numeroAtendimento}</p>
          </div>

          <div>
            <label className="input-group-atendimento">Código do Paciente</label>
            <input
              name="codigoPaciente"
              value={formData.codigoPaciente}
              onChange={handleChange}
              className="input-atendimento"
            />
          </div>

          <div>
            <label className="input-group-atendimento">Nome Completo</label>
            <input
              name="nomeCompleto"
              value={formData.nomeCompleto}
              onChange={handleChange}
              className="input-atendimento"
            />
          </div>

          <div>
            <label className="input-group-atendimento">Data de Nascimento</label>
            <input
              name="dataNascimento"
              type="date"
              value={formData.dataNascimento}
              onChange={handleChange}
              className="input-atendimento"
            />
          </div>

          <div>
            <label className="input-group-atendimento">Gênero</label>
            <select
              name="genero"
              value={formData.genero}
              onChange={handleChange}
              className="input-atendimento"
            >
              <option value="">Selecione</option>
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
              <option value="Outro">Outro</option>
            </select>
          </div>

          <div>
            <label className="input-group-atendimento">Nome do Responsável</label>
            <input
              name="responsavel"
              value={formData.responsavel}
              onChange={handleChange}
              className="input-atendimento"
            />
          </div>

          <div>
            <label className="input-group-atendimento">Parentesco</label>
            <input
              name="parentesco"
              value={formData.parentesco}
              onChange={handleChange}
              className="input-atendimento"
            />
          </div>

          <div>
            <label className="input-group-atendimento">Telefone</label>
            <input
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              className="input-atendimento"
            />
          </div>

          <div>
            <label className="input-group-atendimento">E-mail</label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input-atendimento"
            />
          </div>

          <div className="md:col-span-3">
            <label className="input-group-atendimento">Endereço</label>
            <textarea
              name="endereco"
              value={formData.endereco}
              onChange={handleChange}
              className="input-atendimento"
              rows={2}
            />
          </div>

          <div className="md:col-span-3">
            <label className="input-group-atendimento">Observações</label>
            <textarea
              name="observacoes"
              value={formData.observacoes}
              onChange={handleChange}
              className="input textarea"
              rows={3}
            />
          </div>
        </form>

        <div className="flex gap-6">
          <button
            onClick={onVoltar}
            className="botao-voltar-atendimento"
            disabled={isLoading}
          >
            🔙 Voltar
          </button>
          <button
            onClick={handleAvancar}
            className="botao-avancar-atendimento"
            disabled={isLoading}
          >
            ✅ Avançar para Avaliação
          </button>
        </div>
      </div>
    </div>
  );
};
export default TelaAtendimento;
