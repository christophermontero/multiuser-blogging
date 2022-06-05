exports.time = (req, res) => {
  res.json({ time: new Date().toString() });
};
