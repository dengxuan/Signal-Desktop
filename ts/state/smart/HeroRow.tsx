// Copyright 2020 Signal Messenger, LLC
// SPDX-License-Identifier: AGPL-3.0-only
import React, { memo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { PanelType } from '../../types/Panels';
import { ConversationHero } from '../../components/conversation/ConversationHero';
import { getPreferredBadgeSelector } from '../selectors/badges';
import { getIntl, getTheme } from '../selectors/user';
import { getHasStoriesSelector } from '../selectors/stories2';
import { isSignalConversation } from '../../util/isSignalConversation';
import { getConversationSelector } from '../selectors/conversations';
import {
  type ConversationType,
  useConversationsActions,
} from '../ducks/conversations';
import { useGlobalModalActions } from '../ducks/globalModals';
import { useStoriesActions } from '../ducks/stories';
import { getAddedByForOurPendingInvitation } from '../../util/getAddedByForOurPendingInvitation';

type SmartHeroRowProps = Readonly<{
  id: string;
}>;

function isFromOrAddedByTrustedContact(
  conversation: ConversationType
): boolean {
  if (conversation.type === 'direct') {
    return Boolean(conversation.name) || Boolean(conversation.profileSharing);
  }

  const addedByConv = getAddedByForOurPendingInvitation(conversation);
  if (!addedByConv) {
    return false;
  }

  return Boolean(
    addedByConv.isMe || addedByConv.name || addedByConv.profileSharing
  );
}

export const SmartHeroRow = memo(function SmartHeroRow({
  id,
}: SmartHeroRowProps) {
  const i18n = useSelector(getIntl);
  const theme = useSelector(getTheme);
  const getPreferredBadge = useSelector(getPreferredBadgeSelector);
  const hasStoriesSelector = useSelector(getHasStoriesSelector);
  const conversationSelector = useSelector(getConversationSelector);
  const conversation = conversationSelector(id);
  if (conversation == null) {
    throw new Error(`Did not find conversation ${id} in state!`);
  }
  const badge = getPreferredBadge(conversation.badges);
  const hasStories = hasStoriesSelector(id);
  const isSignalConversationValue = isSignalConversation(conversation);
  const fromOrAddedByTrustedContact =
    isFromOrAddedByTrustedContact(conversation);
  const { pushPanelForConversation, unblurAvatar, updateSharedGroups } =
    useConversationsActions();
  const { toggleAboutContactModal, toggleProfileNameWarningModal } =
    useGlobalModalActions();
  const openConversationDetails = useCallback(() => {
    pushPanelForConversation({ type: PanelType.ConversationDetails });
  }, [pushPanelForConversation]);
  const { viewUserStories } = useStoriesActions();
  const {
    about,
    acceptedMessageRequest,
    avatarUrl,
    groupDescription,
    isMe,
    membersCount,
    nicknameGivenName,
    nicknameFamilyName,
    phoneNumber,
    profileName,
    sharedGroupNames,
    title,
    type,
    unblurredAvatarUrl,
  } = conversation;

  const isDirectConvoAndHasNickname =
    type === 'direct' && Boolean(nicknameGivenName || nicknameFamilyName);

  return (
    <ConversationHero
      about={about}
      acceptedMessageRequest={acceptedMessageRequest}
      avatarUrl={avatarUrl}
      badge={badge}
      conversationType={type}
      fromOrAddedByTrustedContact={fromOrAddedByTrustedContact}
      groupDescription={groupDescription}
      hasStories={hasStories}
      i18n={i18n}
      id={id}
      isDirectConvoAndHasNickname={isDirectConvoAndHasNickname}
      isMe={isMe}
      isSignalConversation={isSignalConversationValue}
      membersCount={membersCount}
      openConversationDetails={openConversationDetails}
      phoneNumber={phoneNumber}
      profileName={profileName}
      sharedGroupNames={sharedGroupNames}
      theme={theme}
      title={title}
      toggleAboutContactModal={toggleAboutContactModal}
      toggleProfileNameWarningModal={toggleProfileNameWarningModal}
      unblurAvatar={unblurAvatar}
      unblurredAvatarUrl={unblurredAvatarUrl}
      updateSharedGroups={updateSharedGroups}
      viewUserStories={viewUserStories}
    />
  );
});
