import React, { useCallback } from 'react'

function ConnectWalletButton({ image, label, activateConnector }: { image: string, label: string, activateConnector: (label: string) => void }) {

  const handleClick = useCallback(() => {
    activateConnector(label);
  }, [activateConnector, label]);

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex items-center gap-4 w-full rounded-lg border border-gray-600 p-3 text-left hover:border-gray-500 hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 active:opacity-90"
    >
      <img src={image} alt={label} />
      <span className="px-2 text-lg font-semibold text-white font-inter">
        Continue with {label}
      </span>
    </button>
  )
}

export default React.memo(ConnectWalletButton)