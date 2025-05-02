type RowProps = {
  children: React.ReactNode;
};

export function Row({ children }: RowProps) {
  return (
    <div className="mt-2 flex justify-center max-w-sm items-end space-x-2 text-xs">
      {children}
    </div>
  );
}
