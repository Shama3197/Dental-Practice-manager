const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🤖 Dental Practice Manager Development Automation\n');

class DevAutomation {
  constructor() {
    this.processes = [];
    this.isRunning = false;
  }

  // Check if ports are available
  async checkPorts() {
    const ports = [5000, 5173];
    console.log('🔍 Checking port availability...');
    
    for (const port of ports) {
      try {
        const isInUse = await this.isPortInUse(port);
        if (isInUse) {
          console.log(`⚠️  Port ${port} is in use`);
        } else {
          console.log(`✅ Port ${port} is available`);
        }
      } catch (error) {
        console.log(`❌ Error checking port ${port}: ${error.message}`);
      }
    }
  }

  isPortInUse(port) {
    return new Promise((resolve) => {
      const net = require('net');
      const server = net.createServer();
      
      server.listen(port, () => {
        server.once('close', () => resolve(false));
        server.close();
      });
      
      server.on('error', () => resolve(true));
    });
  }

  // Install dependencies
  async installDependencies() {
    console.log('📦 Installing dependencies...');
    
    const commands = [
      { cmd: 'npm', args: ['install'], cwd: '.' },
      { cmd: 'npm', args: ['install'], cwd: './tracker-backend' },
      { cmd: 'npm', args: ['install'], cwd: './tracker-frontend' }
    ];

    for (const command of commands) {
      try {
        await this.runCommand(command.cmd, command.args, command.cwd);
        console.log(`✅ Dependencies installed in ${command.cwd}`);
      } catch (error) {
        console.error(`❌ Failed to install dependencies in ${command.cwd}: ${error.message}`);
      }
    }
  }

  // Run linting
  async runLinting() {
    console.log('🔍 Running linting...');
    
    try {
      await this.runCommand('npm', ['run', 'lint'], '.');
      console.log('✅ Linting passed');
    } catch (error) {
      console.log('⚠️  Linting issues found. Run "npm run lint:fix" to auto-fix');
    }
  }

  // Start development servers
  async startDevServers() {
    if (this.isRunning) {
      console.log('⚠️  Servers are already running');
      return;
    }

    console.log('🚀 Starting development servers...');
    
    // Start backend
    const backend = spawn('npm', ['run', 'dev'], {
      cwd: './tracker-backend',
      stdio: 'pipe',
      shell: true
    });

    backend.stdout.on('data', (data) => {
      console.log(`🔧 Backend: ${data.toString().trim()}`);
    });

    backend.stderr.on('data', (data) => {
      console.error(`❌ Backend Error: ${data.toString().trim()}`);
    });

    // Start frontend
    const frontend = spawn('npm', ['run', 'dev'], {
      cwd: './tracker-frontend',
      stdio: 'pipe',
      shell: true
    });

    frontend.stdout.on('data', (data) => {
      console.log(`🎨 Frontend: ${data.toString().trim()}`);
    });

    frontend.stderr.on('data', (data) => {
      console.error(`❌ Frontend Error: ${data.toString().trim()}`);
    });

    this.processes.push(backend, frontend);
    this.isRunning = true;

    // Wait for servers to start
    setTimeout(() => {
      this.checkHealth();
    }, 10000);

    // Handle process termination
    process.on('SIGINT', () => this.cleanup());
    process.on('SIGTERM', () => this.cleanup());
  }

  // Check system health
  async checkHealth() {
    console.log('🏥 Checking system health...');
    
    try {
      await this.runCommand('npm', ['run', 'health-check'], '.');
    } catch (error) {
      console.log('⚠️  Health check failed, but servers may still be starting...');
    }
  }

  // Run tests
  async runTests() {
    console.log('🧪 Running tests...');
    
    try {
      await this.runCommand('npm', ['run', 'test'], '.');
      console.log('✅ All tests passed');
    } catch (error) {
      console.log('❌ Some tests failed');
    }
  }

  // Build project
  async buildProject() {
    console.log('🏗️  Building project...');
    
    try {
      await this.runCommand('npm', ['run', 'build'], '.');
      console.log('✅ Build completed successfully');
    } catch (error) {
      console.log('❌ Build failed');
    }
  }

  // Clean project
  async cleanProject() {
    console.log('🧹 Cleaning project...');
    
    try {
      await this.runCommand('npm', ['run', 'clean'], '.');
      console.log('✅ Project cleaned');
    } catch (error) {
      console.log('❌ Clean failed');
    }
  }

  // Run command helper
  runCommand(command, args, cwd) {
    return new Promise((resolve, reject) => {
      const child = spawn(command, args, {
        cwd,
        stdio: 'inherit',
        shell: true
      });

      child.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Command failed with code ${code}`));
        }
      });

      child.on('error', reject);
    });
  }

  // Cleanup processes
  cleanup() {
    console.log('\n🛑 Shutting down servers...');
    
    this.processes.forEach(process => {
      if (!process.killed) {
        process.kill('SIGTERM');
      }
    });
    
    this.isRunning = false;
    process.exit(0);
  }

  // Show help
  showHelp() {
    console.log(`
🤖 Development Automation Commands:

  npm run dev              # Start development servers
  npm run build            # Build for production
  npm run test             # Run all tests
  npm run lint             # Run linting
  npm run lint:fix         # Fix linting issues
  npm run clean            # Clean project
  npm run health-check     # Check system health
  npm run setup            # Initial setup

🔧 Manual Commands:
  cd tracker-backend && npm run dev    # Start backend only
  cd tracker-frontend && npm run dev   # Start frontend only

📊 Monitoring:
  http://localhost:5000/api/health     # Backend health
  http://localhost:5173                # Frontend app

🐛 Troubleshooting:
  npm run clean && npm run install:all # Reset dependencies
  npx kill-port 5000 5173              # Kill port conflicts
    `);
  }
}

// Main execution
async function main() {
  const automation = new DevAutomation();
  const command = process.argv[2];

  try {
    switch (command) {
      case 'start':
        await automation.checkPorts();
        await automation.startDevServers();
        break;
      case 'install':
        await automation.installDependencies();
        break;
      case 'lint':
        await automation.runLinting();
        break;
      case 'test':
        await automation.runTests();
        break;
      case 'build':
        await automation.buildProject();
        break;
      case 'clean':
        await automation.cleanProject();
        break;
      case 'health':
        await automation.checkHealth();
        break;
      case 'help':
      default:
        automation.showHelp();
        break;
    }
  } catch (error) {
    console.error('❌ Automation failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = DevAutomation; 