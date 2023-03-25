export const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className='scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0 dark:border-b-slate-700'>
    {children}
  </h2>
);

export const H3 = ({
  children,
  classes,
}: {
  children: React.ReactNode;
  classes?: string;
}) => (
  <h3 className={`text-2xl font-semibold tracking-tight ${classes}`}>
    {children}
  </h3>
);
