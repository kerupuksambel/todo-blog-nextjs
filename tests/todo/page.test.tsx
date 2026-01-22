import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TodoPage from '@/app/todo/page';

// Mock localStorage
const localStorageMock: { [key: string]: string } = {};

beforeEach(() => {
  // Clear all mocks before each test
  jest.clearAllMocks();
  
  // Clear localStorage mock
  Object.keys(localStorageMock).forEach(key => delete localStorageMock[key]);
  
  // Setup localStorage mock implementation
  Storage.prototype.getItem = jest.fn((key: string) => localStorageMock[key] || null);
  Storage.prototype.setItem = jest.fn((key: string, value: string) => {
    localStorageMock[key] = value;
  });
  Storage.prototype.removeItem = jest.fn((key: string) => {
    delete localStorageMock[key];
  });
  Storage.prototype.clear = jest.fn(() => {
    Object.keys(localStorageMock).forEach(key => delete localStorageMock[key]);
  });
});

describe('TodoPage - Add Task Functionality', () => {
  test('(a) when a task is added, it is added to the table and localStorage', async () => {
    const user = userEvent.setup();
    render(<TodoPage />);

    // Open the dialog
    const addButton = screen.getByRole('button', { name: /add new task/i });
    await user.click(addButton);

    // Wait for dialog to open and find input
    const input = await screen.findByPlaceholderText(/task title/i);
    
    // Type a new task
    const taskTitle = 'Buy groceries';
    await user.type(input, taskTitle);

    // Click the Add Task button in the dialog
    const dialogAddButton = screen.getByRole('button', { name: /^add task$/i });
    await user.click(dialogAddButton);

    // Verify task appears in the table
    await waitFor(() => {
      expect(screen.getByText(taskTitle)).toBeInTheDocument();
    });

    // Verify task is saved to localStorage
    expect(localStorage.setItem).toHaveBeenCalled();
    const storedData = localStorageMock['todo-tasks'];
    expect(storedData).toBeDefined();
    
    const tasks = JSON.parse(storedData);
    expect(tasks).toHaveLength(1);
    expect(tasks[0].title).toBe(taskTitle);
    expect(tasks[0].completed).toBe(false);
    expect(tasks[0].id).toBeDefined();
  });

  test('multiple tasks can be added and stored', async () => {
    const user = userEvent.setup();
    render(<TodoPage />);

    const tasksToAdd = ['Task 1', 'Task 2', 'Task 3'];

    for (const taskTitle of tasksToAdd) {
      // Open dialog
      const addButton = screen.getByRole('button', { name: /add new task/i });
      await user.click(addButton);

      // Add task
      const input = await screen.findByPlaceholderText(/task title/i);
      await user.type(input, taskTitle);

      const dialogAddButton = screen.getByRole('button', { name: /^add task$/i });
      await user.click(dialogAddButton);

      // Wait for task to appear
      await waitFor(() => {
        expect(screen.getByText(taskTitle)).toBeInTheDocument();
      });
    }

    // Verify all tasks are in localStorage
    const storedData = localStorageMock['todo-tasks'];
    const tasks = JSON.parse(storedData);
    expect(tasks).toHaveLength(3);
    
    tasksToAdd.forEach((taskTitle, index) => {
      expect(tasks[index].title).toBe(taskTitle);
    });
  });

  test('empty task title is not added', async () => {
    const user = userEvent.setup();
    render(<TodoPage />);

    // Open dialog
    const addButton = screen.getByRole('button', { name: /add new task/i });
    await user.click(addButton);

    // Try to add empty task
    const dialogAddButton = screen.getByRole('button', { name: /^add task$/i });
    await user.click(dialogAddButton);

    // Verify no task is added to localStorage
    const storedData = localStorageMock['todo-tasks'];
    if (storedData) {
      const tasks = JSON.parse(storedData);
      expect(tasks).toHaveLength(0);
    }
  });
});

