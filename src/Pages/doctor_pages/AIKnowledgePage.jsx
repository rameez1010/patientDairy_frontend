import AIKnowledge from '../../components/doctor_components/AIKnowledge';
import Sidebar from '../../components/doctor_components/Sidebar';

const AIKnowledgePage = () => {
  return (
    <div className="flex">
      <Sidebar />
      <AIKnowledge />
    </div>
  );
};

export default AIKnowledgePage;
