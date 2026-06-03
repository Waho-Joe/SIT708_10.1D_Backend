const Interest = require("../models/Interest");

const defaultInterests = [
  {
    name: "Algorithms",
    description: "Practice basic algorithm concepts.",
  },
  {
    name: "Data Structures",
    description: "Practice common data structure concepts.",
  },
  {
    name: "Web Development",
    description: "Practice basic web development concepts.",
  },
  {
    name: "Testing",
    description: "Practice software testing concepts.",
  },
  {
    name: "Cyber Security",
    description: "Practice cyber security fundamentals.",
  },
  {
    name: "Mobile Development",
    description: "Practice Android and mobile app development concepts.",
  },
  {
    name: "Machine Learning",
    description: "Practice machine learning fundamentals.",
  },
  {
    name: "Cloud Computing",
    description: "Practice cloud computing concepts.",
  },
  {
    name: "Database Systems",
    description: "Practice database system concepts.",
  },
  {
    name: "Software Engineering",
    description: "Practice software engineering principles.",
  },
];

async function seedInterests() {
  try {
    const count = await Interest.countDocuments();

    if (count > 0) {
      console.log("Default interests already exist");
      return;
    }

    await Interest.insertMany(defaultInterests);
    console.log("Default interests inserted");
  } catch (error) {
    console.error("Seed interests error:", error.message);
  }
}

module.exports = seedInterests;