import { BeatLoader } from 'react-spinners';

const override = {
  display: 'block',
  margin: '0 auto',
};

const Spinner = ({ loading, color }) => {
  return (
    <div className="">
      <BeatLoader color={`${color || '#ffffff'}`} loading={loading} cssOverride={override} size={7} />
    </div>
  );
};

export default Spinner;
