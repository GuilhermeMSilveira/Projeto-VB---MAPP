import React, { useState, useEffect } from 'react';
import { db } from '../services/ConfiguracaoFirebase'; // Importe a configuração do Firebase
import { collection, addDoc, updateDoc, doc, query, where, getDocs } from 'firebase/firestore';

// 🟡 Avaliação Mando (completa)
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

// 🟢 Avaliação Tato (exemplo com estrutura igual)
const perguntasTatoNivel1 = [
  {
    id: 1,
    texto: "Tateia 2 itens do ambiente da criança, podendo ser reforçadores ou não (ex: pessoas, bichos, personagens ou objetos).",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se nomear 2 itens sem nenhuma dica quando perguntado O que é isto?" },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se nomear 1 itens sem nenhuma dica quando perguntado O que é isto?" },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção." }
    ]
  },
  {
    id: 2,
    texto: "Tateia outros 4 itens do ambiente da criança, podendo ser reforçadores ou não. (ex: pessoas, bichos, personagens ou objetos).",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto:  Se nomear outros 4 itens sem nenhuma dica quando perguntado O que é isto?" },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se nomear outros 3 itens sem nenhuma dica quando perguntado O que é isto?" },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
    {
    id: 3,
    texto: "Tateia 6 itens não reforçadores (ex: sapato, chapéu, cama).",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se nomear 6 itens não reforçadores sem nenhuma dica quando perguntado O que é isto" },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se nomear 5 itens não reforçadores sem nenhuma dica quando perguntado O que é isto?" },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
    {
    id: 4,
    texto: "Espontaneamente tateia 2 itens diferentes (sem dica verbal). Observação por tempo - 60 minutos.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se nomear 2 itens diferentes sem perguntar O que é isto? em 60 minutos de observação." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se nomear 1 item sem perguntar O que é isto? em 60 minutos de observação. " },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
  
  {
    id: 5,
    texto: "Tateia outros 10 itens quaisquer (objetos comuns, pessoas, partes do corpo ou figuras).",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se nomear outros 10 itens sem nenhuma dica quando perguntado O que é isto?" },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se nomear 8 ou 9 itens sem nenhuma dica quando perguntado O que é isto?." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção." }
    ]
  }
];

// 🟢 Avaliação Ouvinte (exemplo com estrutura igual)
const perguntasOuvinteNivel1 = [
  {
    id: 1,
    texto: "Atende para a voz de um falante (adulto falando com a criança enquanto brinca; adulto cantando; etc.) fazendo contato visual 5 vezes.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se fizer contato visual com o adulto que está falando 5 vezes em 30 minutos." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se fizer contato visual com o adulto que está falando de 2 a 4 vezes em 30 minutos." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
  {
    id: 2,
    texto: "Responde ao ouvir o seu nome 5 vezes (ex: olha para o falante).",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se fizer contato visual com o adulto que chama seu nome em 5 tentativas separadas, sem limite de tempo especificado." },
      { valor: 0.5, descricao: "🟠 0,5 ponto:  Não há esta pontuação para esta habilidade." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção." }
    ]
  },
    {
    id: 3,
    texto: "Olha, toca ou aponta corretamente 5 reforçadores diferentes apresentados de 2 em 2 e frente à demanda do adulto.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se identificar corretamente 5 diferentes reforçadores quando nomeados individualmente por um adulto." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se identificar corretamente de 2 a 4 diferentes reforçadores quando nomeados individualmente por um adulto." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção." }
    ]
  },
    {
    id: 4,
    texto: "Executa 4 ações motoras diferentes quando solicitado sem dica visual. (ex: Você pode pular?; Bata palmas).",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se emitir a ação motora correta 2 vezes para 4 instruções diferentes." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se emitir a ação motora correta 2 vezes para 2 instruções diferentes." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção." }
    ]
  },
  {
    id: 5,
    texto: "Seleciona o item correto de um conjunto de 4 itens do ambiente comum da criança, para 20 diferentes objetos ou figuras.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança identificar corretamente 20 itens diferentes em conjuntos de 4 itens na primeira tentativa durante o teste." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança identificar corretamente de 15 a 19 itens diferentes em conjuntos de 4 itens na primeira tentativa durante o teste." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção." }
    ]
  }
];
// 🟢 Avaliação PV/MTS (exemplo com estrutura igual)
const perguntasPVMTSNivel1 = [
  {
    id: 1,
    texto: "Acompanha visualmente estímulos comuns do ambiente da criança em movimento por 2 seg em 5 tentativas.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança acompanhar visualmente o estímulo em movimento por 2 segundos em 5 tentativas durante 30 minutos de observação." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança acompanhar visualmente o estímulo em movimento por 2 segundos em 2 tentativas durante 30 minutos de observação" },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção." }
    ]
  },
  {
    id: 2,
    texto: "Pega pequenos objetos com polegar, indicador e dedo médio (pinça) 5 vezes.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança for bem sucedida com atividades de coordenação visuo-motora,5 vezes durante a observação." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança normalmente precisa de duas ou mais tentativas para conseguir pegar pequenos objetos que estão na sua frente" },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
    {
    id: 3,
    texto: "Permanece olhando para um brinquedo ou livro (que não seja objeto de auto-estimulação) por 30 segundos.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança demonstrar atenção continuada para um específico, e possivelmente reforçador, estímulo visual por 30 segundos." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se acriança demonstrar atenção continuada para um específico, e possivelmente reforçador, estímulo visual por 15 segundos" },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
    {
    id: 4,
    texto: "Coloca 3 itens em um recipiente, empilha 3 blocos ou coloca 3 anéis em um suporte.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança colocar corretamente e de forma independente em 2 quaisquer atividades durante a observação ou o teste." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança colocar corretamente e de forma independente em 1 quaisquer atividades durante a observação ou o teste." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
  
  {
    id: 5,
    texto: "Emparelha quaisquer 10 itens idênticos (ex: colocar quebra-cabeças, brinquedos, objetos ou figuras idênticos juntos).",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança emparelhar os 10 itens com sucesso." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança emparelhar de 5 a 9 itens." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção." }
    ]
  }
];
// 🟢 Avaliação Brincar (exemplo com estrutura igual)
const perguntasBrincarNivel1 = [
  {
    id: 1,
    texto: "Manipula e explora objetos por 1 minuto de forma independente (sem dicas e sem reforçamento).",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança manipular e explorar objetos de forma independente por 1 minuto durante os 30 minutos de observação." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança manipular e explorar objetos de forma independente por 30 segundos durante os 30 minutos de observação." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção." }
    ]
  },
  {
    id: 2,
    texto: "Mostra variação no brincar, interagindo de forma independente (sem dicas e sem reforçamento) com 5 itens diferentes.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança brincar de forma independente com 5 itens diferentes durante os 30 minutos de observação." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se se a criança brincar de forma independente com 3 ou 4 itens diferentes durante os 30 minutos de observação." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
    {
    id: 3,
    texto: "Demonstra generalização ao se engajar em movimentos exploratórios e brincadeiras com os brinquedos em um ambiente novo por 2 minutos de forma independente.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança explorou e tocou os brinquedos de forma independente por 2 min em 30min." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança explorou e tocou os brinquedos de forma independente por 1 min em 30min." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
    {
    id: 4,
    texto: "De forma independente (sem dicas e sem reforçamento) se engaja em brincadeiras com movimento por 2 minutos.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança brincou sozinha com movimentos por 2 min em 30min." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança brincou sozinha com movimentos por 1 min em 30min." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
  
  {
    id: 5,
    texto: "De forma independente (sem dicas e sem reforçamento) se engaja em brincadeiras do tipo causa e efeito por 2 minutos.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança brincou sozinha com causa e efeito por 2 min em 30min." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança brincou sozinha com causa e efeito por 1 min em 30min." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção." }
    ]
  }
];
// 🟢 Avaliação Social (exemplo com estrutura igual)
const perguntasSocialNivel1 = [
  {
    id: 1,
    texto: "Faz contato visual como uma forma de mando 5 vezes.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança fizer contato visual com função de mando 5 vezes durante os 30 min de observação" },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança fizer contato visual com função de mando de 2 a 4 vezes durante os 30 min de observação" },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção." }
    ]
  },
  {
    id: 2,
    texto: "Demonstra que quer ser segurado ou que quer brincar fisicamente por 2 vezes",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança demonstrar que quer ser segurada ou que quer brincar fisicamente por 2 vezes em 1hr." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança demonstrar que quer ser segurada ou que quer brincar fisicamente por 1 vezes em 1hr." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
    {
    id: 3,
    texto: "Espontaneamente faz contato visual com outras crianças 5 vezes.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança espontaneamente fizer contato visual com outras crianças 5 vezes em 30 min." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança espontaneamente fizer contato visual com outras crianças de 2 a 4 vezes em 30 min." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
    {
    id: 4,
    texto: "Espontaneamente se engaja em brincadeiras paralelas perto de outras crianças por 2 minutos.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança espontaneamente se engajar em brincadeiras paralelas perto de outras crianças por 2 min em 30 min." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança espontaneamente se engajar em brincadeiras paralelas perto de outras crianças por 1 min em 30 min." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
  
  {
    id: 5,
    texto: "Espontaneamente segue os pares ou imita seus movimentos motores 2 vezes.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança espontaneamente segue os pares ou imita seus movimentos 2 vezes em 30 min." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança espontaneamente segue os pares ou imita seus movimentos 1 vezes em 30 min." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção." }
    ]
  }
];
// 🟢 Avaliação Imitação (exemplo com estrutura igual)
const perguntasImitacaoNivel1 = [
  {
    id: 1,
    texto: "Imita 2 movimentos amplos quando recebe a instrução 'Faça assim.'",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança imitar 2 movimentos amplos apresentados pelo adulto.Se resposta for aproximada, pontue correta." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança imitar apenas 1 movimento amplo.Se for sempre o mesmo, não pontue." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção." }
    ]
  },
  {
    id: 2,
    texto: "Imita 4 movimentos amplos quando recebe a instrução 'Faça assim'.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança imitar 4 movimentos amplos apresentados pelo adulto. Se resposta for aproximada, pontue correta." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança imitar 3 movimentos amplos." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
    {
    id: 3,
    texto: "Imita 8 movimentos, sendo 2 com objetos, sem dicas físicas.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança imitar 6 movimentos apresentados pelo adulto e imitar 2 comportamentos motores com objetos(8 imitações)." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança imitar 6 comportamentos de qualquer tipo." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
    {
    id: 4,
    texto: "Espontaneamente (sem dicas verbais) imita os comportamentos motores de outras pessoas em 5 ocasiões.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança imitar espontaneamente 2 comportamentos motores diferentes de outras pessoas em 5 ocasiões." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança imitar espontaneamente qualquer comportamento motor de outras pessoas em 2 ocasiões." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
  
  {
    id: 5,
    texto: "Imita 20 movimentos de qualquer tipo.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança imitar 20 comportamentos motores de qualquer tipo." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança imitar de 15 a 19 comportamentos motores de qualquer tipo." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção." }
    ]
  }
];
// 🟢 Avaliação Ecóico (exemplo com estrutura igual)
const perguntasEcoicoNivel1 = [
  {
    id: 1,
    texto: "Pontua pelo menos 2 no subteste EESA.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança pontuar 2 ou mais no subteste EESA." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança pontuar 1 no subteste EESA." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção." }
    ]
  },
  {
    id: 2,
    texto: "Pontua pelo menos 5 no subteste EESA.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança pontuar 5 ou mais no subteste EESA." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança pontuar 3 ou 4 no subteste EESA." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
    {
    id: 3,
    texto: "Pontua pelo menos 10 no subteste EESA.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança pontuar 10 ou mais no subteste EESA." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança pontuar de 7 a 9 no subteste EESA." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
    {
    id: 4,
    texto: "Pontua pelo menos 15 no subteste EESA.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança pontuar 15 ou mais no subteste EESA." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança pontuar de 12 a 14 no subteste EESA." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
  
  {
    id: 5,
    texto: "Pontua pelo menos 25 no subteste EESA.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança pontuar 25 ou mais no subteste EESA, com pelo menos 20 pontos do Grupo 1." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança pontuar de 20 a 24 no subteste EESA, com pelo menos 15 pontos do Grupo 1." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção." }
    ]
  }
];
// 🟢 Avaliação Vocal (exemplo com estrutura igual)
const perguntasVocalNivel1 = [
  {
    id: 1,
    texto: "Espontaneamente emite uma média de 5 sons por hora.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança espontaneamente emitir uma média de 5 sons da fala por hora." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança espontaneamente emitir uma média de 2 a 4 sons da fala por hora." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção." }
    ]
  },
  {
    id: 2,
    texto: "Espontaneamente emite 5 sons diferentes em uma média total de 10 sons.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança espontaneamente emitir 5 sons diferentes em uma média total de 10 sons por hora." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança espontaneamente emitir 3 ou 4 sons diferentes em uma média total de 10 sons por hora." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
    {
    id: 3,
    texto: "Espontaneamente emite 10 sons diferentes e com entonações variadas, em uma média total de 25 sons por hora.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança espontaneamente emitir 10 sons diferentes e com entonações variadas, em uma média total de 25 sons por hora." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança espontaneamente emitir 5 a 9 sons diferentes e com entonações variadas, em uma média total de 25 sons por hora." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
    {
    id: 4,
    texto: "Espontaneamente emite 5 aproximações de palavras inteiras diferentes.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança espontaneamente emitir 5 aproximações de palavras durante 1h de observação." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança espontaneamente emitir de 2 a 4 aproximações de palavras durante 1h de observação." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
  
  {
    id: 5,
    texto: "Espontaneamente vocaliza 15 palavras inteiras ou frases com entonação e ritmo apropriados.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança espontaneamente emitir 15 diferentes aproximações inteligíveis de palavras durante 1h de observação." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança espontaneamente emitir de 8 a 14 diferentes aproximações inteligíveis de palavras durante 1h de observação." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção." }
    ]
  }
];

