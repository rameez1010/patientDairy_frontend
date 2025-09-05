import { RiRobot2Fill } from 'react-icons/ri';
import { BeatLoader } from 'react-spinners';

const AILoader = () => {
  return (
    <div className="flex justify-start">
      <div className="flex items-start gap-3 max-w-[80%] opacity-70 animate-pulse">
        <div className="w-8 h-8 bg-[#5558E4] rounded-full flex items-center justify-center text-white shadow-sm flex-shrink-0 mt-1">
          <RiRobot2Fill />
        </div>
        <div>
          <div className="bg-gray-200 rounded-lg px-4 py-3 min-w-[60px]">
            <div className="flex items-center gap-3">
              <div className="relative">
                <style
                  dangerouslySetInnerHTML={{
                    __html: `
                                  .gradient-beat-loader .react-spinners-BeatLoader > span {
                                    background: linear-gradient(45deg, #5558E4, #8B5CF6, #EC4899) !important;
                                    border-radius: 50%;
                                  }
                                `,
                  }}
                />
                <div className="gradient-beat-loader">
                  <BeatLoader color="#5558E4" loading={true} size={10} speedMultiplier={0.8} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AILoader;
