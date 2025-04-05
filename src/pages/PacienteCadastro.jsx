export default function CadastroPaciente() {
  return (
    <div className="min-h-screen bg-white py-10 px-4">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
        Cadastro do Paciente
      </h1>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Código do Paciente</label>
          <input type="text" placeholder="Ex: CP123456" className="w-full p-3 border border-gray-300 rounded-md" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nome completo</label>
          <input type="text" placeholder="Nome da criança" className="w-full p-3 border border-gray-300 rounded-md" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Data de nascimento</label>
          <input type="date" className="w-full p-3 border border-gray-300 rounded-md" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Gênero</label>
          <select className="w-full p-3 border border-gray-300 rounded-md">
            <option value="">Selecione</option>
            <option value="masculino">Masculino</option>
            <option value="feminino">Feminino</option>
            <option value="outro">Outro</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nome do responsável</label>
          <input type="text" placeholder="Nome completo do responsável" className="w-full p-3 border border-gray-300 rounded-md" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Parentesco</label>
          <select className="w-full p-3 border border-gray-300 rounded-md">
            <option value="">Selecione</option>
            <option value="pai">Pai</option>
            <option value="mae">Mãe</option>
            <option value="outro">Outro</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
          <input type="tel" placeholder="(XX) XXXXX-XXXX" className="w-full p-3 border border-gray-300 rounded-md" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input type="email" placeholder="exemplo@email.com" className="w-full p-3 border border-gray-300 rounded-md" />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Endereço</label>
          <input type="text" placeholder="Rua, número, bairro, cidade" className="w-full p-3 border border-gray-300 rounded-md" />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Observações</label>
          <textarea placeholder="Informações adicionais sobre a criança..." className="w-full p-3 border border-gray-300 rounded-md" rows={4} />
        </div>
      </div>

      <div className="max-w-4xl mx-auto mt-8">
        <button className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition">
          Cadastrar
        </button>
      </div>
    </div>
  );
}
