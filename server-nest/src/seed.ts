import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getModelToken } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const userModel = app.get(getModelToken('User'));
  const workspaceModel = app.get(getModelToken('Workspace'));
  const taskModel = app.get(getModelToken('Task'));
  const commentModel = app.get(getModelToken('Comment'));

  // Clear
  await userModel.deleteMany({});
  await workspaceModel.deleteMany({});
  await taskModel.deleteMany({});
  await commentModel.deleteMany({});
  console.log('Cleared ✅');

  // Users
  const salt = await bcrypt.genSalt(10);
  const users = await userModel.insertMany([
    { name: 'Afra NK', email: 'afra@demo.com', password: await bcrypt.hash('123456', salt) },
    { name: 'Mohammed Fayas', email: 'fayas@demo.com', password: await bcrypt.hash('123456', salt) },
    { name: 'Sara Ahmed', email: 'sara@demo.com', password: await bcrypt.hash('123456', salt) },
  ]);
  console.log('Users ✅');

  const [afra, fayas, sara] = users;

  // Workspace
  const workspace = await workspaceModel.create({
    name: 'Real Estate App',
    owner: afra._id,
    members: [
      { user: afra._id, role: 'admin' },
      { user: fayas._id, role: 'member' },
      { user: sara._id, role: 'member' },
    ],
  });
  console.log('Workspace ✅');

  // Tasks
  const tasks = await taskModel.insertMany([
    {
      title: 'Design Landing Page',
      description: 'Create modern landing page with property listings',
      status: 'In Progress',
      priority: 'High',
      user: afra._id,
      workspace: workspace._id,
      assignedTo: fayas._id,
    },
    {
      title: 'Setup Authentication',
      description: 'Implement JWT login and register flow',
      status: 'Completed',
      priority: 'High',
      user: afra._id,
      workspace: workspace._id,
      assignedTo: afra._id,
    },
    {
      title: 'Property Search Feature',
      description: 'Add search and filter for properties by location and price',
      status: 'Pending',
      priority: 'Medium',
      user: afra._id,
      workspace: workspace._id,
      assignedTo: sara._id,
    },
    {
      title: 'Google Maps Integration',
      description: 'Show property locations on map',
      status: 'Completed',
      priority: 'Medium',
      user: afra._id,
      workspace: workspace._id,
      assignedTo: fayas._id,
    },
    {
      title: 'Mobile Responsive UI',
      description: 'Make all pages mobile friendly',
      status: 'In Progress',
      priority: 'Low',
      user: afra._id,
      workspace: workspace._id,
      assignedTo: sara._id,
    },
  ]);
  console.log('Tasks ✅');

  // Comments
  await commentModel.insertMany([
    {
      text: 'Started working on the design, will share mockup tomorrow',
      task: tasks[0]._id,
      user: fayas._id,
      workspace: workspace._id,
      replies: [
        { text: 'Great! Please use Tailwind CSS', user: afra._id },
        { text: 'Sure, will do!', user: fayas._id },
      ],
    },
    {
      text: 'Authentication is complete and tested',
      task: tasks[1]._id,
      user: afra._id,
      workspace: workspace._id,
      replies: [
        { text: 'Excellent work!', user: sara._id },
      ],
    },
    {
      text: 'Need clarification on price range for search filters',
      task: tasks[2]._id,
      user: sara._id,
      workspace: workspace._id,
      replies: [
        { text: 'Price range: AED 500K to AED 5M', user: afra._id },
        { text: 'Got it, will implement!', user: sara._id },
      ],
    },
  ]);
  console.log('Comments ✅');

  console.log('\n🎉 Seed complete!');
  console.log('afra@demo.com / 123456');
  console.log('fayas@demo.com / 123456');
  console.log('sara@demo.com / 123456');

  await app.close();
}

seed().catch(console.error);