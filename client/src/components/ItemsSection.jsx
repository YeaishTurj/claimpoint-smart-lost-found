import { ItemsList } from "./ItemsList";

export function ItemsSection({ itemsError, items, itemsLoading, formatDate, authToken, userRole }) {
  return (
    <section
      id="found-items"
      className="rounded-2xl border border-white/10 bg-white/3 p-6 shadow-lg"
    >
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-indigo-300">
            Found items
          </p>
          <h2 className="mb-2 text-2xl font-bold text-white">
            What is currently logged
          </h2>
          <p className="text-gray-300">
            Public view hides sensitive owner details. Staff/Admin can see more
            once signed in.
          </p>
        </div>
        {itemsError ? (
          <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {itemsError}
          </div>
        ) : null}
      </div>
      <ItemsList
        items={items}
        loading={itemsLoading}
        error={itemsError}
        formatDate={formatDate}
        authToken={authToken}
        userRole={userRole}
      />
    </section>
  );
}
