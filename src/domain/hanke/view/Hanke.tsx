import axios from 'axios';
import React from 'react';
import { useQuery } from 'react-query';
import './Hanke.styles.scss';

type ProjectId = number | null;

const getProjectById = async (key: string, id: ProjectId) => {
  const { data } = await axios.get(`/api/projects/${id}`);
  return data;
};

const useProject = (projectId: ProjectId) =>
  useQuery(['project', projectId], getProjectById, {
    enabled: projectId,
  });

const HaitatonProject: React.FC = () => {
  const { isLoading, isError, data } = useProject(1);

  if (isLoading || isError) {
    return (
      <div className="windowContainer">
        <div className="hanke__content">Ladataan...</div>
      </div>
    );
  }

  return (
    <div className="windowContainer">
      <div className="hanke__title">Haitaton-ID: {data.id} Heikkiläntie</div>
      <div className="hanke__content">Jep</div>
    </div>
  );
};

export default HaitatonProject;
