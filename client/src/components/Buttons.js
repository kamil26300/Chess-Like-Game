export const Button = ({ children, onClick, disabled }) => {
  return (
    <button
      disabled={disabled || false}
      className="outline px-4 py-1 disabled:cursor-not-allowed disabled:opacity-50"
      onClick={onClick || console.log(`'${children}' button clicked`)}
    >
      {children}
    </button>
  );
};
