module.exports = app => {
  const { mongoose } = app;
  const schema = new mongoose.Schema(
    {
      taskId: { type: String },
      uuid: { type: String },
      file: { type: String },
      state: { type: String, default: "no" },
      percent: { type: Number, default: 0 }
    },
    { timestamps: { createdAt: "created", updatedAt: "updated" } }
  );
  return mongoose.model("video", schema);
};
