import React from 'react';
import { KanbanBoard } from './components/KanbanBoard';

function App() {
  return (
    <div className="App">
      <h1 className="text-2xl font-bold text-center mt-4">Kanban-доска</h1>
      <KanbanBoard />
    </div>
  );
}

export default App;
