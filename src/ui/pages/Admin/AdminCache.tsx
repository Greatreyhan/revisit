import { useEffect, useState } from "react";
import { useFirebase } from "../../../utils/FirebaseContext";
import { MdDelete } from "react-icons/md";

interface ImageEntry {
  status: string;
  url: string;
}

interface Row {
  uid: string;
  timestamp: string;
  entry: ImageEntry;
  filename: string;
}

type ConfirmAction = {
  keys: string[];
  message: string;
} | null;

const AdminCache = () => {
  const { getFromDatabase, deleteFromDatabase } = useFirebase();
  const [rows, setRows] = useState<Row[]>([]);
  const [statusFilter, setStatusFilter] = useState<"All" | "uploaded" | "pending">("All");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);

  useEffect(() => {
    getFromDatabase(`images`).then((data: any) => {
      if (data) {
        const allRows: Row[] = [];
        Object.entries(data as Record<string, unknown>).forEach(([uid, images]) => {
          // cast images ke object dengan key string
          const imagesObj = images as Record<string, ImageEntry>;
          Object.entries(imagesObj)
            .filter(([_, val]) => typeof val === "object" && (val as ImageEntry).url)
            .forEach(([timestamp, entry]) => {
              const url = (entry as ImageEntry).url;
              // decode URL, hilangkan prefix images/, lalu ambil nama file
              const decodedUrl = decodeURIComponent(url);
              const withoutPrefix = decodedUrl.replace(/images\//, "");
              const filename = withoutPrefix.split("/").pop()!.split("?")[0];

              allRows.push({ uid, timestamp, entry: entry as ImageEntry, filename });
            });
        });
        setRows(allRows);
      }
    });
  }, [getFromDatabase]);

  const filtered = rows.filter(({ entry }) =>
    statusFilter === "All" ? true : entry.status === statusFilter
  );

  const toggleSelect = (key: string) => {
    setSelected(prev => {
      const nxt = new Set(prev);
      nxt.has(key) ? nxt.delete(key) : nxt.add(key);
      return nxt;
    });
  };

  const toggleSelectAll = () => {
    const visibleKeys = filtered.map(r => `${r.uid}-${r.timestamp}`);
    const allSelected = visibleKeys.every(k => selected.has(k));
    setSelected(prev => {
      const nxt = new Set(prev);
      if (allSelected) visibleKeys.forEach(k => nxt.delete(k));
      else visibleKeys.forEach(k => nxt.add(k));
      return nxt;
    });
  };

  const askDeleteSelected = () => {
    if (selected.size === 0) return;
    setConfirmAction({
      keys: Array.from(selected),
      message: `Hapus ${selected.size} gambar terpilih?`,
    });
  };

  const askDeleteSingle = (key: string) => {
    setConfirmAction({
      keys: [key],
      message: "Hapus gambar ini?",
    });
  };

  const onConfirmDelete = () => {
    if (!confirmAction) return;
    confirmAction.keys.forEach(key => {
      const [uid, timestamp] = key.split("-");
      deleteFromDatabase(`images/${uid}/${timestamp}`);
    });
    setRows(prev => prev.filter(r => !confirmAction.keys.includes(`${r.uid}-${r.timestamp}`)));
    setSelected(prev => {
      const nxt = new Set(prev);
      confirmAction.keys.forEach(k => nxt.delete(k));
      return nxt;
    });
    setConfirmAction(null);
  };

  return (
    <div className="md:w-11/12 w-full mx-auto pt-8 relative">
      {/* Modal Konfirmasi */}
      {confirmAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white rounded-lg p-6 w-80 text-center">
            <p className="mb-6">{confirmAction.message}</p>
            <div className="flex justify-around">
              <button
                onClick={() => setConfirmAction(null)}
                className="px-4 py-2 bg-gray-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={onConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4">
        <p>
          Total Images: {filtered.length} | Selected: {selected.size}
        </p>
        <div className="flex items-center gap-4">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
            className="p-2 border rounded-lg"
          >
            <option value="All">All</option>
            <option value="uploaded">Uploaded</option>
            <option value="pending">Pending</option>
          </select>
          {selected.size > 0 && (
            <button
              onClick={askDeleteSelected}
              className="px-4 py-2 bg-red-600 text-white rounded-lg"
            >
              Delete Selected
            </button>
          )}
        </div>
      </div>

      {/* Tabel semua images */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">
                <input
                  type="checkbox"
                  onChange={toggleSelectAll}
                  checked={
                    filtered.length > 0 &&
                    filtered.every(r => selected.has(`${r.uid}-${r.timestamp}`))
                  }
                />
              </th>
              <th className="px-4 py-2 border">No.</th>
              <th className="px-4 py-2 border">File Name</th>
              <th className="px-4 py-2 border">Timestamp</th>
              <th className="px-4 py-2 border">Preview</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(({ uid, timestamp, entry, filename }, idx) => {
              const key = `${uid}-${timestamp}`;
              return (
                <tr key={key} className="text-center">
                  <td className="px-4 py-2 border">
                    <input
                      type="checkbox"
                      checked={selected.has(key)}
                      onChange={() => toggleSelect(key)}
                    />
                  </td>
                  <td className="px-4 py-2 border">{idx + 1}</td>
                  <td className="px-4 py-2 border break-all">{filename}</td>
                  <td className="px-4 py-2 border">
                    {new Date(Number(timestamp)).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 border">
                    <a
                      href={entry.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </a>
                  </td>
                  <td
                    className={`px-4 py-2 border font-medium ${
                      entry.status === "uploaded"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {entry.status}
                  </td>
                  <td className="px-4 py-2 border">
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => askDeleteSingle(key)}
                    >
                      <MdDelete size={20} />
                    </button>
                  </td>
                </tr>
              );
            })}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-2 border text-center text-gray-500">
                  Tidak ada data.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCache;