describe('TodoPage - Delete Task Functionality', () => {
  test('(b) when a task is deleted, it is removed from the table and localStorage', async () => {
    const user = userEvent.setup();
    
    // Pre-populate localStorage with a task
    const initialTasks = [
      { id: '1', title: 'Task to delete', completed: false },
      { id: '2', title: 'Task to keep', completed: false },
    ];
    localStorageMock['todo-tasks'] = JSON.stringify(initialTasks);

    render(<TodoPage />);

    // Wait for tasks to load
    await waitFor(() => {
      expect(screen.getByText('Task to delete')).toBeInTheDocument();
      expect(screen.getByText('Task to keep')).toBeInTheDocument();
    });

    // Find and click the delete button for the first task
    const deleteButtons = screen.getAllByRole('button', { name: '' });
    const trashButtons = deleteButtons.filter(button => 
      button.querySelector('svg')
    );
    
    await user.click(trashButtons[0]);

    // Verify task is removed from the table
    await waitFor(() => {
      expect(screen.queryByText('Task to delete')).not.toBeInTheDocument();
    });

    // Verify task is still in the table
    expect(screen.getByText('Task to keep')).toBeInTheDocument();

    // Verify localStorage is updated correctly
    const storedData = localStorageMock['todo-tasks'];
    const tasks = JSON.parse(storedData);
    expect(tasks).toHaveLength(1);
    expect(tasks[0].title).toBe('Task to keep');
  });

  test('all tasks can be deleted', async () => {
    const user = userEvent.setup();
    
    // Pre-populate localStorage with tasks
    const initialTasks = [
      { id: '1', title: 'Task 1', completed: false },
      { id: '2', title: 'Task 2', completed: false },
    ];
    localStorageMock['todo-tasks'] = JSON.stringify(initialTasks);

    render(<TodoPage />);

    // Wait for tasks to load
    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
    });

    // Delete all tasks
    for (let i = 0; i < initialTasks.length; i++) {
      const deleteButtons = screen.getAllByRole('button', { name: '' });
      const trashButtons = deleteButtons.filter(button => 
        button.querySelector('svg')
      );
      
      if (trashButtons.length > 0) {
        await user.click(trashButtons[0]);
      }
    }

    // Verify "No tasks found" message appears
    await waitFor(() => {
      expect(screen.getByText(/no tasks found/i)).toBeInTheDocument();
    });

    // Verify localStorage is empty
    const storedData = localStorageMock['todo-tasks'];
    const tasks = JSON.parse(storedData);
    expect(tasks).toHaveLength(0);
  });
});

