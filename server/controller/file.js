module.exports = app => ({
  async upload() {
    const { ctx, $service, $helper } = app;
    const file = ctx.request.files.file;
    const folder = `files`;
    const id = ctx.request.body.id
    const result = await $service.file.fileUpload({ file, folder },id);
    $helper.returnBody(true, result);
  }
});
