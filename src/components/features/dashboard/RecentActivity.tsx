type RecentActivityProps = {
  hasCanteiros: boolean;
  hasLowStock: boolean;
};

export function RecentActivity({ hasCanteiros, hasLowStock }: RecentActivityProps) {
  return (
    <div className="bg-white rounded-[2rem] p-8 shadow-[0_10px_40px_rgba(21,66,18,0.03)]">
      <h2 className="text-2xl font-black font-manrope text-sage-700 tracking-tight mb-4">
        Atividade Recente
      </h2>
      {!hasCanteiros && !hasLowStock ? (
        <div className="bg-sage-50/50 p-6 rounded-xl border border-sage-100/50">
          <p className="text-sage-600 font-medium">
            ✨ Bem-vindo(a) à Horta Comum! Nenhuma atividade registrada no
            sistema ainda. Adicione canteiros e itens de estoque para dar vida
            ao painel.
          </p>
        </div>
      ) : (
        <div className="bg-sage-50/50 p-6 rounded-xl border border-sage-100/50">
          <p className="text-sage-600 font-medium">
            As últimas interações na sua horta comunitária estão concentradas nas
            guias de Canteiro e Estoque. Continue o ótimo trabalho mantendo a
            terra fértil e viva!
          </p>
        </div>
      )}
    </div>
  );
}
