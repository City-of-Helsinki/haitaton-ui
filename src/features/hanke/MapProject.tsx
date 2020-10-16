import React from 'react';
import styled from 'styled-components';
import { useProject } from './hooks/useProject';

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

const HaitatonProject: React.FC = () => {
  const { project } = useProject();

  if (!project) {
    return (
      <WindowContainer>
        <Title data-testid="project-title">Not found</Title>
      </WindowContainer>
    );
  }

  return (
    <WindowContainer>
      <Title>{project.properties.name}</Title>
      <Content>Jep</Content>
    </WindowContainer>
  );
};

export default HaitatonProject;
