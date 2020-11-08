import React from 'react';
import { Box } from '@chakra-ui/core';
import { useProject } from '../../map/hooks/useProject';
import './Hanke.styles.scss';

const HaitatonProject: React.FC = () => {
  const { project } = useProject();

  if (!project) {
    return (
      <div className="windowContainer">
        <Box
          bg={{ s: 'tomato', m: 'green.50' }}
          w="50%"
          p={{ s: 's', m: 'l' }}
          color="white"
          data-testid="project-title"
        >
          Not found
        </Box>
      </div>
    );
  }

  return (
    <div className="windowContainer">
      <div className="hanke__title">{project.properties.name}</div>
      <div className="hanke__content">Jep</div>
    </div>
  );
};

export default HaitatonProject;