// 🟢 Avaliação Mando Nivel 2 (exemplo com estrutura igual)
const perguntasMandoNivel2 = [
  {
    id: 1,
    texto: "Pede 20 itens ausentes diferentes que sejam partes de objetos ou atividades de seu interesse sem dicas (exceto 'O que você quer?', que pode ser usado) (Ex: pede papel quando lhe dão lápis de cor).",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança pedir por 20 itens ausentes diferentes sem dicas." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança pedir por 10 a 19 itens ausentes diferentes sem dicas." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção." }
    ]
  },
  {
    id: 2,
    texto: "Pede para outras pessoas emitirem 5 diferentes ações ou ações que faltam para a criança executar uma atividade desejada (Ex: pedir para o outro abrir a porta para a criança sair; pedir para o outro empurrar o balanço).",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança pedir para outras pessoas emitirem 5 diferentes ações sem dicas." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança pedir para outras pessoas emitirem de 2 a 4 diferentes ações sem dicas." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
    {
    id: 3,
    texto: "Emite 5 diferentes mandos contendo 2 ou mais palavras (não incluir 'Eu quero'). (Ex: 'Mais rápido'; 'Minha vez'; 'Mais suco'). (Ex: 'Mais rápido'; 'Minha vez'; 'Mais suco').",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança emitir 5 diferentes mandos contendo 2 ou mais palavras durante 1 hora de observação." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança emitir de 2 a 4 diferentes mandos contendo 2 ou mais palavras durante 1 hora de observação." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
    {
    id: 4,
    texto: "Espontaneamente emite 15 mandos diferentes (Ex: 'Vamos brincar';'Abre'; 'Eu quero o livro').",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança espontaneamente emitir 15 diferentes mandos durante 30 minutos de observação." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança espontaneamente pedir de 8 a 14 vezes durante 30 minutos de observação." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
  {
    id: 5,
    texto: "Emite 10 novos mandos sem treino específico (Ex: diz espontaneamente 'Aonde o gatinho vai?', sem treino formal para mando).",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança aprender 10 novos mandos sem treino formal. Registre cada novo mando em uma folha de registro diário." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança aprender de 5 a 9 novos mandos sem treino formal." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção." }
    ]
  }
];
// 🟢 Avaliação Tato Nivel 2(exemplo com estrutura igual)
const perguntasTatoNivel2 = [
  {
    id: 1,
    texto: "Nomeia (tato) 25 itens quando perguntada 'O que é isso?' (Ex: livro, sapato, carro, cachorro, chapéu).",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança nomear 25 itens quando testado." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança nomear de 20 a 24 itens quando testado." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção." }
    ]
  },
  {
    id: 2,
    texto: "Generaliza tatos para 3 exemplos de 50 itens, testados diretamente ou de uma lista de generalizações conhecidas(Ex: nomeia três diferentes carros como 'carro').",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se os tatos da criança generalizarem para 3 exemplos de 50 itens quando testado." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se os tatos da criança generalizarem para 2 exemplos de 50 itens quando testado." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
    {
    id: 3,
    texto: "Nomeia (tato) 10 ações quando perguntada, por exemplo, 'O que estou fazendo?' (Ex: pulando; dormindo; comendo).",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança nomear 10 ações quando testado." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança nomear de 5 a 9 ações quando testado." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
    {
    id: 4,
    texto: "Nomeia (tato) 50 combinações de dois componentes como verbo-substantivo ou substantivo-verbo, testadas diretamente ou de uma lista de tatos compostos conhecidos (Ex: lavando o rosto; João nadando; bebê dormindo).",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança nomear 50 combinações de verbo-substantivo ou substantivo-verbo quando t" },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança nomear de 25 a 49 combinações de verbo-substantivo ou substantivo-verbo quando testado." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
  
  {
    id: 5,
    texto: "Nomeia (tato) um total de 200 substantivos e/ou verbos (ou outros componentes da fala), testados ou de uma lista acumulada de tatos conhecidos.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança nomear 200 itens e/ou ações quando testado." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança nomear de 150 a 199 itens e/ou ações quando testado." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção." }
    ]
  }
];
// 🟢 Avaliação Ouvinte Nivel 2(exemplo com estrutura igual)
const perguntasOuvinteNivel2 = [
  {
    id: 1,
    texto: "Seleciona o item correto de uma matriz desalinhada de 6 estímulos, para 40 objetos ou figuras diferentes do ambiente natural da criança(Ex: 'Encontre o gato'; 'Pegue a bola').",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança identificar 40 itens em matrizes desalinhadas de 6 estímulos quando testado." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança identificar de 25 a 39 itens em matrizes desalinhadas de 6 estímulos quando testado." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção." }
    ]
  },
  {
    id: 2,
    texto: "Generaliza discriminações de ouvinte em uma matriz desalinhada de 8 estímulos, para três diferentes exemplos de 50 itens(Ex: a criança consegue encontrar três exemplos figuras ou objetos de trem).",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança generalizar as discriminações de ouvinte para 3 exemplos de 50 itens." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança generalizar as discriminações de ouvinte para 2 exemplos de 25 itens." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
    {
    id: 3,
    texto: "Realiza 10 ações motoras específicas sob instrução (Ex: 'Mostre bater palmas'; 'Você consegue saltar?').",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança demonstrar 10 ações sob instrução. Aproximações devem ser pontuadas como corretas. " },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança demonstrar de 5 a 9 ações sob instrução." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
    {
    id: 4,
    texto: "Segue 50 instruções compostas por dois componentes como substantivo-verbo e/ou verbo-substantivo(EX: 'Aponta o bebê dormindo'; 'Empurre o balanço').",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança seguir 50 instruções compostas por dois componentes como substantivo-verbo e/ou verbo-substantivo." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança seguir de 25 a 49 instruções compostas por dois componentes como substantivo-verbo e/ou verbo-substantivo." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
  
  {
    id: 5,
    texto: "Seleciona o item correto em um livro, uma cena ilustrada ou no ambiente natural quando nomeado para 250 itens testados ou de uma lista acumulada de palavras conhecidas.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança selecionar 250 itens diferentes em um livro, uma cena ilustrada ou no ambiente natural quando nomeado." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança selecionar de 150 a 249 itens diferentes em um livro, uma cena ilustrada ou no ambiente natural quando perguntado." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção." }
    ]
  }
];
// 🟢 Avaliação PV/MTS Nivel 2(exemplo com estrutura igual)
const perguntasPVMTSNivel2 = [
  {
    id: 1,
    texto: "Emparelha objetos ou figuras idênticos em uma matriz desalinhada de 6 estímulos, para 25 itens.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança emparelhar corretamente 25 objetos ou figuras idênticos em uma matriz desalinhada de 6 estímulos." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança emparelhar corretamente de 15 a 24 objetos ou figuras idênticos em uma matriz desalinhada de 4 estímulos." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção." }
    ]
  },
  {
    id: 2,
    texto: "Separa cores e formas semelhantes para 10 diferentes cores e formas apresentadas como modelo (Ex: em tigelas vermelha, azul e verde a criança separa ursos vermelhos, azuis e verdes por cores).",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança separar cores e formas semelhantes para 10 diferentes cores e formas dadas como modelo, mas sem outras dicas." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança separar cores e formas semelhantes para 5 a 9 diferentes cores e formas dadas como modelo, mas sem outras dicas." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
    {
    id: 3,
    texto: "Emparelha objetos ou figuras idênticos em uma matriz desalinhada de 8 estímulos contendo 3 estímulos similares, para 25 itens(Ex: emparelha um cachorro com outro cachorro em uma matriz que também contém gato, porco e pônei).",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Criança emparelhou corretamente objetos de 8 estímulos contendo 3 estímulos similares, para 25 itens." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Criança emparelhou corretamente objetos 8 estímulos contendo 3 estímulos similares, para 15 itens." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
    {
    id: 4,
    texto: "Emparelha objetos ou figuras não-idênticos em uma matriz desalinhada de 10 estímulos, para 25 itens (Ex: emparelha um caminhão da Ford com um caminhão da Toyota).",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança emparelhar objetos não idênticos em uma matriz desalinhada de 10 estímulos contendo 3 estímulos similares, para 25 itens." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança emparelhar objetos não idênticos em uma matriz desalinhada de 10 estímulos contendo 3 estímulos similares, para 15 itens." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
  {
    id: 5,
    texto: "Emparelha objetos (3D) com as respectivas figuras (2D) não-idênticos, e/ou vice-versa,em uma matriz desalinhada de 10 estímulos contendo 3 estímulos similares, para 25 itens.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: A criança emparelhar objetos (3D) com (2D),em uma matriz desalinhada de 10 estímulos contendo 3 estímulos similares, para 25 itens." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: A criança emparelhar objetos (3D) com (2D),em uma matriz desalinhada de 10 estímulos contendo 3 estímulos similares, para 15 itens." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção." }
    ]
  }
];
// 🟢 Avaliação Brincar Nivel 2(exemplo com estrutura igual)
const perguntasBrincarNivel2 = [
  {
    id: 1,
    texto: "Procura um brinquedo ausente ou correspondente ou parte de um conjunto para 5 itens ou conjuntos (Ex: uma peça de quebra-cabeça; a mamadeira para uma boneca de brinquedo; uma peça de um jogo de encaixe).",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: A criança procura um brinquedo correspondente ou parte de um conjunto para 5 itens." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: A criança procura um brinquedo correspondente ou parte de um conjunto para 2 a 4 itens." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção." }
    ]
  },
  {
    id: 2,
    texto: "Demonstra, de forma independente, a utilização de brinquedos ou objetos de acordo com suas funções para 5 itens(Ex: coloca o trem nos trilhos; puxa uma carroça; coloca o telefone na orelha).",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança demonstrar, de forma independente, a utilização de brinquedos ou objetos de acordo com suas funções para 5 itens." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança demonstrar, de forma independente, a utilização de brinquedos ou objetos de acordo com suas funções para 2 a 4 itens." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
    {
    id: 3,
    texto: "Brinca com itens do dia-a-dia de forma criativa por 2 vezes (Ex: utiliza uma vasilha como bateria ou uma caixa como um carro imaginário).",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança brincar com 2 itens do dia-a-dia diferentes de formas criativas." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança brincar com 1 item do dia-a-dia de forma criativa." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
    {
    id: 4,
    texto: "De forma independente se engaja em brincadeiras em estruturas e equipamentos de um parque infantil durante um total de 5 minutos (EX: 'Aponta o bebê dormindo'; 'Empurre o balanço').",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: A criança se engaja por um total de 5min durante os 30min de observação." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: A criança se engaja por um total de 2 a 4min durante os 30min de observação." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
  {
    id: 5,
    texto: "Monta brinquedos com múltiplas partes com 5 diferentes conjuntos de materiais (Ex: Senhor Cabeça de Batata; Quebra-cabeças; Jogos de encaixe).",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: A criança construir ou montar, com 5 conjuntos diferentes de materiais." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: A criança construir ou montar, com 2 a 4 conjuntos diferentes de materiais." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção." }
    ]
  }
];

// 🟢 Avaliação Social Nivel 2(exemplo com estrutura igual)
const perguntasSocialNivel2 = [
  {
    id: 1,
    texto: "Inicia interação física com um par 2 vezes (Ex: dar as mãos, girar em torno de outra criança, empurrar a criança em um vagão ou carrinho, etc.).",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: A criança iniciar uma interação com um par 2 vezes durante 30min de observação." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: A criança iniciar uma interação com um par 1 vezes durante 30min de observação." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção." }
    ]
  },
  {
    id: 2,
    texto: "Pede espontaneamente para seus pares 5 vezes (Ex: 'Minha vez'; 'Me empurra'; 'Olha!'; 'Vem aqui').",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: A criança pedir espontaneamente com, pelo menos, 2 mandos diferentes, para seus pares 5 vezes durante 1h de obs." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: A criança pedir espontaneamente com, pelo menos, 2 a 4 mandos diferentes, para seus pares 5 vezes durante 1h de obs." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
    {
    id: 3,
    texto: "Engaja-se em uma brincadeira social continuada com pares por 3 minutos sem a ajuda ou reforçamento de um adulto(Ex: cooperativamente montar um jogo, brincadeira com água).",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: A criança engaja-se em uma brincadeira social continuada com pares por 3 minutos sem dicas durante 30min de obs." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: A criança engaja-se em uma brincadeira social continuada com pares por 2 minutos sem dicas durante 30min de obs." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
    {
    id: 4,
    texto: "Responde espontaneamente aos pedidos (mandos) dos pares 5 vezes (Ex: 'Me empurra no balanço'; 'Eu quero o trem').",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: A criança espontaneamente responder a pelo menos 2 mandos diferentes feitos pelos pares 5 vezes durante a obs." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: A criança espontaneamente responder a pelo menos 2 a 4 mandos diferentes feitos pelos pares 5 vezes durante a obs." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
  {
    id: 5,
    texto: "Pede espontaneamente aos pares para participar de jogos, brincadeiras sociais, etc., 2 vezes (Ex: 'Venham aqui vocês'; 'Vamos cavar um buraco').",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: A criança pedir 1 vezes durante 1h de obs." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: A criança pedir 2 vezes durante 1h de obs." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção." }
    ]
  }
];
// 🟢 Avaliação Imitação Nivel 2(exemplo com estrutura igual)
const perguntasImitacaoNivel2 = [
  {
    id: 1,
    texto: "Imita 10 ações que requerem seleção de um objeto específico a partir de um conjunto de objetos(Ex: seleciona uma baqueta de bateria de um conjunto que também contém uma buzina e um sino, e imita o movimento do adulto de bater na bateria com as baquetas).",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: A criança imitar 10 diferentes ações com a seleção de um objeto de um conjunto de 3 objetos quando receber a instrução 'Faça isso'." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: A criança imitar 10 diferentes ações com a seleção de um objeto de um conjunto de 5 a 9 objetos quando receber a instrução 'Faça isso'" },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção." }
    ]
  },
  {
    id: 2,
    texto: "Imita 20 ações motoras finas diferentes quando solicitado, 'Faça isso.' Ex: movimentar os dedos, pinça, fechar a mão em punho, fazer borboleta).",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança imitar 20 ações motoras finas diferentes quando solicitado, 'Faça isso'." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança imitar de 10 a 19 ações motoras finas diferentes quando solicitado, 'Faça isso'." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
    {
    id: 3,
    texto: "Imita 10 sequências diferentes compostas por 3 ações quando solicitado, 'Faça isso.' (Ex: bater palma, pular e tocar os pés; pegar uma boneca, colocá-la no berço e balançar o berço)",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: A criança imitar 10 sequências compostas por 3 ações em contexto artificial ou natural após modelo dado por um par ou um adulto." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: A criança imitar de 5 a 9 sequências compostas por 2 ações em contexto artificial ou natural após modelo dado por um par ou um adulto." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
    {
    id: 4,
    texto: "Imita espontaneamente 5 atividades funcionais no ambiente natural (Ex: come com uma colher; veste um casaco; tira os sapatos).",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: A criança imitar espontaneamente 5 atividades funcionais no ambiente natural." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: A criança imitar espontaneamente de 2 a 4 atividades funcionais no ambiente natural." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
  {
    id: 5,
    texto: "Imita (ou tenta por aproximações) qualquer ação motora nova dada por um adulto como modelo, com e sem objetos (isto é, 'repertório de imitação generalizado').",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: A criança imitar (ou aproximar) muitas ações motoras novas com e sem objetos dadas por um adulto como modelo após a instrução 'Faça isso'" },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Nenhum." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção." }
    ]
  }
];
// 🟢 Avaliação Ecóico Nivel 2(exemplo com estrutura igual)
const perguntasEcoicoNivel2 = [
  {
    id: 1,
    texto: "Pontua pelo menos 50 no subteste EESA (pelo menos 20 pontos do Grupo 2).",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: A criança pontuar 50 no subteste EESA (20 pontos do Grupo 2)." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: A criança pontuar de 40 a 49 no subteste EESA (15 a 19 pontos do Grupo 2)." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção." }
    ]
  },
  {
    id: 2,
    texto: "Pontua pelo menos 60 no subteste EESA.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: A criança pontuar 60 no subteste EESA." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: A criança pontuar de 55 a 59 no subteste EESA. (15 a 19 pontos do Grupo 2)." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
    {
    id: 3,
    texto: "Pontua pelo menos 70 no subteste EESA.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: A criança pontuar 70 no subteste EESA." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: A criança pontuar de 65 a 69 no subteste EESA. (15 a 19 pontos do Grupo 2)." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
    {
    id: 4,
    texto: "Pontua pelo menos 80 no subteste EESA.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: A criança pontuar 80 no subteste EESA." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: A criança pontuar de 75 a 79 no subteste EESA. (15 a 19 pontos do Grupo 2)." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
  {
    id: 5,
    texto: "Pontua pelo menos 90 no subteste EESA (pelo menos 10 pontos dos Grupos 4 e 5).",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: A criança pontuar 90 no subteste EESA (pelo menos 10 pontos dos Grupos 4 e 5)." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: A criança pontuar de 85 a 89 no subteste EESA (pelo menos 10 pontos dos Grupos 4 e 5)." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção." }
    ]
  }
];
// 🟢 Avaliação ROFCC Nivel 2(exemplo com estrutura igual)
const perguntasROFCCNivel2 = [
  {
    id: 1,
    texto: "Seleciona 5 diferentes comidas ou bebidas quando cada uma delas é apresentada em um conjunto de 5 itens(juntamente com 4 itens não comestíveis ou não bebíveis) após as questões verbais 'Você come...' e 'Você bebe...'. Um sino, e imita o movimento do adulto de bater na bateria com as baquetas).",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança selecionou corretamente 5 itens." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança selecionou corretamente de 2 a 4 itens." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção." }
    ]
  },
  {
    id: 2,
    texto: "Seleciona o item correto de um conjunto de 8 itens, para 25 diferentes sentenças (completar lacunas) de qualquer tipo dentro do repertório de ouvinte por característica, classe e função (Ex: 'Você senta em uma ...').",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança selecionou corretamente o item de um conjunto de 8 itens, para 25 diferentes sentenças." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança selecionou corretamente o item de um conjunto de 12 a 24 itens, para 25 diferentes sentenças." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
    {
    id: 3,
    texto: "Seleciona o item correto de um conjunto de 10 itens (ou de um livro), para 25 diferentes perguntas do tipo 'O que?', 'Qual?' ou 'Quem?' acerca de verbos/substantivos do repertório de ouvinte por característica, classe e função.(Ex: 'O que você dirige?'; 'Quem late?'; 'Quem consegue saltar?').",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança selecionou corretamente o item de um conjunto de 10 itens ou de um livro para 25 diferentes perguntas." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança selecionar corretamente de 12 a 24 itens nestas tarefas de repertório de ouvinte por característica, classe e função." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
    {
    id: 4,
    texto: "Seleciona um item dadas 3 diferentes sentenças verbais sobre cada item quando apresentadas separadamente(Ex: 'Encontre um animal.' - Cachorro; 'Qual deles late?' - Cachorro; 'Qual deles tem patas?'- Cachorro) para 25 itens.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Criança selecionou o item correto de um conjunto de 10 itens, para 3 diferentes sentenças verbais do repertório de ouvinte para 25 itens." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Criança selecionou o item correto de um conjunto de 10 itens, para 3 diferentes sentenças verbais do repertório de ouvinte para 12 a 24 itens." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
  {
    id: 5,
    texto: "Nomeia (tato) espontaneamente o item em 50% das tentativas de repertório de ouvinte por característica, classe e função (Ex: diz 'Cachorro' diante da instrução verbal 'Encontre um animal', e de um conjunto de estímulos visuais contendo a figura de um cachorro).",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Criança nomear (tato) espontaneamente o item-alvo em 50% das tentativas de repertório de ouvinte por característica, classe e função." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Criança nomear (tato) espontaneamente o item-alvo em 25% a 49% das tentativas de repertório de ouvinte por característica, classe e função." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção." }
    ]
  }
];
// 🟢 Avaliação Intraverbal Nivel 2(exemplo com estrutura igual)
const perguntasIntraverbalNivel2 = [
  {
    id: 1,
    texto: "Completa 10 diferentes sentenças de qualquer natureza (Ex: completa trechos de músicas, brincadeiras sociais, completa lacunas divertidas e sons de animais e/ou objetos).",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança completar de 10 frases." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança completar de 5 a 9 frases." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção." }
    ]
  },
  {
    id: 2,
    texto: "Diz seu nome quando perguntada 'Qual é o seu nome?'",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança é capaz de dizer seu nome quando perguntada sem dica ecóica." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Nenhum." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
    {
    id: 3,
    texto: "Completa 25 diferentes sentenças (não incluindo músicas) (Ex: 'Você come...'; 'Você dorme na...'; 'Sapatos e...').",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança completar 25 frases." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança completar de 12 a 24 frases." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
    {
    id: 4,
    texto: "Responde a 25 diferentes perguntas com 'O que?' (Ex: 'O que você gosta de comer?').",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se criança responder 25 diferentes perguntas com 'O que?'." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se criança responder de 12 a 24 diferentes perguntas com 'O que?'." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
  {
    id: 5,
    texto: "Responde a 25 diferentes perguntas com 'Quem?' ou 'Onde?' (Ex: 'Quem são seus amigos?'; 'Onde está seu travesseiro?').",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança responder a 25 diferentes perguntas." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança responder de 12 a 24 diferentes perguntas." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção." }
    ]
  }
];
// 🟢 Avaliação Grupo Nivel 2(exemplo com estrutura igual)
const perguntasGrupoNivel2 = [
  {
    id: 1,
    texto: "Senta-se para o momento do lanche com o grupo ou na mesa do almoço sem emitir comportamentos socialmente inadequados por 3 minutos.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Com dicas sem emitir comportamentos socialmente inadequados por 3 minutos." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Com dicas sem emitir comportamentos socialmente inadequados por 1 minutos." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção." }
    ]
  },
  {
    id: 2,
    texto: "Guarda e organiza seus itens pessoais e se dirige até uma mesa com apenas 1 instrução verbal.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Criança organizada e apenas 1 instrução verbal." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Criança organizada e 2 ou mais instrução verbal." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
    {
    id: 3,
    texto: "Faz transições entre as atividades dentro de sala de aula com somente 1 instrução gestual ou verbal.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Criança faz transição em pelo menos 80% do tempo,com 1 dica (exceto dicas físicas)." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Criança faz transição, com 2 ou mais dica (exceto dicas físicas)." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
    {
    id: 4,
    texto: "Senta-se com um grupo pequeno por 5 minutos sem emitir comportamentos disruptivos e sem tentar sair do grupo.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Criança passou 5 minutos sem emitir comportamentos disruptivos e sem tentar sair do grupo." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Criança passou 2 a 4 minutos sem emitir comportamentos disruptivos e sem tentar sair do grupo." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
  {
    id: 5,
    texto: "Senta-se com um grupo pequeno por 10 minutos, atenta-se para o professor ou material em 50% do período, e responde a 5 estímulos discriminativos (SDs) dados pelo professor. E responde a 5 estímulos discriminativos (SDs) dados pelo professor.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Atividade coletiva com 3 ou mais crianças por 10 min e se atentar para o material apresentado em 50%, e responder a 5 questões." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Atividade coletiva com 3 ou mais crianças por 10 min e se atentar para o material apresentado em 33% a 49%, e responder a 2 a 4 questões." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção." }
    ]
  }
];
// 🟢 Avaliação Linguística Nivel 2(exemplo com estrutura igual)
const perguntasLinguisticaNivel2 = [
  {
    id: 1,
    texto: "A articulação de 10 tatos emitidos pela criança pode ser entendida por adultos familiares que não podem ver o item nomeado.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se adultos familiares que não podem ver o item nomeado conseguirem entender a articulação da criança em 10 tatos." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se adultos familiares que não podem ver o item nomeado conseguirem entender a articulação da criança em 5 a 9 tatos." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção." }
    ]
  },
  {
    id: 2,
    texto: "Apresenta vocabulário receptivo (compreender como ouvinte) com um total de 100 palavras (Ex: 'Toque no nariz'; 'Pule'; 'Encontre as chaves').",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: 100 palavras demonstrado por meio da seleção de um item em um conjunto de 5 itens, ou desempenhando uma ação específica." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: 50 a 99 palavras demonstrado por meio da seleção de um item em um conjunto de 5 itens, ou desempenhando uma ação específica." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
    {
    id: 3,
    texto: "Emite 10 diferentes declarações com 2 palavras por dia de qualquer natureza, exceto ecóica (Ex: mandos, tatos).",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança emitir 10 diferentes declarações com 2 palavras por dia de qualquer natureza, exceto ecóica." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança emitir de 5 a 9 diferentes declarações com 2 palavras por dia de qualquer natureza, exceto ecóica." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
    {
    id: 4,
    texto: "Emite prosódia funcional (isto é, ritmo, ênfase, entonação) em 5 situações em um dia (Ex: dá ênfase ou acentua certas palavras como 'Isso é MEU!').",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança emitir prosódia funcional (isto é, ritmo, ênfase, entonação) em 5 situações em um dia." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança emitir prosódia funcional (isto é, ritmo, ênfase, entonação) em 2 a 4 situações em um dia." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
  {
    id: 5,
    texto: "Apresenta vocabulário expressivo (falante) com um total de 300 palavras (todos os operantes verbais com exceção do ecóico).",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança apresentar vocabulário expressivo (falante) com um total de 300 palavras." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança apresentar vocabulário expressivo (falante) com um total de 200 a 299 palavras." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção." }
    ]
  }
];

// 🟢 Avaliação Mando Nivel 3(exemplo com estrutura igual)
const perguntasMandoNivel3 = [
  {
    id: 1,
    texto: "Espontaneamente pede diferentes informações verbais usando questões do tipo 'O que?'; 'Quem?'; 'Onde?' ou outros tipos de questões 5 vezes.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança pediu 2 vez como acima e outros tipos de 2 a 4 vezes." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança pediu 1 vez como acima e outros tipos de 2 a 4 vezes." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção." }
    ]
  },
  {
    id: 2,
    texto: "Educadamente pede para parar uma atividade indesejada, ou para remover qualquer estímulo aversivo em 5 diferentes circunstâncias.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança fez como acima estímulo aversivo em 5 diferentes circunstâncias." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança fez como acima estímulo aversivo de 2 a 4 diferentes circunstâncias." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
    {
    id: 3,
    texto: "Pede com 10 diferentes adjetivos, preposições ou advérbios.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança fez como acima havendo pelo menos 2 verbalizações de cada grupo." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança pedir com 5 a 9 diferentes adjetivos, preposições ou advérbios." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
    {
    id: 4,
    texto: "Dá direções, instruções ou explicações sobre como fazer alguma coisa ou como participar de uma atividade 5 vezes.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança fez como acima 5 vezes tal como medido por uma folha de registro diário." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança fez como acima de 2 a 4 vezes tal como medido por uma folha de registro diário." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
  {
    id: 5,
    texto: "Pede que outras pessoas atendam ao seu próprio comportamento intraverbal 5 vezes.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança fez como acima 5 vezes durante qualquer número de observações." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança fez como acima 5 vezes durante os períodos de observação." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção." }
    ]
  }
];
// 🟢 Avaliação Tato Nivel 3(exemplo com estrutura igual)
const perguntasTatoNivel3 = [
  {
    id: 1,
    texto: "Nomeia cor, forma e função de 5 objetos (15 tentativas) quando cada objeto e questão é apresentado de forma misturada.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança nomear a cor, forma e função de 5 objetos diferentes (15 tentativas)." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança nomear 2 características ou funções de 5 objetos diferentes (10 tentativas)." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção." }
    ]
  },
  {
    id: 2,
    texto: "Nomeia 4 diferentes preposições e 4 pronomes.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança nomear 4 diferentes preposições e 4 diferentes pronomes quando testado." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança nomear um total de 4 preposições ou pronomes." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
    {
    id: 3,
    texto: "Nomeia 4 diferentes adjetivos, excluindo cores e formas e 4 advérbios.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança nomear 4 diferentes adjetivos e 4 diferentes advérbios quando testado." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança nomear um total de 4 adjetivos ou advérbios." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
    {
    id: 4,
    texto: "Emite tatos com sentenças completas contendo 4 ou mais palavras, 20 vezes.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança emitir tatos com sentenças completas contendo 4 ou mais palavras, 20 vezes." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança emitir tatos com sentenças completas contendo 3 palavras, 20 vezes." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
  {
    id: 5,
    texto: "Tem um vocabulário de tato de 1.000 palavras, testado ou de uma lista acumulada de tatos conhecidos.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança nomear 1.000 estímulos não verbais." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança nomear de 750 a 999 estímulos não verbais." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção." }
    ]
  }
];
// 🟢 Avaliação Ouvinte Nivel 3(exemplo com estrutura igual)
const perguntasOuvinteNivel3 = [
  {
    id: 1,
    texto: "Seleciona itens por cor e forma de um conjunto de 6 estímulos similares, para 4 cores e 4 formas.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto:  6 estímulos similares, para 4 cores e 4 formas quando testado." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: 6 estímulos similares, para 2 ou 3 cores e 2 ou 3 formas quando testado." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção." }
    ]
  },
  {
    id: 2,
    texto: "Segue 2 instruções envolvendo 6 diferentes preposições e 4 diferentes pronomes.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança seguir 2 instruções para cada uma das 6 diferentes preposições e 4 diferentes pronomes." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança seguir 2 instruções para cada uma das 3 a 5 diferentes preposições e 2 ou 3 diferentes pronomes." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
    {
    id: 3,
    texto: "Seleciona itens de um conjunto de estímulos similares baseado em 4 pares de adjetivos relativos e demonstra ações baseadas em 4 pares de advérbios relativos.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Criança seleciona itens de um conjunto de  4 pares de adjetivos relativos e 4 pares de advérbios relativos." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Criança seleciona itens de um conjunto de 2 ou 3 pares de adjetivos relativos e 2 ou 3 pares de advérbios relativos." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
    {
    id: 4,
    texto: "Segue instruções com 3 passos para 10 diferentes instruções.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança seguir 10 instruções com 3 passos." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança seguir de 5 a 9 instruções com 3 passos." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
  {
    id: 5,
    texto: "Tem um repertório de ouvinte (receptivo) total com 1.200 palavras.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança identificar 1.200 estímulos não verbais." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança identificar de 800 a 1.199 estímulos não verbais." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção." }
    ]
  }
];
// 🟢 Avaliação PV/MTS Nivel 3(exemplo com estrutura igual)
const perguntasPVMTSNivel3 = [
  {
    id: 1,
    texto: "Espontaneamente imita qualquer parte de uma atividade grafomotora frente ao modelo de outra pessoa 2 vezes.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança espontaneamente imitar 2 vezes." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança espontaneamente imitar 1 vezes." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção." }
    ]
  },
  {
    id: 2,
    texto: "Demonstra emparelhamento arbitrário generalizado em um conjunto bagunçado de 10 itens com 3 estímulos similares para 25 itens.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança demonstrar emparelhamento de 10 itens com 3 estímulos similares, para 25 itens." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança demonstrar emparelhamento de 10 itens com 3 estímulos similares, para 15 a 24 itens." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
    {
    id: 3,
    texto: "Completa 20 diferentes projetos com blocos, peças de madeira, quebra-cabeças de formas, ou tarefas similares com pelo menos 8 peças diferentes.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança completar 20 diferentes projetos com pelo menos 8 peças diferentes." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança completar 20 diferentes projetos com pelo menos 4 a 7 peças diferentes." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
    {
    id: 4,
    texto: "Classifica 5 itens em 5 diferentes categorias sem um modelo",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança classificar pelo menos 5 itens em 5 diferentes categorias sem um modelo." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança classificar pelo menos 3 ou 4 itens em 3 ou 4 diferentes categorias sem um modelo." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
  {
    id: 5,
    texto: "Continua 20 padrões, sequências ou tarefas de seriação com 3 passos",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança continuar 20 padrões, sequências ou tarefas de seriação com 3 passos." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança continuar 20 padrões, sequências ou tarefas de seriação com 2 passos." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção." }
    ]
  }
];
// 🟢 Avaliação Brincar Nivel 3(exemplo com estrutura igual)
const perguntasBrincarNivel3 = [
  {
    id: 1,
    texto: "Espontaneamente se engaja em brincadeiras de imaginação ou faz de conta em 5 ocasiões.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança espontaneamente se engajar em 5 ocasiões." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança espontaneamente se engajar em 2 a 4 ocasiões." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção." }
    ]
  },
  {
    id: 2,
    texto: "Repete um comportamento motor amplo de uma brincadeira para obter um efeito melhor em 2 atividades.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança repetir um comportamento em 2 diferentes atividades." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança repetir um comportamento em 1 diferentes atividades." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
    {
    id: 3,
    texto: "Engaja-se de forma independente em atividades grafomotoras por 5 minutos.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança engajar-se em atividades grafomotoras por 5 minutos." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança engajar-se em atividades grafomotoras por 2 a 4 minutos." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
    {
    id: 4,
    texto: "Engaja-se de forma independente em atividades de brincar continuadas por 10 minutos sem dicas do adulto ou reforçamento.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança engajar-se de brincar continuadas por 10 minutos sem dicas do adulto ou reforçamento." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança engajar-se de brincar continuadas por 5 a 9 minutos sem dicas do adulto ou reforçamento." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
  {
    id: 5,
    texto: "Desenha ou escreve de forma independente em livros de atividades pré-acadêmicas por 5 minutos.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança desenhar ou escrever de forma independente em livros de atividades por 5 minutos." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança desenhar ou escrever de forma independente em livros de atividades por 2 a 4 minutos." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção." }
    ]
  }
];
// 🟢 Avaliação Social Nivel 3(exemplo com estrutura igual)
const perguntasSocialNivel3 = [
  {
    id: 1,
    texto: "Espontaneamente coopera com um par para obter um resultado específico 5 vezes.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança espontaneamente cooperar com um par para obter um resultado específico 5 vezes." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança espontaneamente cooperar com um par para obter um resultado específico de 2 a 4 vezes." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção." }
    ]
  },
  {
    id: 2,
    texto: "Espontaneamente pede para pares usando questões do tipo 'O que?', 'Quem?', 'Onde?' 5 vezes",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança emitir 5 mandos espontâneos diferentes em um período de 1 hora." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança emitir de 2 a 4 mandos espontâneos diferentes em um período de 1 hora." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
    {
    id: 3,
    texto: "Responde intraverbalmente a 5 diferentes questões ou sentenças feitas por pares acerca de verbos/substantivos do repertório de ouvinte por característica, classe e função. (Ex: 'O que você dirige?'; 'Quem late?'; 'Quem consegue saltar?').",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança responder intraverbalmente a 5 diferentes questões ou sentenças feitas por pares." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança responder intraverbalmente de 2 a 4 diferentes questões ou sentenças feitas por pares." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
    {
    id: 4,
    texto: "Engaja-se em atividades de brincar social ou de faz de conta com pares por 5 minutos sem dicas do adulto (Ex: 'Encontre um animal.' - Cachorro; 'Qual deles late?' - Cachorro; 'Qual deles tem patas?'- Cachorro) para 25 itens.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança engajar-se em atividades de brincar social ou de faz de conta com pares por 5 minutos." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança engajar-se em atividades de brincar social ou de faz de conta com pares por 2 a 4 minutos." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
  {
    id: 5,
    texto: "Engaja-se em trocas verbais sobre um mesmo assunto com pares para 5 assuntos diferentes.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança iniciar e mantiver uma interação verbal recíproca que dure por 4 trocas durante um período de observação." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança iniciar e mantiver uma interação verbal recíproca que dure por 2 ou 3 trocas durante um período de observação." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção." }
    ]
  }
];
// 🟢 Avaliação Leitura Nivel 3(exemplo com estrutura igual)
const perguntasLeituraNivel3 = [
  {
    id: 1,
    texto: "Atenta-se para um livro quando uma história está sendo lida para ela por 75% do tempo.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança atentar-se para um livro quando uma história está sendo lida para ela por 75% do tempo em um período de 3 minutos." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança atentar-se para um livro quando uma história está sendo lida para ela por 50% a 74% do tempo em um período de 3 minutos." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção." }
    ]
  },
  {
    id: 2,
    texto: "Seleciona a letra bastão correta de um conjunto de 5 letras, para 10 letras diferentes.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança selecionar a letra bastão correta de um conjunto de 5 letras, para 10 letras diferentes." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança selecionar a letra bastão correta de um conjunto de 5 letras, para 5 a 9 letras diferentes." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
    {
    id: 3,
    texto: "Nomeia (tato) 10 letras bastão sob comando.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança nomear (tato) 10 letras bastão." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança nomear (tato) de 5 a 9 letras bastão." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
    {
    id: 4,
    texto: "Lê seu próprio nome.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança ler seu próprio nome quando este é mostrado e é dada a dica verbal." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Nenhuma." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
  {
    id: 5,
    texto: "Emparelha 5 palavras às figuras ou itens correspondentes em um conjunto de 5 estímulos, e vice-versa.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança emparelhar 5 palavras." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança emparelhar 3 ou 4 palavras." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção." }
    ]
  }
];
// 🟢 Avaliação Escrita Nivel 3(exemplo com estrutura igual)
const perguntasEscritaNivel3 = [
  {
    id: 1,
    texto: "Imita 5 diferentes ações de escrita após modelo dado por um adulto usando instrumento e superfície para escrita.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança imitar 5 diferentes ações de escrita após modelo dado por um adulto." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança imitar 3 ou 4 diferentes ações de escrita após modelo dado por um adulto." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção." }
    ]
  },
  {
    id: 2,
    texto: "Traça 5 diferentes formas geométricas dentro de ¼ de polegadas de linhas de forma independente.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança traçar 5 diferentes formas geométricas dentro de ¼ de polegadas de linhas de forma independente." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança traçar 5 diferentes formas geométricas dentro de ½ de polegadas de linhas de forma independente." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
    {
    id: 3,
    texto: "Copia 10 letras ou números de forma legível.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança copiar 10 letras ou números em qualquer tamanho de forma legível." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança copiar de 5 a 9 letras ou números em qualquer tamanho de forma legível." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
    {
    id: 4,
    texto: "Soletra e escreve de forma legível seu próprio nome sem copiar.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança soletrar corretamente e escrever de forma legível e independente seu próprio nome." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança se aproximar das letras de seu nome, mas elas não ficarem claras o suficiente para ler, e/ou ela soletrar seu nome faltando letras." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
  {
    id: 5,
    texto: "Copia todas as 26 letras do alfabeto em maiúsculas e minúsculas de forma legível.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança copiar todas as 26 letras do alfabeto em maiúsculas e minúsculas de forma legível e independente." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança se aproximar das letras, mas elas não ficarem claras o suficiente para ler." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção." }
    ]
  }
];
// 🟢 Avaliação ROFCC Nivel 3(exemplo com estrutura igual)
const perguntasROFCCNivel3 = [
  {
    id: 1,
    texto: "Seleciona o item correto de um conjunto de 10 itens que contém 3 estímulos similares.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança selecionar corretamente o item de um conjunto de 10 itens que contém 3 ou mais estímulos similares, em 25 diferentes tarefas." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança selecionar corretamente de 15 a 24 itens neste tipo de tarefa." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção." }
    ]
  },
  {
    id: 2,
    texto: "Seleciona itens de um livro baseado em 2 componentes verbais: uma característica, função ou classe em 25 tarefas de discriminação por função, classe ou característica",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança selecionar corretamente 25 itens neste tipo de tarefa." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança selecionar corretamente de 15 a 24 itens neste tipo de tarefa." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
    {
    id: 3,
    texto: "Seleciona itens de uma página de um livro ou do ambiente natural baseado em 3 componentes verbais, para 25 perguntas com 'Onde?','Quem?', 'O que?' e 'Qual'.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança selecionar corretamente 25 itens neste tipo de tarefa." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança selecionar corretamente de 15 a 24 itens neste tipo de tarefa." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
    {
    id: 4,
    texto: "Seleciona itens de um livro ou do ambiente natural dadas 4 diferentes perguntas de discriminação por função, classe ou característica sobre um mesmo assunto para 25 diferentes assuntos.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança selecionar corretamente 4 itens para 25 diferentes assuntos apresentados neste tipo de tarefa." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança selecionar corretamente 4 itens para 15 a 24 diferentes assuntos apresentados neste tipo de tarefa." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
  {
    id: 5,
    texto: "Demonstra 1.000 diferentes respostas de discriminação por função, classe ou característica, testadas ou obtidas em uma lista acumulada de respostas conhecidas.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança demonstrar corretamente 1.000 diferentes respostas de discriminação." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança demonstrar corretamente de 750 a 999 diferentes respostas de discriminação." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção." }
    ]
  }
];
// 🟢 Avaliação Intraverbal Nivel 3(exemplo com estrutura igual)
const perguntasIntraverbalNivel3 = [
  {
    id: 1,
    texto: "Espontaneamente emite 20 comentários intraverbais.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança espontaneamente emitir 20 respostas intraverbais no ambiente durante um único dia." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança espontaneamente emitir de 10 a 19 comentários intraverbais em 1 dia." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção." }
    ]
  },
  {
    id: 2,
    texto: "Demonstra 300 respostas intraverbais diferentes, testadas ou obtidas em uma lista acumulada de intraverbais conhecidos.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança demonstrar pelo menos 300 respostas intraverbais diferentes quando perguntada." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança demonstrar pelo menos 200 a 299 respostas intraverbais diferentes quando perguntada." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
    {
    id: 3,
    texto: "Responde a 2 questões depois de alguém ter lido passagens curtas de livros, para 25 passagens",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança responder 2 questões para cada uma das 25 passagens (com 15 palavras ou mais)." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança responder 1 questão para cada 25 passagens curtas com pelo menos 10 palavras." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
    {
    id: 4,
    texto: "Descreve 25 diferentes eventos, vídeos, histórias, etc., com 8 palavras ou mais.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança descrever 25 diferentes eventos, vídeos, histórias, etc., com pelo menos 8 palavras." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança descrever pelo menos 12 a 24 diferentes eventos, vídeos, histórias, etc., com pelo menos 5 a 7 palavras." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
  {
    id: 5,
    texto: "Responde a 4 diferentes perguntas com 'Onde?', 'Quem?', 'O que?' e 'Qual' sobre um mesmo assunto, para 10 assuntos",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança responder a 4 diferentes perguntas sobre um mesmo assunto, para 10 assuntos." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança responder a 3 diferentes perguntas sobre um mesmo assunto, para 5 a 9 assuntos." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção." }
    ]
  }
];
// 🟢 Avaliação Grupo Nivel 3(exemplo com estrutura igual)
const perguntasGrupoNivel3 = [
  {
    id: 1,
    texto: "Usa o banheiro e lava as mãos apenas com dicas verbais.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança usar o banheiro e lavar as mãos com dicas verbais." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança usar o banheiro e lavar as mãos, mas precisar de assistência física." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção." }
    ]
  },
  {
    id: 2,
    texto: "Responde a 5 diferentes instruções coletivas ou questões sem dicas diretas em um grupo de 3 ou mais crianças.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança responder a 5 diferentes instruções em um grupo de 3 ou mais crianças." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança responder de 2 a 4 diferentes instruções em um grupo de 3 ou mais crianças." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
    {
    id: 3,
    texto: "Trabalha de forma independente por 5 minutos em um grupo, e fica na tarefa por 50% do período.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança trabalhar de forma independente por 5 minutos." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança trabalhar de forma independente por 2 a 4 minutos." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
    {
    id: 4,
    texto: "Adquire 2 novos comportamentos durante um formato de ensino coletivo com 15 minutos de duração envolvendo 5 ou mais crianças.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança adquirir 2 novos comportamentos." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança adquirir 1 novo comportamento." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
  {
    id: 5,
    texto: "Senta-se em uma sessão de grupo envolvendo 5 crianças e com duração de 20 minutos sem comportamentos disruptivos, e responde a 5 questões intraverbais.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança sentar-se de forma apropriada, e responder a 5 questões intraverbais." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança sentar-se de forma apropriada, e responder de 2 a 4 questões." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção." }
    ]
  }
];
// 🟢 Avaliação Linguística Nivel 3(exemplo com estrutura igual)
const perguntasLinguisticaNivel3 = [
  {
    id: 1,
    texto: "Emite flexões de substantivos combinando 10 substantivos originais com sufixos para plurais e 10 substantivos originais com sufixos para posse.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança fez como acima." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança NÃO fez 10 combinações de substantivos originais com sufixos para posse." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção." }
    ]
  },
  {
    id: 2,
    texto: "Emite flexões de verbos combinando 10 verbos no infinitivo com sufixos para passado simples e 10 verbos no infinitivo com sufixos ou afixos para futuro simples.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança fez como acima." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança NÃO fez 10 verbos no futuro simples, ou vice-versa." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
    {
    id: 3,
    texto: "Emite 10 diferentes frases nominais contendo pelo menos 3 palavras, com 2 modificadores.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança emitir 10 frases diferentes." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança emitir de 5 a 9 frases nominais diferentes." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
    {
    id: 4,
    texto: "Emite 10 diferentes frases de ação contendo pelo menos 3 palavras, com 2 modificadores.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança emitir 10 frases de ação diferentes." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança emitir de 5 a 9 frases de ação diferentes." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
  {
    id: 5,
    texto: "Combina frases nominais e de ação para produzir 10 diferentes orações ou sentenças sintaticamente corretas contendo pelo menos 5 palavras.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança combinar 10 diferentes orações ou sentenças sintaticamente." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança combinar de 5 a 9 diferentes orações ou sentenças sintaticamente." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção." }
    ]
  }
];
// 🟢 Avaliação Matemática Nivel 3(exemplo com estrutura igual)
const perguntasMatematicaNivel3 = [
  {
    id: 1,
    texto: "Identifica como ouvinte os numerais de 1 a 5 em um conjunto com 5 números diferentes.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança discriminar como ouvinte entre os numerais de 1 a 5 em um conjunto com 5 números diferentes." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança discriminar como ouvinte entre os numerais de 1 a 3 ou 4 em um conjunto com 3 ou 4 números diferentes." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção." }
    ]
  },
  {
    id: 2,
    texto: "Nomeia (tato) os numerais de 1 a 5.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança nomear (tato) os numerais de 1 a 5 quando estes são apresentados fora de ordem, um por vez." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança nomear (tato) quaisquer 3 ou 4 números." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
    {
    id: 3,
    texto: "Conta de 1 a 5 itens de um conjunto maior de itens com correspondência 1 para 1.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança contar de 1 a 5 itens de um conjunto maior de itens." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança contar de 1 a 3 ou 4 itens de um conjunto maior de itens." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
    {
    id: 4,
    texto: "Identifica como ouvinte 8 diferentes comparações envolvendo medidas.",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto:. Se a criança identificar como ouvinte 8 diferentes comparações envolvendo medidas." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança identificar como ouvinte 6 ou 7 diferentes comparações envolvendo medidas." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção" }
    ]
  },
  {
    id: 5,
    texto: "Emparelha corretamente numerais com quantidades e quantidades com numerais, para os números de 1 a 5",
    respostas: [
      { valor: 1, descricao: "🔵 1 ponto: Se a criança emparelhar de 1 a 5 apresentados em ordem randômica." },
      { valor: 0.5, descricao: "🟠 0,5 ponto: Se a criança emparelhar de 1 a 3 ou 4 apresentados em ordem randômica." },
      { valor: 0, descricao: "🔴 0 ponto: Nenhuma opção." }
    ]
  }
];



