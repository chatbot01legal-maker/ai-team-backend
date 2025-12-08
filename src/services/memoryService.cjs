const fs = require('fs-extra');
const path = require('path');

const FILE = process.env.SESSION_STORE_PATH || path.join(__dirname, '../../memory/sessions.json');
fs.ensureFileSync(FILE);

class MemoryService {
  constructor() {
    try { this.store = fs.readJsonSync(FILE); } catch { this.store = {}; }
  }
  
  _flush() { 
    fs.writeJsonSync(FILE, this.store, { spaces: 2 }); 
  }
  
  getSession(ticketId) {
    if (!this.store[ticketId]) {
      this.store[ticketId] = { 
        ticketId, 
        events: [], 
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
    }
    return this.store[ticketId];
  }
  
  pushEvent(ticketId, event) {
    const s = this.getSession(ticketId);
    s.events.push({ 
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      timestamp: Date.now(), 
      ...event 
    });
    s.updatedAt = Date.now();
    this._flush();
  }
  
  getEvents(ticketId) {
    const session = this.getSession(ticketId);
    return session.events;
  }
}

module.exports = MemoryService;
