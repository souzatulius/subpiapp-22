import { Chart, registerables } from 'chart.js';

// Register all Chart.js components (scales, controllers, plugins, etc.)
Chart.register(...registerables);

// This ensures all features like the Filler plugin are available
