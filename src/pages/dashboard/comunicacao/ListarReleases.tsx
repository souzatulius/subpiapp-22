const renderSearchInput = (
  placeholder: string,
  value: string,
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  onClear: () => void
) => {
  return (
    <div className="relative mb-4">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="h-4 w-4 text-gray-400" />
      </div>
      <input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="flex h-12 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base shadow-sm transition-all duration-300 hover:border-gray-600 placeholder:text-gray-400 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-[#003570] disabled:cursor-not-allowed disabled:opacity-50 pl-9 pr-10"
      />
      {value && (
        <button
          type="button"
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
          onClick={onClear}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
