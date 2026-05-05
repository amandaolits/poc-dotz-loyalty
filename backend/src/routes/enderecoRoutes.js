const express = require("express");
const router = express.Router();
router.get("/", (req, res) => res.json({ message: "Not implemented yet" }));
router.post("/", (req, res) => res.json({ message: "Not implemented yet" }));
router.put("/:id", (req, res) => res.json({ message: "Not implemented yet" }));
router.delete("/:id", (req, res) => res.json({ message: "Not implemented yet" }));
module.exports = router;
