module.exports = app => ({
  async upload() {
    const { ctx, $service, $helper } = app;
    const file = ctx.request.files.file;
    const folder = `files`;
    const result = await $service.file.fileUpload({ file, folder });
    $helper.returnBody(true, result);
  }
});