// 🧠 Mapeamento dinâmico
const perguntasPorDominio = {
  Mando: perguntasMandoNivel1,
  Tato: perguntasTatoNivel1,
  Ouvinte: perguntasOuvinteNivel1,
  PVMTS : perguntasPVMTSNivel1,
  Brincar : perguntasBrincarNivel1,
  Social : perguntasSocialNivel1,
  Imitação : perguntasImitacaoNivel1,
  Ecoico : perguntasEcoicoNivel1, 
  Vocal : perguntasVocalNivel1,
  Mando2 : perguntasMandoNivel2,
  Tato2: perguntasTatoNivel2,
  Ouvinte2: perguntasOuvinteNivel2, 
  PVMTS2: perguntasPVMTSNivel2,
  Brincar2: perguntasBrincarNivel2,
  Social2: perguntasSocialNivel2,
  Imitação2: perguntasImitacaoNivel2,
  Ecoico2: perguntasEcoicoNivel2, 
  ROFCC2: perguntasROFCCNivel2,
  Intraverbal2: perguntasIntraverbalNivel2,
  Grupo2: perguntasGrupoNivel2,
  Linguística2: perguntasLinguisticaNivel2,
  Mando3: perguntasMandoNivel3,
  Tato3: perguntasTatoNivel3,
  Ouvinte3: perguntasOuvinteNivel3, 
  PVMTS3: perguntasPVMTSNivel3,
  Brincar3: perguntasBrincarNivel3,
  Social3: perguntasSocialNivel3,
  ROFCC3: perguntasROFCCNivel3,
  Intraverbal3: perguntasIntraverbalNivel3,
  Grupo3: perguntasGrupoNivel3,
  Linguística3: perguntasLinguisticaNivel3,
  Matematica3: perguntasMatematicaNivel3,
  Leitura3: perguntasLeituraNivel3,
  Escrita3: perguntasEscritaNivel3 
};

