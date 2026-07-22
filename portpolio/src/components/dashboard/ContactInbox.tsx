import { useState } from "react";
import { Mail, Trash2, Reply, Clock, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useContacts, useMarkContactRead, useDeleteContact } from "@/hooks/useContacts";

export function ContactInbox() {
  const { data: messages = [], isLoading } = useContacts();
  const markAsRead = useMarkContactRead();
  const deleteContact = useDeleteContact();
  
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedMessage = messages.find(m => m.id === selectedId);

  const handleSelectMessage = (message: typeof messages[0]) => {
    setSelectedId(message.id);
    if (!message.is_read) {
      markAsRead.mutate({ id: message.id, is_read: true });
    }
  };

  const handleDelete = (id: string) => {
    deleteContact.mutate(id);
    if (selectedId === id) {
      setSelectedId(null);
    }
  };

  const unreadCount = messages.filter(m => !m.is_read).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
      {/* Messages List */}
      <div className="lg:col-span-1 bg-card rounded-2xl card-shadow overflow-hidden flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Inbox</h3>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {messages.length > 0 ? (
            messages.map(message => (
              <button
                key={message.id}
                onClick={() => handleSelectMessage(message)}
                className={cn(
                  "w-full p-4 text-left border-b border-border hover:bg-muted/50 transition-colors",
                  selectedId === message.id && "bg-muted",
                  !message.is_read && "bg-primary/5"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "w-2 h-2 rounded-full mt-2 flex-shrink-0",
                    message.is_read ? "bg-transparent" : "bg-primary"
                  )} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className={cn(
                        "text-sm truncate",
                        message.is_read ? "text-foreground" : "font-semibold text-foreground"
                      )}>
                        {message.name}
                      </p>
                      <span className="text-xs text-muted-foreground flex-shrink-0">
                        {new Date(message.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <p className={cn(
                      "text-sm truncate",
                      message.is_read ? "text-muted-foreground" : "text-foreground"
                    )}>
                      {message.subject}
                    </p>
                    <p className="text-xs text-muted-foreground truncate mt-1">
                      {message.message}
                    </p>
                  </div>
                </div>
              </button>
            ))
          ) : (
            <div className="p-8 text-center">
              <Mail size={32} className="mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground text-sm">No messages yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Message Detail */}
      <div className="lg:col-span-2 bg-card rounded-2xl card-shadow overflow-hidden flex flex-col">
        {selectedMessage ? (
          <>
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">{selectedMessage.subject}</h3>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open(`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`)}
                  >
                    <Reply size={14} />
                    Reply
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="text-muted-foreground hover:text-destructive"
                    disabled={deleteContact.isPending}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="flex items-center gap-4 mb-6 pb-4 border-b border-border">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User size={20} className="text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{selectedMessage.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedMessage.email}</p>
                </div>
                <div className="ml-auto flex items-center gap-1 text-muted-foreground text-sm">
                  <Clock size={14} />
                  {new Date(selectedMessage.created_at).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
              <div className="prose prose-sm max-w-none">
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                  {selectedMessage.message}
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Mail size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Select a Message</h3>
              <p className="text-muted-foreground text-sm">
                Choose a message from the inbox to view its contents
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
