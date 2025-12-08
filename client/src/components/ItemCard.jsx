export function ItemCard({ item, formatDate }) {
  return (
    <article className="flex flex-col gap-2 rounded-lg border border-white/10 bg-white/5 p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-300">
            {item.item_type || "Item"}
          </p>
          <h3 className="text-lg font-bold text-white">
            {item.public_details?.title || "Unspecified title"}
          </h3>
        </div>
        <span className="rounded-full border border-white/20 bg-white/8 px-2 py-1 text-xs text-gray-200">
          {item.status ? item.status : "found"}
        </span>
      </div>
      <p className="text-sm text-gray-400">
        Found {formatDate(item.date_found)}
      </p>
      <p className="text-sm text-gray-400">
        Location: {item.location_found || "(not provided)"}
      </p>
      {item.public_details?.description ? (
        <p className="text-gray-300">{item.public_details.description}</p>
      ) : null}
      {Array.isArray(item.image_urls) && item.image_urls.length > 0 ? (
        <div className="mt-1 flex gap-2">
          {item.image_urls.slice(0, 3).map((url, idx) => (
            <img
              src={url}
              alt={item.item_type}
              key={idx}
              className="h-16 w-16 rounded-lg border border-white/10 object-cover"
            />
          ))}
        </div>
      ) : null}
    </article>
  );
}