const TelaAvaliacao = ({ paciente, numeroAtendimento, onGerarPlano, onVoltar }) => {
  const [dominioSelecionado, setDominioSelecionado] = useState("Mando");
  const [perguntas, setPerguntas] = useState(perguntasPorDominio["Mando"]);
  const [respostas, setRespostas] = useState([]);
  const [dataAvaliacao, setDataAvaliacao] = useState("");
  const [mensagemSucesso, setMensagemSucesso] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [avaliador, setAvaliador] = useState("");
  const [idAvaliacao, setIdAvaliacao] = useState("");

  useEffect(() => {
    const dataAtual = new Date().toISOString().split('T')[0];
    setDataAvaliacao(dataAtual);
  }, []);

  useEffect(() => {
    const novasPerguntas = perguntasPorDominio[dominioSelecionado] || [];
    setPerguntas(novasPerguntas);
    setRespostas(novasPerguntas.map(() => ({ valor: "", descricao: "" })));
  }, [dominioSelecionado]);

  const handleResposta = (index, valor) => {
    const respostaSelecionada = perguntas[index].respostas.find(res => res.valor === parseFloat(valor));
    const descricao = respostaSelecionada ? respostaSelecionada.descricao : "";
    const novasRespostas = [...respostas];
    novasRespostas[index] = { valor: parseFloat(valor) || 0, descricao };
    setRespostas(novasRespostas);
  };

  const calcularTotal = () => {
    return respostas.reduce((total, r) => total + (r.valor || 0), 0).toFixed(1);
  };

  const dominioNomeCompleto = 
  dominioSelecionado === "Mando" ? "Mando - Nível 1" :
  dominioSelecionado === "Tato" ? "Tato - Nível 1" :
  dominioSelecionado === "Ouvinte" ? "Ouvinte - Nível 1" :
  dominioSelecionado === "PVMTS" ? "PVMTS - Nível 1" :
  dominioSelecionado === "Brincar" ? "Brincar - Nível 1" :
  dominioSelecionado === "Social" ? "Social - Nível 1" :
  dominioSelecionado === "Imitação" ? "Imitação - Nível 1" :
  dominioSelecionado === "Ecoico" ? "Ecoico - Nível 1" :
  dominioSelecionado === "Vocal" ? "Vocal - Nível 1" :        
  dominioSelecionado === "Mando2" ? "Mando - Nível 2" :    
  dominioSelecionado === "Tato2" ? "Tato - Nível 2" :
  dominioSelecionado === "Ouvinte2" ? "Ouvinte - Nível 2" :
  dominioSelecionado === "PVMTS2" ? "PVMTS - Nível  2" :
  dominioSelecionado === "Brincar2" ? "Brincar - Nível 2" :    
  dominioSelecionado === "Social2" ? "Social - Nível 2" :
  dominioSelecionado === "Imitação2" ? "Imitação - Nível 2" :
  dominioSelecionado === "Ecoico2" ? "Ecoico - Nível 2  " :
  dominioSelecionado === "ROFCC2" ? "ROFCC - Nível 2  " :    
  dominioSelecionado === "Intraverbal2" ? "Intraverbal - Nível 2  " :
  dominioSelecionado === "Grupo2" ? "Grupo - Nível 2  " :
  dominioSelecionado === "Linguística2" ? "Linguística - Nível 2  " : 
  dominioSelecionado === "Mando3" ? "Mando - Nível 3" :
  dominioSelecionado === "Tato3" ? "Tato - Nível 3" :
  dominioSelecionado === "Ouvinte3" ? "Ouvinte - Nível 3" :
  dominioSelecionado === "PVMTS3" ? "PVMTS - Nível 3" :
  dominioSelecionado === "Brincar3" ? "Brincar - Nível 3" :
  dominioSelecionado === "Social3" ? "Social - Nível 3" : 
  dominioSelecionado === "ROFCC3" ? "ROFCC - Nível 3" :
  dominioSelecionado === "Intraverbal3" ? "Intraverbal - Nível 3" :
  dominioSelecionado === "Grupo3" ? "Grupo - Nível 3" : 
  dominioSelecionado === "Linguística3" ? "Linguística - Nível 3" :
  dominioSelecionado === "Matematica3" ? "Matemática - Nível 3" :
  dominioSelecionado === "Leitura3" ? "Leitura - Nível 3" :
  dominioSelecionado === "Escrita3" ? "Escrita - Nível 3" :  
  dominioSelecionado;

  const salvarAvaliacao = async (e) => {
    e.preventDefault();
    try {
      const q = query(collection(db, "avaliacoes"), where("codigoPaciente", "==", paciente.codigoPaciente));
      const querySnapshot = await getDocs(q);
      const numeroAvaliacao = querySnapshot.size + 1;

      const docRef = await addDoc(collection(db, "avaliacoes"), {
        codigoPaciente: paciente.codigoPaciente,
        nomePaciente: paciente.nomeCompleto,
        dataAvaliacao,
        avaliador,
  dominio: dominioNomeCompleto, // ✅ nome visível completo
        respostas,
        totalPontos: calcularTotal(),
        observacoes,
        numeroAtendimento,
        numeroAvaliacao
      });

      await updateDoc(doc(db, "avaliacoes", docRef.id), {
        idAvaliacao: docRef.id
      });

      setIdAvaliacao(docRef.id);
      setMensagemSucesso(`Avaliação ${numeroAvaliacao} registrada com sucesso!`);
    } catch (error) {
      console.error("Erro ao salvar a avaliação:", error);
      setMensagemSucesso("Houve um erro ao salvar a avaliação. Tente novamente.");
    }
  };

  const gerarPlanoTerapeutico = () => {
    if (typeof onGerarPlano === "function") {
      const dadosAvaliacao = respostas.map((resposta, index) => ({
        pergunta: perguntas[index].texto,
        valor: resposta.valor,
        descricao: resposta.descricao
      }));

      const dadosFormatados = {
        paciente: paciente.nomeCompleto,
        respostas: dadosAvaliacao,
        totalPontos: calcularTotal(),
        observacoes,
        avaliador,
        dataAvaliacao,
        idAvaliacao,
        dominio: dominioSelecionado
      };

      onGerarPlano(dadosFormatados);
    }
  };
  
return (
  <div className="container-avaliacao">
    <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-4">
      Avaliações
    </h2>
    <form onSubmit={salvarAvaliacao} className="space-y-8">
      {/* Dados do Paciente */}
      <div className="card-dados-paciente">
        <div>
          <label className="input-group-avaliacao">Número de Atendimento</label>
          <input
            name="numeroAtendimento"
            value={numeroAtendimento}
            readOnly
            className="input-avaliacao bg-gray-100"
          />
        </div>
        <div>
          <label className="card-dados-paciente">Código do Paciente</label>
          <input
            type="text"
            value={paciente.codigoPaciente}
            readOnly
            className="w-full border p-2 rounded-lg"
          />
        </div>
        <div>
          <label className="card-dados-paciente">Nome do Paciente</label>
          <input
            type="text"
            value={paciente.nomeCompleto}
            readOnly
            className="w-full border p-2 rounded-lg"
          />
        </div>
        <div>
          <label className="card-dados-paciente">Data da Avaliação</label>
          <input
            type="date"
            value={dataAvaliacao}
            readOnly
            className="w-full border p-2 rounded-lg"
          />
        </div>
        <div>
          <label className="card-dados-paciente">Avaliador</label>
          <input
            type="text"
            name="avaliador"
            value={avaliador}
            onChange={(e) => setAvaliador(e.target.value)}
            required
            className="w-full border p-2 rounded-lg"
          />
        </div>
        {/* Tipo de Avaliação*/}
    <div className="mb-6">
      <label className="font-semibold text-gray-700">Tipo de Avaliação:</label>
      <select
        className="w-full border p-2 rounded-lg mt-2"
        value={dominioSelecionado}
        onChange={(e) => setDominioSelecionado(e.target.value)}
      >
        <option value="Mando">Mando - Nível 1</option>
        <option value="Tato">Tato - Nível 1</option>
        <option value="Ouvinte">Ouvinte - Nível 1</option>
        <option value="PVMTS">PV/MTS - Nível 1</option>
        <option value="Brincar">Brincar - Nível 1</option>
        <option value="Social">Social - Nível 1</option>
        <option value="Imitação">Imitação - Nível 1</option>  
        <option value="Ecoico">Ecóico - Nível 1</option>
        <option value="Vocal">Vocal - Nível 1</option>  
        <option value="Mando2">Mando - Nível 2</option>
        <option value="Tato2">Tato - Nível 2</option>
        <option value="Ouvinte2">Ouvinte - Nível 2</option>
        <option value="PVMTS2">PV/MTS - Nível 2</option>
        <option value="Brincar2">Brincar - Nível 2</option>
        <option value="Social2">Social - Nível 2</option>
        <option value="Imitação2">Imitação - Nível 2</option> 
        <option value="Ecoico2">Ecóico - Nível 2</option>
        <option value="ROFCC2">ROFCC - Nível 2</option> 
        <option value="Intraverbal2">Intraverbal - Nível 2</option>
        <option value="Grupo2">Grupo - Nível 2</option>
        <option value="Linguística2">Linguística - Nível 2</option> 
        <option value="Mando3">Mando - Nível 3</option>
        <option value="Tato3">Tato - Nível 3</option>
        <option value="Ouvinte3">Ouvinte - Nível 3</option>
        <option value="PVMTS3">PV/MTS - Nível 3</option>
        <option value="Brincar3">Brincar - Nível 3</option>
        <option value="Social3">Social - Nível 3</option>
        <option value="ROFCC3">ROFCC - Nível 3</option>
        <option value="Intraverbal3">Intraverbal - Nível 3</option>
        <option value="Grupo3">Grupo - Nível 3</option>
        <option value="Linguística3">Linguística - Nível 3</option>
        <option value="Matematica3">Matemática - Nível 3</option>
        <option value="Leitura3">Leitura - Nível 3</option> 
        <option value="Escrita3">Escrita - Nível 3</option>
      </select>
    </div>
        <hr className="divider" />
      </div>
<div className="mt-4">
  <h3 className="text-xl font-bold text-gray-700">
    {dominioSelecionado === "Mando" && "Nao tem ainda"}
    {dominioSelecionado === "Tato" && "A CRIANÇA TATEIA PESSOAS, OBJETOS, PARTES DO CORPO OU FIGURAS?"}
    {dominioSelecionado === "Ouvinte" && "A CRIANÇA ATENDE E RESPONDE A PALAVRAS FALADAS POR OUTRAS PESSOAS?"}
    {dominioSelecionado === "PVMTS" && "A CRIANÇA ATENDE E RESPONDE A ESTÍMULOS VISUAIS E EMPARELHA OBJETOS OU FIGURAS? "}
    {dominioSelecionado === "Brincar" && "A CRIANÇA SE ENGAJA EM COMPORTAMENTO DE BRINCAR INDEPENDENTE QUE É AUTOMATICAMENTE REFORÇADOR?"}
    {dominioSelecionado === "Social" && "A CRIANÇA ATENDE AOS OUTROS E TENTA SE ENGAJAR SOCIALMENTE COM OUTRAS PESSOAS?"}
    {dominioSelecionado === "Imitação" && "A CRIANÇA IMITA AÇÕES DE OUTRAS PESSOAS? "}
    {dominioSelecionado === "Ecoico" && "A CRIANÇA IMEDIATAMENTE REPETE (ECOA) FONEMAS VOCÁLICOS E CONSONANTAIS, SEPARADAMENTE E COMBINADOS?"}
    {dominioSelecionado === "Vocal" && "COM QUE FREQUÊNCIA A CRIANÇA VOCALIZA ESPONTANEAMENTE (SEM DICAS), E QUAL A NATUREZA DAS VOCALIZAÇÕES?"}
    {dominioSelecionado === "Mando2" && "A CRIANÇA DEMONSTRA FREQUENTEMENTE E ESPONTANEAMENTE MANDOS CONTROLADOS PRINCIPALMENTE POR MOTIVAÇÃO ?"}
    {dominioSelecionado === "Tato2" && "A CRIANÇA NOMEIA (TATO) SUBSTANTIVOS E VERBOS?"}
    {dominioSelecionado === "Ouvinte2" && "A CRIANÇA ESTÁ ADQUIRINDO HABILIDADES DE OUVINTE MAIS AVANÇADAS?"}
    {dominioSelecionado === "PVMTS2" && "A CRIANÇA EMPARELHA OBJETOS E FIGURAS IDÊNTICOS E NÃO-IDÊNTICOS?"}
    {dominioSelecionado === "Brincar2" && "A CRIANÇA SE ENGAJA NO COMPORTAMENTO DE BRINCAR INDEPENDENTE QUE É AUTOMATICAMENTE REFORÇADO?"}
    {dominioSelecionado === "Social2" && "A CRIANÇA PARTICIPA ESPONTANEAMENTE DE ATIVIDADES COM OUTRAS CRIANÇAS E INTERAGE VERBALMENTE DE FORMA ESPONTÂNEA COM ELAS?"}
    {dominioSelecionado === "Imitação2" && "A CRIANÇA IMITA AÇÕES DE OUTRAS PESSOAS?"}
    {dominioSelecionado === "Ecoico2" && "A CRIANÇA IMEDIATAMENTE REPETE (ECOA) PALAVRAS ESPECÍFICAS E FRASES?"}
    {dominioSelecionado === "ROFCC2" && "A CRIANÇA COMPREENDE COMO OUVINTE PALAVRAS QUE DESCREVEM OU MODIFICAM SUBSTANTIVOS E VERBOS DE ACORDO COM SUAS FUNÇÕES, CARACTERÍSTICAS OU CLASSES?"}
    {dominioSelecionado === "Intraverbal2" && "A CRIANÇA RESPONDE VERBALMENTE AOS CONTEÚDOS DAS PALAVRAS DE OUTRAS PESSOAS?"}
    {dominioSelecionado === "Grupo2" && "A CRIANÇA SEGUE AS ROTINAS DIÁRIAS DE UMA SALA DE AULA E PARTICIPA ADEQUADAMENTE DE ATIVIDADES DE GRUPO, BEM COMO RESPONDE EM UM FORMATO DE ENSINO COLETIVO?"}
    {dominioSelecionado === "Linguística2" && "A ARTICULAÇÃO DA CRIANÇA ESTÁ SE TORNANDO MAIS CLARA? SEU VOCABULÁRIO EXPRESSIVO (FALANTE) E RECEPTIVO (OUVINTE) ESTÃO AUMENTANDO, E ELA ESTÁ COMEÇANDO A EMITIR MAIS FRASES OU SENTENÇAS COM 2 OU 3 PALAVRAS?"}  
    {dominioSelecionado === "Mando3" && "A CRIANÇA PEDE INFORMAÇÃO, PEDE COM DIFERENTES COMPONENTES DA LINGUAGEM, E DÁ DIREÇÕES AOS OUTROS?"}
    {dominioSelecionado === "Tato3" && "A CRIANÇA EMITE UMA AMPLA VARIEDADE DE TATOS, E ELES CONTÊM VÁRIOS COMPONENTES DIFERENTES DA LINGUAGEM?"}
    {dominioSelecionado === "Ouvinte3" && "A CRIANÇA EMITE UMA AMPLA VARIEDADE DE TATOS, E ELES CONTÊM VÁRIOS COMPONENTES DIFERENTES DA LINGUAGEM?"}
    {dominioSelecionado === "PVMTS3" && "A CRIANÇA COMPLETA SEQUÊNCIAS, PADRÕES E PROJETOS COMPLEXOS?"}
    {dominioSelecionado === "Brincar3" && "A CRIANÇA ESPONTANEAMENTE SE ENGAJA EM BRINCADEIRAS INDEPENDENTES QUE SÃO REFORÇADAS AUTOMATICAMENTE?"}
    {dominioSelecionado === "Social3" && "A CRIANÇA ESPONTANEAMENTE SE ENGAJA EM BRINCADEIRAS E INTERAÇÕES VERBAIS RECÍPROCAS COM OS PARES?"}
    {dominioSelecionado === "ROFCC3" && "A CRIANÇA COMPREENDE COMO OUVINTE MÚLTIPLAS PALAVRAS QUE DESCREVEM OU MODIFICAM  NOMES E VERBOS POR FUNÇÃO, CLASSE OU CARACTERÍSTICA?"}
    {dominioSelecionado === "Intraverbal3" && "A CRIANÇA RESPONDE VERBALMENTE AO CONTEÚDO DAS PALAVRAS DE OUTRAS PESSOAS?"}
    {dominioSelecionado === "Grupo3" && "A CRIANÇA SEGUE AS ROTINAS DE SALA DE AULA E APRENDE EM UM FORMATO DE ENSINO COLETIVO?"}
    {dominioSelecionado === "Linguística3" && "A CRIANÇA ESTÁ EMITINDO ESTRUTURA DE LINGUAGEM E SINTAXE MAIS COMPLEXAS, DEMONSTRADAS PELO USO GRAMATICAL CORRETO DE PLURAIS, POSSE, MARCADORES DE TEMPO, E MODIFICADORES DE NOMES E VERBOS?"}
    {dominioSelecionado === "Matematica3" && "A CRIANÇA DEMONSTRA PRINCÍPIOS DE HABILIDADES MATEMÁTICAS ENVOLVENDO NÚMEROS, QUANTIDADES, CONTAGEM, E MEDIDAS?"}
    {dominioSelecionado === "Leitura3" && "A CRIANÇA DEMONSTRA INTERESSE POR PALAVRAS E LIVROS, NOMEIA (TATO) E DISCRIMINA LETRAS, E LÊ E COMPREENDE ALGUMAS PALAVRAS?"}
    {dominioSelecionado === "Escrita3" && "A CRIANÇA DESENHA, COPIA LETRAS E NÚMEROS, E ESCREVE SEU NOME DE FORMA INDEPENDENTE?"} 
  
  </h3>
</div>
      {/* Perguntas dinâmicas de acordo com o domínio */}
      <div className="space-y-4">
        {perguntas.map((pergunta, index) => (
          <div key={pergunta.id} className="flex flex-col gap-2">
            <label className="block text-lg font-medium text-gray-800">
              {index + 1}. {pergunta.texto}
            </label>
            <select
              value={respostas[index]?.valor !== undefined ? respostas[index].valor : ""}
              onChange={(e) => handleResposta(index, e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg"
              required
            >
              <option value="">Selecione uma resposta</option>
              {pergunta.respostas.map((resposta) => (
                <option key={resposta.valor} value={resposta.valor}>
                  {resposta.descricao}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {/* Observações */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">Observações</label>
        <textarea
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
          className="w-full border p-2 rounded-lg"
          rows={3}
        ></textarea>
      </div>

      {/* Botões */}
      <div className="flex gap-6">
        <button type="submit" className="botao-salvar-avaliacao">
          💾 Salvar Avaliação
        </button>
        <button
          type="button"
          onClick={gerarPlanoTerapeutico}
          className="botao-gerar-plano-avaliacao"
        >
          📋 Gerar Plano Terapêutico
        </button>
      </div>

      {/* Botão de Voltar */}
      <div className="space-y-4">
        <button
          type="button"
          onClick={onVoltar}
          className="botao-voltar-avaliacao"
        >
          🔙 Voltar
        </button>
      </div>

      {/* Mensagem de Sucesso */}
      {mensagemSucesso && (
        <div className="mensagem-sucesso">{mensagemSucesso}</div>
      )}
    </form>
  </div>
);
}

export default TelaAvaliacao;