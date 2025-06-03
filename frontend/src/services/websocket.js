class WebSocketService {
    constructor() {
        this.socket = null;
        this.messageHandlers = new Set();
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 1000;
        this.currentChatId = null;
        this.isConnecting = false;
        this.connectionTimeout = null;
        this.messageQueue = [];
        this.connectionPromise = null;
    }

    async connectToChat(chatId) {
        // If we're already connected to this chat, no need to reconnect
        if (this.socket && this.socket.readyState === WebSocket.OPEN && this.currentChatId === chatId) {
            console.log('Already connected to this chat');
            return;
        }

        // If there's an ongoing connection, wait for it to complete
        if (this.connectionPromise) {
            console.log('Waiting for existing connection to complete...');
            await this.connectionPromise;
            // If we're now connected to the desired chat, return
            if (this.socket && this.socket.readyState === WebSocket.OPEN && this.currentChatId === chatId) {
                return;
            }
        }

        // Start new connection
        this.connectionPromise = this._connect(chatId);
        try {
            await this.connectionPromise;
        } finally {
            this.connectionPromise = null;
        }
    }

    async _connect(chatId) {
        this.isConnecting = true;
        this.currentChatId = chatId;

        // Clear any existing connection timeout
        if (this.connectionTimeout) {
            clearTimeout(this.connectionTimeout);
        }

        // Close existing connection if any
        if (this.socket) {
            try {
                this.socket.close(1000, 'Switching chats');
            } catch (error) {
                console.error('Error closing existing connection:', error);
            }
            this.socket = null;
        }

        return new Promise((resolve, reject) => {
            try {
                console.log(`Connecting to chat: ${chatId}`);
                this.socket = new WebSocket(`ws://localhost:8000/api/ws/chat/${chatId}`);

                // Set connection timeout
                this.connectionTimeout = setTimeout(() => {
                    if (this.socket && this.socket.readyState !== WebSocket.OPEN) {
                        console.log('Connection timeout, retrying...');
                        this.socket.close();
                        this.handleReconnect();
                        reject(new Error('Connection timeout'));
                    }
                }, 5000);

                this.socket.onopen = () => {
                    console.log('WebSocket connected successfully');
                    this.isConnecting = false;
                    this.reconnectAttempts = 0;
                    this.reconnectDelay = 1000;
                    if (this.connectionTimeout) {
                        clearTimeout(this.connectionTimeout);
                    }
                    // Process any queued messages
                    this._processMessageQueue();
                    resolve();
                };

                this.socket.onmessage = (event) => {
                    try {
                        const data = JSON.parse(event.data);
                        if (data.type === 'ping') {
                            this.socket.send(JSON.stringify({ type: 'pong' }));
                        } else {
                            this.messageHandlers.forEach(handler => handler(data));
                        }
                    } catch (error) {
                        console.error('Error parsing WebSocket message:', error);
                    }
                };

                this.socket.onerror = (error) => {
                    console.error('WebSocket error:', error);
                    this.isConnecting = false;
                    if (this.connectionTimeout) {
                        clearTimeout(this.connectionTimeout);
                    }
                    this.handleReconnect();
                    reject(error);
                };

                this.socket.onclose = (event) => {
                    console.log('WebSocket closed:', event.code, event.reason);
                    this.isConnecting = false;
                    if (this.connectionTimeout) {
                        clearTimeout(this.connectionTimeout);
                    }
                    
                    if (event.code !== 1000 && event.code !== 1001) {
                        this.handleReconnect();
                    }
                };
            } catch (error) {
                console.error('Error creating WebSocket:', error);
                this.isConnecting = false;
                if (this.connectionTimeout) {
                    clearTimeout(this.connectionTimeout);
                }
                this.handleReconnect();
                reject(error);
            }
        });
    }

    handleReconnect() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.error('Max reconnection attempts reached');
            return;
        }

        this.reconnectAttempts++;
        const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
        
        console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        
        setTimeout(() => {
            if (this.currentChatId) {
                this.connectToChat(this.currentChatId);
            }
        }, delay);
    }

    sendMessage(message) {
        if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
            console.log('WebSocket not connected, queueing message');
            this.messageQueue.push(message);
            // Attempt to reconnect if we have a current chat
            if (this.currentChatId) {
                this.connectToChat(this.currentChatId);
            }
            return;
        }

        try {
            this.socket.send(JSON.stringify(message));
        } catch (error) {
            console.error('Error sending message:', error);
            this.messageQueue.push(message);
            this.handleReconnect();
        }
    }

    _processMessageQueue() {
        while (this.messageQueue.length > 0 && this.socket && this.socket.readyState === WebSocket.OPEN) {
            const message = this.messageQueue.shift();
            try {
                this.socket.send(JSON.stringify(message));
            } catch (error) {
                console.error('Error sending queued message:', error);
                this.messageQueue.unshift(message); // Put the message back at the start of the queue
                break;
            }
        }
    }

    addMessageHandler(handler) {
        this.messageHandlers.add(handler);
    }

    removeMessageHandler(handler) {
        this.messageHandlers.delete(handler);
    }

    disconnect() {
        if (this.socket) {
            try {
                this.socket.close(1000, 'Client disconnecting');
            } catch (error) {
                console.error('Error closing WebSocket:', error);
            }
            this.socket = null;
        }
        if (this.connectionTimeout) {
            clearTimeout(this.connectionTimeout);
        }
        this.currentChatId = null;
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.messageQueue = [];
        this.connectionPromise = null;
    }
}

export const websocketService = new WebSocketService(); 