import React, { useEffect, useState } from "react";

const TelaAtendimento = ({ paciente, onVoltar, onAvancar }) => {
  const [formData, setFormData] = useState({
    codigoPaciente: "",
    nomeCompleto: "",
    dataNascimento: "",
    genero: "",
    nomeResponsavel: "",
    parentesco: "",
    telefone: "",
    email: "",
    endereco: "",
    observacoes: "",
  });

  useEffect(() => {
    if (paciente) {
      setFormData({
        codigoPaciente: paciente.codigoPaciente || "",
        nomeCompleto: paciente.nomeCompleto || "",
        dataNascimento: paciente.dataNascimento || "",
        genero: paciente.genero || "",
        nomeResponsavel: paciente.nomeResponsavel || "",
        parentesco: paciente.parentesco || "",
        telefone: paciente.telefone || "",
        email: paciente.email || "",
        endereco: paciente.endereco || "",
        observacoes: paciente.observacoes || "",
      });
    }
  }, [paciente]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white w-full max-w-4xl p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-blue-700 text-center mb-6">
          Atendimento do Paciente
        </h2>

        <form className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Código do Paciente</label>
            <input
              name="codigoPaciente"
              value={formData.codigoPaciente}
              onChange={handleChange}
              className="mt-1 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
            <input
              name="nomeCompleto"
              value={formData.nomeCompleto}
              onChange={handleChange}
              className="mt-1 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Data de Nascimento</label>
            <input
              name="dataNascimento"
              type="date"
              value={formData.dataNascimento}
              onChange={handleChange}
              className="mt-1 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Gênero</label>
            <select
              name="genero"
              value={formData.genero}
              onChange={handleChange}
              className="mt-1 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Selecione</option>
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
              <option value="Outro">Outro</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Nome do Responsável</label>
            <input
              name="nomeResponsavel"
              value={formData.nomeResponsavel}
              onChange={handleChange}
              className="mt-1 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Parentesco</label>
            <input
              name="parentesco"
              value={formData.parentesco}
              onChange={handleChange}
              className="mt-1 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Telefone</label>
            <input
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              className="mt-1 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">E-mail</label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Endereço</label>
            <textarea
              name="endereco"
              value={formData.endereco}
              onChange={handleChange}
              className="mt-1 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows={2}
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Observações</label>
            <textarea
              name="observacoes"
              value={formData.observacoes}
              onChange={handleChange}
              className="mt-1 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows={3}
            />
          </div>
        </form>

        <div className="flex justify-between mt-8">
          <button
            onClick={onVoltar}
            className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500"
          >
            🔙 Voltar
          </button>
          <button
            onClick={onAvancar}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            ✅ Avançar para Avaliação
          </button>
        </div>
      </div>
    </div>
  );
};

export default TelaAtendimento;
