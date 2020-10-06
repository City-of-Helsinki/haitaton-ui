import axios from 'axios';
import React from 'react';
import styled from 'styled-components';
import { useQuery } from 'react-query';

const WindowContainer = styled.div`
  border: 1px solid red;
  width: clamp(23ch, 50%, 46ch);
  display: flex;
  flex-direction: column;
  z-index: 1;
`;

const Title = styled.div`
  background: blue;
  border-bottom: 2px solid black;
  color: white;
`;

const Content = styled.div`
  padding: 5px;
`;

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
      <WindowContainer>
        <p>Ladataan...</p>
      </WindowContainer>
    );
  }

  return (
    <WindowContainer>
      <Title>Haitaton-ID: {data.id} Heikkiläntie</Title>
      <Content>Jep</Content>
    </WindowContainer>
  );
};

export default HaitatonProject;
