// const express = require("express");
// const router = express.Router();
// const Feedback = require("../model/Feedback");

// // POST: Submit feedback
// router.post("/", async (req, res) => {
//   try {
//     console.log("Received screenshot length:", req.body.screenshot?.length);

//     const feedback = new Feedback({
//       title: req.body.title,
//       description: req.body.description,
//       email: req.body.email,
//       severity: req.body.severity || "low",
//       status: req.body.status || "open",
//       screenshot: req.body.screenshot, // store base64 in DB
//       metadata: {
//         url: req.body.url,
//         browser: req.body.browser || req.body.userAgent,
//         viewport: req.body.viewport,
//       },
//       submittedAt: req.body.submittedAt || new Date(),
//     });

//     const savedFeedback = await feedback.save();
//     res.json(savedFeedback);
//   } catch (err) {
//     console.error("❌ Error saving feedback:", err);
//     res.status(500).json({ message: "Server error" });
//   }
//   console.log("📦 Received payload:", req.body);
// });

// // GET: Fetch feedbacks
// router.get("/", async (req, res) => {
//   try {
//     const feedbacks = await Feedback.find().sort({ submittedAt: -1 });
//     res.json(feedbacks);
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // PATCH: Update status
// router.patch("/feedback/:id", async (req, res) => {
//   try {
//     const { status } = req.body;
//     const updatedFeedback = await Feedback.findByIdAndUpdate(
//       req.params.id,
//       { status },
//       { new: true } // return updated document
//     );
//     console.log("Updated feedback in DB:", updatedFeedback);

//     if (!updatedFeedback) return res.status(404).json({ message: "Feedback not found" });
//     res.json(updatedFeedback);
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const Feedback = require("../model/Feedback");

// POST: Submit feedback
router.post("/", async (req, res) => {
  try {
    console.log("📥 Received payload:", req.body);

    const feedback = new Feedback({
      title: req.body.title,
      description: req.body.description,
      email: req.body.email,
      severity: req.body.severity || "low",
      status: req.body.status || "open",
      screenshot: req.body.screenshot, // store base64 in DB
      metadata: {
        url: req.body.url,
        browser: req.body.browser || req.body.userAgent,
        viewport: req.body.viewport,
      },
      submittedAt: req.body.submittedAt || new Date(),
    });

    const savedFeedback = await feedback.save();
    res.json(savedFeedback);
  } catch (err) {
    console.error("❌ Error saving feedback:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET: Fetch feedbacks (optimized)
router.get("/", async (req, res) => {
  try {
    // ✅ Return only required fields and limit results
    const feedbacks = await Feedback.find({}, "title description severity status submittedAt metadata screenshot")
      .sort({ submittedAt: -1 })
      .limit(100) // limit for faster response
      .lean(); // ✅ convert to plain JS objects for faster performance

    res.json(feedbacks);
  } catch (err) {
    console.error("❌ Error fetching feedback:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PATCH: Update status (optimized)
router.patch("/feedback/:id", async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: "Status is required" });

    const updatedFeedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true, projection: "title description severity status submittedAt metadata screenshot" }
    ).lean();

    if (!updatedFeedback) return res.status(404).json({ message: "Feedback not found" });

    console.log("✅ Updated feedback in DB:", updatedFeedback);
    res.json(updatedFeedback);
  } catch (error) {
    console.error("❌ Error updating feedback:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
