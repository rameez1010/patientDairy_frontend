import { BeatLoader } from 'react-spinners';

const InvitationButton = ({ status, onInvite, inviteLoading, patientId }) => {
  let label = '';
  let styles = '';
  let isClickable = false;

  switch (status) {
    case 'not_sent':
      label = 'Invite Patient';
      styles = 'bg-[#5558E4] text-white hover:opacity-100 opacity-85 cursor-pointer';
      isClickable = true;
      break;
    case 'invite_sent':
      label = 'Invite Sent';
      styles = 'bg-[#FFB224] text-white cursor-default';
      break;
    case 'active':
      label = 'Active';
      styles = 'bg-[#BF7BD3] text-white cursor-default';
      break;
    default:
      label = 'Unknown';
      styles = 'bg-red-400 text-white cursor-default';
  }

  return (
    <button
      onClick={isClickable ? onInvite : undefined}
      className={`py-[2px] px-2 rounded-full text-xs min-w-[120px] flex justify-center items-center ${styles}`}
      style={{ minWidth: '120px' }}
      disabled={!isClickable}
    >
      {inviteLoading === patientId && isClickable ? <BeatLoader color="#ffffff" size={8} /> : label}
    </button>
  );
};

export default InvitationButton;
