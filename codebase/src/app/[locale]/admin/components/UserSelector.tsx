import { Box, Button, Flex } from '@chakra-ui/react';

interface UserSelectorProps {
  userIds: string[];
  selectedUserId: string;
  setSelectedUserId: (id: string) => void;
  onShowAll: () => void;
}

export function UserSelector({ userIds, selectedUserId, setSelectedUserId, onShowAll }: UserSelectorProps) {
  return (
    <Flex
      direction={{ base: "column", sm: "row" }}
      gap={4}
      flex={{ base: "1 1 100%", md: "0 1 auto" }}
      width={{ base: "100%", md: "auto" }}
      alignItems="center"
    >
      <Box w={{ base: "full", sm: "250px" }} mb={{ base: 2, sm: 0 }}>
        <select
          value={selectedUserId}
          onChange={e => setSelectedUserId(e.target.value)}
          style={{
            padding: '10px',
            fontSize: '16px',
            width: '100%',
            borderRadius: '5px',
            border: '1px solid #3182CE',
            backgroundColor: '#1A202C',
            color: 'white'
          }}
        >
          <option value="">Benutzer auswählen</option>
          {userIds.map(id => (
            <option key={id} value={id}>{id}</option>
          ))}
        </select>
      </Box>
      <Button
        bg="black"
        color="white"
        _hover={{ bg: 'gray.800' }}
        onClick={onShowAll}
        size="lg"
        flex={{ base: "1 1 100%", sm: "0 1 auto" }}
        minW={{ sm: "180px" }}
      >
        Alle Benutzer anzeigen
      </Button>
    </Flex>
  );
}
