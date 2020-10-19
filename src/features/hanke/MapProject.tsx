import React from 'react';
import styled from 'styled-components';
import { Box } from '@chakra-ui/core';
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
        <Box
          bg={{ s: 'tomato', m: 'green.50' }}
          w="50%"
          p={{ s: 's', m: 'l' }}
          color="white"
          data-testid="project-title"
        >
          Not found
        </Box>
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
