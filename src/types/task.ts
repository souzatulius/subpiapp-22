
export type TaskStatus = 'overdue' | 'warning' | 'ok';

export interface Task {
  id: string;
  title: string;
  dueDate: Date;
  status: TaskStatus;
  type: 'demand' | 'note' | 'task';
  url: string;
}

export interface DemandTask {
  id: string;
  title: string;
  dueDate: Date;
  status: string; // Original status that needs to be mapped
  type: 'demand';
  url: string;
}

// Helper function to map any string status to TaskStatus
export function mapStatusToTaskStatus(status: string): TaskStatus {
  if (status === 'atrasado' || status === 'em_atraso' || status === 'overdue') {
    return 'overdue';
  } else if (status === 'pendente' || status === 'em_andamento' || status === 'warning') {
    return 'warning';
  } else {
    return 'ok';
  }
}

// Helper function to convert a DemandTask to a Task with valid status
export function convertToTask(item: DemandTask | Task): Task {
  if ('status' in item && typeof item.status === 'string' && !['overdue', 'warning', 'ok'].includes(item.status)) {
    return {
      ...item,
      status: mapStatusToTaskStatus(item.status)
    };
  }
  return item as Task;
}

// Helper to convert an array of mixed tasks to valid Task[]
export function convertTasksArray(items: (DemandTask | Task)[]): Task[] {
  return items.map(convertToTask);
}
