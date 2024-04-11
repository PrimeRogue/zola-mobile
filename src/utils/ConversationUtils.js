export const filterListParticipants = (conversation, userId) => {
  return conversation?.participants?.filter(
    (participant) => participant?.id !== userId
  );
};

export const formatConversationName = (conversation, userId) => {
  if (conversation?.name) return conversation?.name;

  const listParticipants = filterListParticipants(conversation, userId);

  const conversationName = listParticipants
    ?.map((participant) => participant?.displayName)
    ?.join(", ");

  return conversationName;
};

export const getConversationAvatar = (conversation, userId) => {
  if (conversation?.participants?.length === 2) {
    const participants = filterListParticipants(conversation, userId);

    return participants?.[0]?.photoUrl;
  }

  return "";
};
