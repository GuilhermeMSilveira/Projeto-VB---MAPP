import React, { useState } from 'react';

const perguntasMandoNivel1 = [
  {
    id: 1,
    texto: "Emite 2 palavras, sinais ou utiliza figuras, mas pode precisar de dica ecóica, imitativa ou de outro tipo, desde que não seja dica física (e.g., biscoito, livro). (O/T)",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: 2 mandos frente ao item desejado com dica ecóica (crianças verbais), dica imitativa ou verbal (língua de sinais), gestual ou PECS. Sem dica física." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: 1 mando com os mesmos critérios acima. Sem dica física." },
      { valor: 0, descricao: "🔴 0 ponto: Se for necessário dar dica física para que a criança responda." }
    ]
  },
  {
    id: 2,
    texto: "Emite 4 mandos diferentes sem dicas (exceto a pergunta: “O que você quer?”, que pode ser utilizada). Os itens desejáveis podem estar presentes (ex: bola, música, bolacha). Testar.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto = 4 mandos para 4 reforçadores diferentes sem nenhuma dica" },
      { valor: 0.5, descricao: "🟠 0,5 ponto = 3 mandos para 3 reforçadores diferentes sem nenhuma dica" },
      { valor: 0, descricao: "🔴 0 ponto = se emitir menos de 3 mandos ou se houver necessidade de dica." }
    ]
  },
  {
    id: 3,
    texto: "Generaliza 6 mandos (referentes a reforçadores da criança) entre duas pessoas, dois ambientes e dois exemplos diferentes de um mesmo reforçador (ex: pedir bolhas de sabão para a mãe e para o pai, dentro e fora de casa e, também, bolas de sabão de frascos diferentes - azul e o vermelho). Testar ou Observar.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto = 6 mandos entre duas pessoas, dois ambientes e dois exemplos diferentes de um mesmo reforçador." },
      { valor: 0.5, descricao: "🟠 0,5 ponto = de 3 a 5 mandos entre duas pessoas, dois ambientes e dois exemplos diferentes de um mesmo reforçador." },
      { valor: 0, descricao: "🔴 0 ponto = se emitir menos de 3 mandos com as variações exigidas ou se não generalizar os reforçadores." }
    ]
  },
  {
    id: 4,
    texto: "Espontaneamente (sem dica verbal) emite 5 mandos. Os itens desejados podem estar presentes. O controle deve ser da operação estabelecedora e não da dica do adulto. Observação por tempo – 60 minutos.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: se emite pelo menos 2 mandos diferentes 5 vezes em 60 minutos espontaneamente (sem a pergunta “O que você quer?”, ou dica semelhante)." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: se emite só 1 mando 5 vezes em 60 minutos espontaneamente (sem a pergunta “O que você quer?”, ou dica semelhante)." },
      { valor: 0, descricao: "🔴 0 ponto: se não emite mandos espontaneamente ou se houver necessidade de dica verbal para controle do mando." }
    ]
  },
  {
    id: 5,
    texto: "Emite outros 10 mandos diferentes sem dica (exceto a pergunta: O que você quer?, que pode ser utilizada). Os itens desejados podem estar presentes. Testar ou Observar.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: se emitir 10 mandos diferentes sem nenhuma dica." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: se emitir de 8 a 9 mandos diferentes sem nenhuma dica." },
      { valor: 0, descricao: "🔴 0 ponto: se emitir menos de 8 mandos diferentes ou precisar de dicas para controle." }
    ],
  }
];

const AvaliacaoMando = () => {
  const [respostas, setRespostas] = useState(Array(perguntasMandoNivel1.length).fill(""));

  const handleResposta = (index, valor) => {
    const novasRespostas = [...respostas];
    novasRespostas[index] = valor;
    setRespostas(novasRespostas);
  };

  const calcularTotal = () => {
    return respostas.reduce((total, valor) => total + (parseFloat(valor) || 0), 0);
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-xl">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-4">Avaliação - Mando Nível 1</h2>

      <form className="space-y-8">
        {/* Dados do paciente */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Código do Paciente</label>
            <input type="text" className="w-full border border-gray-300 p-2 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Paciente</label>
            <input type="text" className="w-full border border-gray-300 p-2 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Avaliador</label>
            <input type="text" className="w-full border border-gray-300 p-2 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
            <input type="date" className="w-full border border-gray-300 p-2 rounded-lg" />
          </div>
        </div>

        {/* Perguntas */}
        <div className="space-y-6">
          {perguntasMandoNivel1.map((pergunta, index) => (
            <div key={pergunta.id}>
              <label className="block text-lg font-medium text-gray-800 mb-2">
                {index + 1}. {pergunta.texto}
              </label>

              {/* Respostas abaixo da pergunta */}
              <div className="space-y-2">
                <select
                  className="w-full border border-gray-300 p-3 rounded-lg"
                  value={respostas[index]}
                  onChange={(e) => handleResposta(index, e.target.value)}
                >
                  <option value="">Selecione uma resposta</option>
                  {pergunta.respostas.map((resposta, i) => (
                    <option key={i} value={resposta.valor}>{resposta.descricao}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>

        {/* Observações */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
          <textarea
            rows="4"
            placeholder="Digite observações adicionais aqui..."
            className="w-full border border-gray-300 p-3 rounded-lg"
          />
        </div>

        {/* Total e botão */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-6">
          <span className="text-lg font-semibold text-gray-800">
            Total de Pontos: {calcularTotal()} / {perguntasMandoNivel1.length}
          </span>
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Salvar Avaliação
          </button>
        </div>
      </form>
    </div>
  );
};

export default AvaliacaoMando;
