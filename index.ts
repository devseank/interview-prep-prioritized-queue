// src/index.ts

/**
 * PROBLEM STATEMENT:
 * Implement a thread-safe "Command Queue" with a priority mechanism.
 * Some commands (e.g., Emergency Shutdown) must jump to the front of the queue,
 * while others (e.g., Routine Speed Adjustment) are processed FIFO.
 *
 * SYSTEM CONTEXT:
 * A Distributed Setpoint Controller system where reliability and concurrency
 * in remote command execution are critical.
 */

/**
 * Command Priority Levels
 * HIGH: Immediate execution (e.g., Emergency Shutdown)
 * NORMAL: Standard operations (e.g., Set Speed)
 */
enum CommandPriority {
    HIGH = 1,
    NORMAL = 2,
}

/**
 * Command Interface
 * Defines the structure of a command sent to the controller.
 */
interface Command {
    id: string;
    type: string;
    payload: Record<string, any>; // Flexible payload for various command types
    priority: CommandPriority;
    timestamp: number; // Useful for strict FIFO within priority levels
}

/**
 * CommandQueue
 *
 * A priority-based queue implementation.
 *
 * ARCHITECTURAL NOTE:
 * In a traditional multi-threaded language (Go, Java, C++), we would need Mutexes here.
 * In Node.js (single-threaded event loop), operation atomicity is guaranteed for synchronous code.
 * However, if we introduce `Worker` threads or async race conditions, we need to be careful.
 *
 * For this implementation, assume we want to maintain O(1) enqueue/dequeue if possible,
 * or at least keep it very efficient.
 */
class CommandQueue {
    // TODO: Choose your internal data structure.
    // A single array? Two separate arrays? A linked list?
    // Think about the trade-off between complexity and performance.
    private _queue: Command[] = [];

    constructor() {
        // Initialization logic if needed
    }

    /**
     * Enqueue
     * Adds a command to the queue based on its priority.
     *
     * @param command - The command object to add
     */
    public enqueue(command: Command): void {
        this._queue.push(command);
        // TODO: Implement insertion logic.
        // Ensure HIGH priority items skip ahead of NORMAL priority items.
        // Ensure FIFO order is preserved within the same priority level.
    }

    /**
     * Dequeue
     * Removes and returns the next command to be processed.
     *
     * @returns The highest priority command available, or null if empty.
     */
    public dequeue(): Command | null {
        // TODO: Implement retrieval logic.
        // Should return HIGH priority first.
        return null;
    }

    /**
     * isEmpty
     * Helper to check if queue has items.
     */
    public isEmpty(): boolean {
        return this._queue.length === 0;
    }

    /**
     * Debugging utility to view current state
     */
    public getQueueState(): Command[] {
        return [...this._queue]; // Return a copy to avoid mutation by caller
    }
}

// --- Simulation / Testing Area ---

/**
 * Simulates the controller runtime.
 */
async function runSimulation() {
    console.log("Starting Controller Simulation...");

    const queue = new CommandQueue();

    // 1. Mock Commands
    const routineCmd: Command = {
        id: "cmd_001",
        type: "SET_SPEED",
        payload: { speed: 50 },
        priority: CommandPriority.NORMAL,
        timestamp: Date.now(),
    };

    const emergencyCmd: Command = {
        id: "cmd_002",
        type: "EMERGENCY_SHUTDOWN",
        payload: {},
        priority: CommandPriority.HIGH,
        timestamp: Date.now() + 100, // Created slightly later
    };

    const routineCmd2: Command = {
        id: "cmd_003",
        type: "UPDATE_CONFIG",
        payload: { version: "1.2" },
        priority: CommandPriority.NORMAL,
        timestamp: Date.now() + 200,
    };

    // 2. Enqueue in mixed order
    console.log(`[${new Date().toISOString()}] Enqueuing Routine Command 1...`);
    queue.enqueue(routineCmd);

    console.log(`[${new Date().toISOString()}] Enqueuing Routine Command 2...`);
    queue.enqueue(routineCmd2);

    console.log(`[${new Date().toISOString()}] Enqueuing EMERGENCY Command...`);
    queue.enqueue(emergencyCmd); // Should jump the line

    // 3. Process the Queue
    console.log("\n--- Processing Queue ---");
    while (!queue.isEmpty()) {
        const cmd = queue.dequeue();
        if (cmd) {
            console.log(`Executing: [${CommandPriority[cmd.priority]}] ${cmd.type} (ID: ${cmd.id})`);
        }
    }
}

// Run the simulation
runSimulation();