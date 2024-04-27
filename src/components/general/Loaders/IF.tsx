type Props = {
  children: React.ReactNode;
  condition: any;
};

const IF = ({ children, condition }: Props) => {
  if (condition) {
    return children;
  }

  return null;
};

export default IF;
