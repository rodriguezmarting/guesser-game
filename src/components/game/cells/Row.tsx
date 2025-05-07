type RowProps = {
  children: React.ReactNode;
};

export function Row({ children }: RowProps) {
  return <div className="flex items-end space-x-2 text-xs">{children}</div>;
}
