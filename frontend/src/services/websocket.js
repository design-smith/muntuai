class WebSocketService {
    constructor() {
        this.socket = null;
        this.messageHandlers = new Set();
        this.currentChatId = null;
    }

    connectToChat(chatId) {
        this.disconnect();
        this.currentChatId = chatId;
        const wsUrl = `ws://localhost:8000/api/ws/chat/${chatId}`;
        this.socket = new WebSocket(wsUrl);

        this.socket.onopen = () => {
            console.log('WebSocket connected to chat', chatId);
        };

        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.messageHandlers.forEach(handler => handler(data));
            console.log("Received message:", data);
        };

        this.socket.onclose = () => {
            console.log('WebSocket disconnected from chat', chatId);
        };

        this.socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    }

    sendMessage(content) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({
                content,
                time: new Date().toISOString()
            }));
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
            this.socket.close();
            this.socket = null;
        }
    }
}

export const websocketService = new WebSocketService(); 