describe('TodoPage - Toggle Task Status Functionality', () => {
  test('(c) when a task is marked as completed, the task status is changed in state and localStorage', async () => {
    const user = userEvent.setup();
    
    // Pre-populate localStorage with an incomplete task
    const initialTasks = [
      { id: '1', title: 'Task to complete', completed: false },
    ];
    localStorageMock['todo-tasks'] = JSON.stringify(initialTasks);

    render(<TodoPage />);

    // Wait for task to load
    await waitFor(() => {
      expect(screen.getByText('Task to complete')).toBeInTheDocument();
    });

    // Find the checkbox
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();

    // Click the checkbox to mark as completed
    await user.click(checkbox);

    // Verify checkbox is checked
    await waitFor(() => {
      expect(checkbox).toBeChecked();
    });

    // Verify localStorage reflects the change
    const storedData = localStorageMock['todo-tasks'];
    const tasks = JSON.parse(storedData);
    expect(tasks[0].completed).toBe(true);

    // Verify the task title has line-through styling
    const taskElement = screen.getByText('Task to complete');
    expect(taskElement).toHaveClass('line-through');
  });

  test('when a completed task is unchecked, the status changes back to incomplete', async () => {
    const user = userEvent.setup();
    
    // Pre-populate localStorage with a completed task
    const initialTasks = [
      { id: '1', title: 'Completed task', completed: true },
    ];
    localStorageMock['todo-tasks'] = JSON.stringify(initialTasks);

    render(<TodoPage />);

    // Wait for task to load
    await waitFor(() => {
      expect(screen.getByText('Completed task')).toBeInTheDocument();
    });

    // Find the checkbox
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();

    // Click the checkbox to mark as incomplete
    await user.click(checkbox);

    // Verify checkbox is unchecked
    await waitFor(() => {
      expect(checkbox).not.toBeChecked();
    });

    // Verify localStorage reflects the change
    const storedData = localStorageMock['todo-tasks'];
    const tasks = JSON.parse(storedData);
    expect(tasks[0].completed).toBe(false);

    // Verify the task title does not have line-through styling
    const taskElement = screen.getByText('Completed task');
    expect(taskElement).not.toHaveClass('line-through');
  });

  test('multiple tasks can have different completion states', async () => {
    const user = userEvent.setup();
    
    // Pre-populate localStorage with multiple tasks
    const initialTasks = [
      { id: '1', title: 'Task 1', completed: false },
      { id: '2', title: 'Task 2', completed: false },
      { id: '3', title: 'Task 3', completed: false },
    ];
    localStorageMock['todo-tasks'] = JSON.stringify(initialTasks);

    render(<TodoPage />);

    // Wait for tasks to load
    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
    });

    // Get all checkboxes
    const checkboxes = screen.getAllByRole('checkbox');

    // Mark first and third tasks as completed
    await user.click(checkboxes[0]);
    await user.click(checkboxes[2]);

    // Verify localStorage has correct states
    await waitFor(() => {
      const storedData = localStorageMock['todo-tasks'];
      const tasks = JSON.parse(storedData);
      expect(tasks[0].completed).toBe(true);
      expect(tasks[1].completed).toBe(false);
      expect(tasks[2].completed).toBe(true);
    });
  });
});

describe('TodoPage - Integration Tests', () => {
  test('complete workflow: add task, mark as complete, then delete', async () => {
    const user = userEvent.setup();
    render(<TodoPage />);

    // Add a task
    const addButton = screen.getByRole('button', { name: /add new task/i });
    await user.click(addButton);

    const input = await screen.findByPlaceholderText(/task title/i);
    await user.type(input, 'Integration test task');

    const dialogAddButton = screen.getByRole('button', { name: /^add task$/i });
    await user.click(dialogAddButton);

    // Verify task is added
    await waitFor(() => {
      expect(screen.getByText('Integration test task')).toBeInTheDocument();
    });

    // Mark as complete
    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    await waitFor(() => {
      expect(checkbox).toBeChecked();
    });

    // Verify in localStorage
    let storedData = localStorageMock['todo-tasks'];
    let tasks = JSON.parse(storedData);
    expect(tasks[0].completed).toBe(true);

    // Delete the task
    const deleteButtons = screen.getAllByRole('button', { name: '' });
    const trashButtons = deleteButtons.filter(button => 
      button.querySelector('svg')
    );
    await user.click(trashButtons[0]);

    // Verify task is deleted
    await waitFor(() => {
      expect(screen.queryByText('Integration test task')).not.toBeInTheDocument();
    });

    // Verify localStorage is empty
    storedData = localStorageMock['todo-tasks'];
    tasks = JSON.parse(storedData);
    expect(tasks).toHaveLength(0);
  });

  test('localStorage persists across component remounts', async () => {
    const user = userEvent.setup();
    
    // First render - add a task
    const { unmount } = render(<TodoPage />);

    const addButton = screen.getByRole('button', { name: /add new task/i });
    await user.click(addButton);

    const input = await screen.findByPlaceholderText(/task title/i);
    await user.type(input, 'Persistent task');

    const dialogAddButton = screen.getByRole('button', { name: /^add task$/i });
    await user.click(dialogAddButton);

    await waitFor(() => {
      expect(screen.getByText('Persistent task')).toBeInTheDocument();
    });

    // Unmount component
    unmount();

    // Re-render component
    render(<TodoPage />);

    // Verify task is still there
    await waitFor(() => {
      expect(screen.getByText('Persistent task')).toBeInTheDocument();
    });
  });
});
