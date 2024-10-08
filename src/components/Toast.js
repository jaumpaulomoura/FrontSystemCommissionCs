import React from 'react';
import {
  AiOutlineCheckCircle,
  AiOutlineCloseCircle,
  AiOutlineInfoCircle,
  AiOutlineWarning
} from 'react-icons/ai';
import { Box, Flex, Text } from '@chakra-ui/react';

export function Toast({ title, description, status, onClose }) {
  const statuses = {
    success: {
      color: 'feedback.success',
      icon: <AiOutlineCheckCircle fontSize="35px" />
    },
    error: {
      color: 'feedback.error',
      icon: <AiOutlineWarning fontSize="35px" />
    },
    warning: {
      color: 'primary.base',
      icon: <AiOutlineWarning fontSize="35px" />
    },
    info: {
      color: 'secondary.base',
      icon: <AiOutlineInfoCircle fontSize="35px" />
    }
  };

  return (
    <Flex
      data-testid={`toast-${status}`}
      backgroundColor="white"
      justifyContent="space-between"
      alignItems="center"
      borderRadius="8px"
      border="1px solid"
      borderLeftWidth="8px"
      borderColor={statuses[status].color}
      padding="12px"
      position="relative"
      minWidth="100%"
    >
      <Box marginRight="10px">{statuses[status].icon}</Box>
      <Flex direction="column" width="100%">
        <Text
          color={statuses[status].color}
          fontSize="14px"
          lineHeight="20px"
          fontWeight="bold"
        >
          {title}
        </Text>
        <Text color="text.body2" fontSize="14px" lineHeight="20px">
          {description}
        </Text>
      </Flex>
      <Box
        as="button"
        role="button"
        position="absolute"
        top="12px"
        right="10px"
        onClick={onClose}
      >
        <AiOutlineCloseCircle fontSize="16px" />
      </Box>
    </Flex>
  );
}

export default Toast;
