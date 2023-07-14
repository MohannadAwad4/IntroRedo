const express = require("express");
const app = express();
const port = 4000;
const jobs=require("./jobs");
app.use((req, res, next) => {
    res.on("finish", () => {
      // the 'finish' event will be emitted when the response is handed over to the OS
      console.log(`Request: ${req.method} ${req.originalUrl} ${res.statusCode}`);
    });
    next();
  });
app.get("/", (req, res) => {
  res.send("Welcome to the Job Application Tracker API!");
});

// List all jobs
app.get("/jobs", (req, res) => {
    res.send(jobs);
  });
  app.use(express.json());
  
  // Get a specific job
app.get("/jobs/:id", (req, res) => {
    const jobId = parseInt(req.params.id);
    const job = jobs.find((job) => job.id === jobId);
    if (job) {
      res.send(job);
    } else {
      res.status(404).send({ message: "Job not found" });
    }
  });

  function getNextIdFromCollection(collection) {
    if(collection.length === 0) return 1; 
    const lastRecord = collection[collection.length - 1];
    return lastRecord.id + 1;
  }
  // ...
 // Create a new job
app.post("/jobs", (req, res) => {
    const newJob = req.body;
    jobs.push(newJob);
    res.status(201).send(newJob);
  });
  
// Update a specific job
app.patch("/jobs/:id", (req, res) => {
    const jobId = parseInt(req.params.id, 10);
    const jobUpdates = req.body;
    const jobIndex = jobs.findIndex((job) => job.id === jobId);
    const updatedJob = { ...jobs[jobIndex], ...jobUpdates };
    if (jobIndex !== -1) {
      jobs[jobIndex] = updatedJob;
      res.send(updatedJob);
    } else {
      res.status(404).send({ message: "Job not found" });
    }
  });

  // Delete a specific job

app.delete("/jobs/:id", (req, res) => {
    const jobId = parseInt(req.params.id, 10);
    const jobIndex = jobs.findIndex((job) => job.id === jobId);
    if (jobIndex !== -1) {
      jobs.splice(jobIndex, 1);
      res.send({ message: "Job deleted successfully" });
    } else {
      res.status(404).send({ message: "Job not found" });
    }
  });

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});