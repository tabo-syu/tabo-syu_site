type Props = {
  children: React.ReactNode;
};
const WideContainer: React.FC<Props> = (props) => {
  return (
    <div className='mx-auto max-w-6xl px-4'>
      <div className='bg-white px-5 pb-32 pt-20 dark:bg-gray-900 md:px-10'>
        {props.children}
      </div>
    </div>
  );
};

export default WideContainer;