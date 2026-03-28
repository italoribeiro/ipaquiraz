export const POST_STATUS = {
  NAO_PUBLICADO: 0,
  PUBLICADO: 1,
  PENDENTE_IA: 3,
  RASCUNHO: 4,
} as const;

export const POST_STATUS_LABEL = {
  [POST_STATUS.NAO_PUBLICADO]: { texto: "Não Publicado", cor: "bg-red-100 text-red-700" },
  [POST_STATUS.PUBLICADO]: { texto: "Publicado", cor: "bg-green-100 text-green-700" },
  [POST_STATUS.PENDENTE_IA]: { texto: "Pendente IA", cor: "bg-purple-100 text-purple-700" },
  [POST_STATUS.RASCUNHO]: { texto: "Rascunho", cor: "bg-gray-100 text-gray-700" },
};