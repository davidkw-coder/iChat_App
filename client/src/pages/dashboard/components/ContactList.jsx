import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import ContactCard from './ContactCard';

const ContactList = ({ contacts, activeContactId, onContactSelect, messages }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter contacts based on search query
  const filteredContacts = useMemo(() => {
    if (!searchQuery?.trim()) return contacts;
    
    return contacts?.filter(contact =>
      contact?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      contact?.role?.toLowerCase()?.includes(searchQuery?.toLowerCase())
    );
  }, [contacts, searchQuery]);

  // Get last message and unread count for each contact
  const getContactMessageInfo = (contactId) => {
    const contactMessages = messages?.filter(msg => 
      msg?.senderId === contactId || msg?.receiverId === contactId
    );
    
    const lastMessage = contactMessages?.length > 0 
      ? contactMessages?.[contactMessages?.length - 1]
      : null;
    
    const unreadCount = contactMessages?.filter(msg => 
      msg?.senderId === contactId && !msg?.isRead
    )?.length;

    return {
      lastMessage: lastMessage ? {
        content: lastMessage?.content,
        timestamp: lastMessage?.timestamp,
        isOwn: lastMessage?.senderId !== contactId
      } : null,
      unreadCount
    };
  };

  // Sort contacts by last message time and online status
  const sortedContacts = useMemo(() => {
    return [...filteredContacts]?.sort((a, b) => {
      const aInfo = getContactMessageInfo(a?.id);
      const bInfo = getContactMessageInfo(b?.id);
      
      // Prioritize contacts with unread messages
      if (aInfo?.unreadCount > 0 && bInfo?.unreadCount === 0) return -1;
      if (bInfo?.unreadCount > 0 && aInfo?.unreadCount === 0) return 1;
      
      // Then sort by online status
      if (a?.status === 'online' && b?.status !== 'online') return -1;
      if (b?.status === 'online' && a?.status !== 'online') return 1;
      
      // Finally sort by last message time
      if (aInfo?.lastMessage && bInfo?.lastMessage) {
        return new Date(bInfo.lastMessage.timestamp) - new Date(aInfo.lastMessage.timestamp);
      }
      if (aInfo?.lastMessage && !bInfo?.lastMessage) return -1;
      if (!aInfo?.lastMessage && bInfo?.lastMessage) return 1;
      
      return a?.name?.localeCompare(b?.name);
    });
  }, [filteredContacts, messages]);

  const onlineCount = contacts?.filter(contact => contact?.status === 'online')?.length;
  const totalUnreadCount = contacts?.reduce((total, contact) => {
    return total + getContactMessageInfo(contact?.id)?.unreadCount;
  }, 0);

  return (
    <div className="flex flex-col h-full bg-card border-r border-border">
      {/* Header */}
      <div className="p-4 border-b border-border bg-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Contacts</h2>
            <p className="text-sm text-muted-foreground">
              {onlineCount} online • {contacts?.length} total
            </p>
          </div>
          {totalUnreadCount > 0 && (
            <div className="flex items-center space-x-2">
              <Icon name="MessageCircle" size={16} className="text-accent" />
              <span className="text-sm font-medium text-accent">
                {totalUnreadCount} new
              </span>
            </div>
          )}
        </div>

        {/* Search Input */}
        <div className="relative">
          <Input
            type="search"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e?.target?.value)}
            className="pl-10"
          />
          <Icon 
            name="Search" 
            size={16} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
          />
        </div>
      </div>
      {/* Contact List */}
      <div className="flex-1 overflow-y-auto">
        {sortedContacts?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center p-6">
            <Icon name="Users" size={48} className="text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              {searchQuery ? 'No contacts found' : 'No contacts available'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {searchQuery 
                ? 'Try adjusting your search terms' :'Start by adding some contacts to begin chatting'
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {sortedContacts?.map((contact) => {
              const messageInfo = getContactMessageInfo(contact?.id);
              return (
                <ContactCard
                  key={contact?.id}
                  contact={contact}
                  isActive={activeContactId === contact?.id}
                  onClick={() => onContactSelect(contact)}
                  lastMessage={messageInfo?.lastMessage}
                  unreadCount={messageInfo?.unreadCount}
                />
              );
            })}
          </div>
        )}
      </div>
      {/* Footer Stats */}
      <div className="p-3 border-t border-border bg-muted/30">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Last updated: {new Date()?.toLocaleTimeString()}</span>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span>Connected</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactList;