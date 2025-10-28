export default {
    async fetch(request, env, ctx) {
      const url = new URL(request.url);
      const path = url.pathname;
      const method = request.method;
  
      // Enable CORS for all requests
      const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      };
  
      // Handle CORS preflight requests
      if (method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
      }
  
      try {
        // Get user info from headers
        const userId = request.headers.get('X-Encrypted-Yw-ID');
        const isLogin = request.headers.get('X-Is-Login') === '1';
  
        // API Routes
        if (path === '/api/auth/user-info' && method === 'GET') {
          return await getUserInfo(userId, isLogin, env, corsHeaders);
        }
  
        if (path === '/api/users' && method === 'GET') {
          return await getUsers(userId, env, corsHeaders);
        }
  
        if (path === '/api/conversations' && method === 'GET') {
          return await getConversations(userId, env, corsHeaders);
        }
  
        if (path === '/api/conversations' && method === 'POST') {
          return await createConversation(request, userId, env, corsHeaders);
        }
  
        if (path.startsWith('/api/conversations/') && method === 'GET') {
          const conversationId = path.split('/')[3];
          return await getMessages(conversationId, userId, env, corsHeaders);
        }
  
        if (path.startsWith('/api/conversations/') && method === 'POST') {
          const conversationId = path.split('/')[3];
          return await sendMessage(request, conversationId, userId, env, corsHeaders);
        }
  
        if (path === '/api/messages/send' && method === 'POST') {
          return await sendDirectMessage(request, userId, env, corsHeaders);
        }
  
        if (path === '/api/typing' && method === 'POST') {
          return await setTypingIndicator(request, userId, env, corsHeaders);
        }
  
        if (path === '/api/online-status' && method === 'PUT') {
          return await updateOnlineStatus(userId, true, env, corsHeaders);
        }
  
        if (path === '/api/offline-status' && method === 'PUT') {
          return await updateOnlineStatus(userId, false, env, corsHeaders);
        }
  
        return new Response('Not Found', { status: 404, headers: corsHeaders });
  
      } catch (error) {
        console.error('API Error:', error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }
  };
  
  // Get current user info
  async function getUserInfo(userId, isLogin, env, corsHeaders) {
    try {
      const user = await env.DB.prepare('SELECT * FROM users WHERE encrypted_yw_id = ?').bind(userId).first();
      
      if (!user && isLogin) {
        // Create user if doesn't exist and is logged in
        const userInfo = await fetch('https://backend.youware.com/__user_info__').then(r => r.json());
        if (userInfo.code === 0) {
          const { encrypted_yw_id, photo_url, display_name } = userInfo.data;
          await env.DB.prepare('INSERT INTO users (encrypted_yw_id, display_name, photo_url, role) VALUES (?, ?, ?, ?)')
            .bind(encrypted_yw_id, display_name, photo_url, 'student').run();
          
          const newUser = await env.DB.prepare('SELECT * FROM users WHERE encrypted_yw_id = ?').bind(userId).first();
          return new Response(JSON.stringify({ success: true, user: newUser }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
      }
  
      return new Response(JSON.stringify({ success: true, user }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ success: false, error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
  
  // Get all users except current user
  async function getUsers(currentUserId, env, corsHeaders) {
    try {
      const users = await env.DB.prepare('SELECT * FROM users WHERE encrypted_yw_id != ? ORDER BY display_name')
        .bind(currentUserId).all();
      
      return new Response(JSON.stringify({ success: true, users: users.results }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ success: false, error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
  
  // Get user conversations
  async function getConversations(userId, env, corsHeaders) {
    try {
      const conversations = await env.DB.prepare(`
        SELECT DISTINCT c.*, 
               MAX(m.created_at) as last_message_time,
               COUNT(m.id) as message_count,
               u.display_name as other_user_name,
               u.photo_url as other_user_avatar
        FROM conversations c
        JOIN conversation_participants cp ON c.id = cp.conversation_id
        LEFT JOIN messages m ON c.id = m.conversation_id
        LEFT JOIN conversation_participants cp2 ON c.id = cp2.conversation_id AND cp2.user_id != ?
        LEFT JOIN users u ON cp2.user_id = u.encrypted_yw_id
        WHERE cp.user_id = ?
        GROUP BY c.id
        ORDER BY last_message_time DESC NULLS LAST
      `).bind(userId, userId).all();
  
      return new Response(JSON.stringify({ success: true, conversations: conversations.results }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ success: false, error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
  
  // Create new conversation
  async function createConversation(request, userId, env, corsHeaders) {
    try {
      const { participantId, type = 'direct' } = await request.json();
  
      // Check if conversation already exists
      const existingConv = await env.DB.prepare(`
        SELECT c.id FROM conversations c
        JOIN conversation_participants cp1 ON c.id = cp1.conversation_id AND cp1.user_id = ?
        JOIN conversation_participants cp2 ON c.id = cp2.conversation_id AND cp2.user_id = ?
        WHERE c.type = 'direct'
      `).bind(userId, participantId).first();
  
      if (existingConv) {
        return new Response(JSON.stringify({ success: true, conversationId: existingConv.id }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
  
      // Create new conversation
      const result = await env.DB.prepare('INSERT INTO conversations (type, created_by) VALUES (?, ?)')
        .bind(type, userId).run();
      
      const conversationId = result.meta.last_row_id;
  
      // Add participants
      await env.DB.batch([
        env.DB.prepare('INSERT INTO conversation_participants (conversation_id, user_id) VALUES (?, ?)')
          .bind(conversationId, userId),
        env.DB.prepare('INSERT INTO conversation_participants (conversation_id, user_id) VALUES (?, ?)')
          .bind(conversationId, participantId)
      ]);
  
      return new Response(JSON.stringify({ success: true, conversationId }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ success: false, error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
  
  // Get messages for a conversation
  async function getMessages(conversationId, userId, env, corsHeaders) {
    try {
      // Check if user is participant
      const isParticipant = await env.DB.prepare(`
        SELECT 1 FROM conversation_participants 
        WHERE conversation_id = ? AND user_id = ?
      `).bind(conversationId, userId).first();
  
      if (!isParticipant) {
        return new Response(JSON.stringify({ success: false, error: 'Access denied' }), {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
  
      const messages = await env.DB.prepare(`
        SELECT m.*, u.display_name, u.photo_url
        FROM messages m
        JOIN users u ON m.sender_id = u.encrypted_yw_id
        WHERE m.conversation_id = ?
        ORDER BY m.created_at ASC
      `).bind(conversationId).all();
  
      return new Response(JSON.stringify({ success: true, messages: messages.results }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ success: false, error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
  
  // Send message
  async function sendMessage(request, conversationId, userId, env, corsHeaders) {
    try {
      const { content, messageType = 'text' } = await request.json();
  
      // Check if user is participant
      const isParticipant = await env.DB.prepare(`
        SELECT 1 FROM conversation_participants 
        WHERE conversation_id = ? AND user_id = ?
      `).bind(conversationId, userId).first();
  
      if (!isParticipant) {
        return new Response(JSON.stringify({ success: false, error: 'Access denied' }), {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
  
      const result = await env.DB.prepare(`
        INSERT INTO messages (conversation_id, sender_id, content, message_type)
        VALUES (?, ?, ?, ?)
      `).bind(conversationId, userId, content, messageType).run();
  
      const messageId = result.meta.last_row_id;
  
      // Get the message with user info
      const message = await env.DB.prepare(`
        SELECT m.*, u.display_name, u.photo_url
        FROM messages m
        JOIN users u ON m.sender_id = u.encrypted_yw_id
        WHERE m.id = ?
      `).bind(messageId).first();
  
      return new Response(JSON.stringify({ success: true, message }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ success: false, error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
  
  // Send direct message (creates conversation if needed)
  async function sendDirectMessage(request, userId, env, corsHeaders) {
    try {
      const { recipientId, content, messageType = 'text' } = await request.json();
  
      // Check if conversation exists
      let conversationId = await env.DB.prepare(`
        SELECT c.id FROM conversations c
        JOIN conversation_participants cp1 ON c.id = cp1.conversation_id AND cp1.user_id = ?
        JOIN conversation_participants cp2 ON c.id = cp2.conversation_id AND cp2.user_id = ?
        WHERE c.type = 'direct'
      `).bind(userId, recipientId).first();
  
      if (!conversationId) {
        // Create new conversation
        const result = await env.DB.prepare('INSERT INTO conversations (type, created_by) VALUES (?, ?)')
          .bind('direct', userId).run();
        conversationId = { id: result.meta.last_row_id };
  
        // Add participants
        await env.DB.batch([
          env.DB.prepare('INSERT INTO conversation_participants (conversation_id, user_id) VALUES (?, ?)')
            .bind(conversationId.id, userId),
          env.DB.prepare('INSERT INTO conversation_participants (conversation_id, user_id) VALUES (?, ?)')
            .bind(conversationId.id, recipientId)
        ]);
      } else {
        conversationId = conversationId.id;
      }
  
      // Send message
      const messageResult = await env.DB.prepare(`
        INSERT INTO messages (conversation_id, sender_id, content, message_type)
        VALUES (?, ?, ?, ?)
      `).bind(conversationId, userId, content, messageType).run();
  
      const messageId = messageResult.meta.last_row_id;
  
      // Get the message with user info
      const message = await env.DB.prepare(`
        SELECT m.*, u.display_name, u.photo_url
        FROM messages m
        JOIN users u ON m.sender_id = u.encrypted_yw_id
        WHERE m.id = ?
      `).bind(messageId).first();
  
      return new Response(JSON.stringify({ success: true, message, conversationId }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ success: false, error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
  
  // Set typing indicator
  async function setTypingIndicator(request, userId, env, corsHeaders) {
    try {
      const { conversationId, isTyping } = await request.json();
  
      // Remove old typing indicators for this user
      await env.DB.prepare('DELETE FROM typing_indicators WHERE user_id = ?').bind(userId).run();
  
      // Add new typing indicator if typing
      if (isTyping) {
        await env.DB.prepare(`
          INSERT INTO typing_indicators (conversation_id, user_id, is_typing)
          VALUES (?, ?, ?)
        `).bind(conversationId, userId, 1).run();
      }
  
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ success: false, error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
  
  // Update online status
  async function updateOnlineStatus(userId, isOnline, env, corsHeaders) {
    try {
      await env.DB.prepare(`
        UPDATE users SET is_online = ?, last_seen = ?
        WHERE encrypted_yw_id = ?
      `).bind(isOnline ? 1 : 0, new Date().toISOString(), userId).run();
  
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ success: false, error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }