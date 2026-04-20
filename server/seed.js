const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");
const Workspace = require("./models/Workspace");
const Task = require("./models/Task");
const Comment = require("./models/Comment");

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to DB");

  // Clear existing data
  await User.deleteMany();
  await Workspace.deleteMany();
  await Task.deleteMany();
  await Comment.deleteMany();
  console.log("Cleared existing data");

  // Create Users
  const salt = await bcrypt.genSalt(10);
  const users = await User.insertMany([
    { name: "Afra NK", email: "afra@demo.com", password: await bcrypt.hash("123456", salt) },
    { name: "Mohammed Fayas", email: "fayas@demo.com", password: await bcrypt.hash("123456", salt) },
    { name: "Sara Ahmed", email: "sara@demo.com", password: await bcrypt.hash("123456", salt) },
  ]);
  console.log("Users created ✅");

  const [afra, fayas, sara] = users;

  // Create Workspace
  const workspace = await Workspace.create({
    name: "Real Estate App",
    owner: afra._id,
    members: [
      { user: afra._id, role: "admin" },
      { user: fayas._id, role: "member" },
      { user: sara._id, role: "member" },
    ],
  });
  console.log("Workspace created ✅");

  // Create Tasks
  const tasks = await Task.insertMany([
    {
      title: "Design Landing Page",
      description: "Create a modern landing page with property listings",
      status: "In Progress",
      priority: "High",
      user: afra._id,
      workspace: workspace._id,
      assignedTo: fayas._id,
    },
    {
      title: "Setup Authentication",
      description: "Implement JWT login and register flow",
      status: "Completed",
      priority: "High",
      user: afra._id,
      workspace: workspace._id,
      assignedTo: afra._id,
    },
    {
      title: "Property Search Feature",
      description: "Add search and filter for properties by location and price",
      status: "Pending",
      priority: "Medium",
      user: afra._id,
      workspace: workspace._id,
      assignedTo: sara._id,
    },
    {
      title: "Google Maps Integration",
      description: "Show property locations on map",
      status: "Pending",
      priority: "Medium",
      user: afra._id,
      workspace: workspace._id,
      assignedTo: fayas._id,
    },
    {
      title: "Mobile Responsive UI",
      description: "Make all pages mobile friendly",
      status: "In Progress",
      priority: "Low",
      user: afra._id,
      workspace: workspace._id,
      assignedTo: sara._id,
    },
  ]);
  console.log("Tasks created ✅");

  // Create Comments + Replies
  await Comment.insertMany([
    {
      text: "Started working on the design, will share mockup tomorrow",
      task: tasks[0]._id,
      user: fayas._id,
      workspace: workspace._id,
      replies: [
        { text: "Great! Please use Tailwind CSS", user: afra._id },
        { text: "Sure, will do!", user: fayas._id },
      ],
    },
    {
      text: "Authentication is complete and tested",
      task: tasks[1]._id,
      user: afra._id,
      workspace: workspace._id,
      replies: [
        { text: "Excellent work!", user: sara._id },
      ],
    },
    {
      text: "Working on the search filters, need clarification on price range",
      task: tasks[2]._id,
      user: sara._id,
      workspace: workspace._id,
      replies: [
        { text: "Price range should be AED 500K to AED 5M", user: afra._id },
        { text: "Got it, will implement accordingly", user: sara._id },
      ],
    },
  ]);
  console.log("Comments + Replies created ✅");

  console.log("\n🎉 Seed complete!");
  console.log("Login credentials:");
  console.log("afra@demo.com / 123456");
  console.log("fayas@demo.com / 123456");
  console.log("sara@demo.com / 123456");

  mongoose.disconnect();
};

seed().catch((err) => {
  console.error(err);
  mongoose.disconnect();
});