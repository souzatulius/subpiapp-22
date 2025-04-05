import React, { useState } from 'react';

interface Noticia {
  id: string;
  titulo: string;
  conteudo: string;
}

const ListaNoticias = () => {
  const [busca, setBusca] = useState('');
  
  const noticias: Noticia[] = [
    { id: '1', titulo: 'Prefeitura inaugura nova praça', conteudo: 'Texto da notícia 1' },
    { id: '2', titulo: 'Novo plano de mobilidade urbana', conteudo: 'Texto da notícia 2' },
    { id: '3', titulo: 'Campanha de vacinação começa amanhã', conteudo: 'Texto da notícia 3' },
  ];

  const noticiasFiltradas = noticias.filter((noticia) =>
    noticia.titulo.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-sm">
      <div className="relative w-full mb-6">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.3-4.3" />
        </svg>

        <input
          type="search"
          className="flex h-12 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base shadow-sm transition-all duration-300 hover:border-gray-600 placeholder:text-gray-400 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-[#003570] disabled:cursor-not-allowed disabled:opacity-50 pl-9"
          placeholder="Buscar notícias..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      {noticiasFiltradas.length > 0 ? (
        <ul className="space-y-3">
          {noticiasFiltradas.map((noticia) => (
            <li key={noticia.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold">{noticia.titulo}</h3>
              <p className="text-sm text-gray-600 mt-1">{noticia.conteudo}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-sm">Nenhuma notícia encontrada.</p>
      )}
    </div>
  );
};

export default ListaNoticias;
